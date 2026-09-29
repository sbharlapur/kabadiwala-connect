import { useState, useEffect } from 'react';
import { db } from './db';
import { api, type ScrapLot, type PriceRecord } from '@kabadiwala/shared';

export class SyncEngine {
  private static instance: SyncEngine;
  private isProcessing = false;
  private listeners: ((isOnline: boolean, pendingCount: number) => void)[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleConnectivityChange(true));
      window.addEventListener('offline', () => this.handleConnectivityChange(false));

      // Periodic sync loop every 15 seconds if online
      setInterval(() => {
        if (navigator.onLine && !this.isProcessing) {
          this.processOutbox();
        }
      }, 15000);
    }
  }

  public static getInstance(): SyncEngine {
    if (!SyncEngine.instance) {
      SyncEngine.instance = new SyncEngine();
    }
    return SyncEngine.instance;
  }

  public subscribe(listener: (isOnline: boolean, pendingCount: number) => void) {
    this.listeners.push(listener);
    this.getPendingCount().then((count) => {
      listener(navigator.onLine, count);
    });

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.getPendingCount().then((count) => {
      const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
      this.listeners.forEach((l) => l(online, count));
    });
  }

  private handleConnectivityChange(online: boolean) {
    this.notify();
    if (online) {
      this.processOutbox();
      this.refreshPrices();
    }
  }

  public async getPendingCount(): Promise<number> {
    try {
      return await db.outbox.where('status').equals('PENDING').count();
    } catch {
      return 0;
    }
  }

  public async queueLotCreation(lotData: any): Promise<ScrapLot> {
    const clientUuid = crypto.randomUUID();
    const tempId = `lot_local_${Date.now()}`;

    const newLot: ScrapLot = {
      id: tempId,
      client_uuid: clientUuid,
      collector_id: lotData.collector_id || 'collector-local',
      category: lotData.category,
      weight_kg: lotData.weight_kg,
      unit_price: lotData.unit_price || 410,
      condition: lotData.condition || 'GOOD',
      confidence_score: 96,
      photo_urls: lotData.photo_urls || [],
      photo_hashes: [],
      estimated_payout: lotData.estimated_payout,
      status: 'PENDING',
      verification_status: 'UNVERIFIED',
      matched_recycler_id: lotData.matched_recycler_id,
      qr_token: lotData.qr_token || `KC:TMP:${Date.now()}:DEMO_SIG`,
      fallback_code: lotData.fallback_code || '5824',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      offline_created: true
    };

    // Store in local DB first
    await db.lots.put(newLot);

    // Add to outbox queue
    await db.outbox.add({
      clientUuid,
      action: 'CREATE_LOT',
      payload: { ...lotData, client_uuid: clientUuid },
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: 'PENDING'
    });

    this.notify();

    // Trigger immediate sync if online
    if (navigator.onLine) {
      this.processOutbox();
    }

    return newLot;
  }

  public async processOutbox(): Promise<void> {
    if (this.isProcessing || !navigator.onLine) return;
    this.isProcessing = true;

    try {
      const pendingItems = await db.outbox.where('status').equals('PENDING').toArray();

      for (const item of pendingItems) {
        if (!item.id) continue;
        await db.outbox.update(item.id, { status: 'SYNCING' });

        try {
          if (item.action === 'CREATE_LOT') {
            const serverLot = await api.createScrapLot(item.payload);
            // Replace local placeholder with server-assigned lot
            if (serverLot && serverLot.id) {
              await db.lots.delete(item.payload.id || `lot_local_${item.payload.client_uuid}`);
              await db.lots.put(serverLot);
            }
          }

          // Mark outbox item as completed (delete from outbox)
          await db.outbox.delete(item.id);
        } catch (err: any) {
          console.error(`Sync error on outbox item ${item.id}:`, err);
          const nextRetry = (item.retryCount || 0) + 1;
          await db.outbox.update(item.id, {
            status: nextRetry > 5 ? 'FAILED' : 'PENDING',
            retryCount: nextRetry,
            lastError: err.message
          });
        }
      }
    } finally {
      this.isProcessing = false;
      this.notify();
    }
  }

  public async refreshPrices(): Promise<PriceRecord[]> {
    try {
      const prices = await api.getPriceBoard();
      for (const p of prices) {
        await db.prices.put(p);
      }
      return prices;
    } catch (err) {
      console.warn('Failed to fetch remote prices, reading from Dexie cache:', err);
      return await db.prices.toArray();
    }
  }
}

export const syncEngine = SyncEngine.getInstance();

export const useSyncStatus = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((online, pending) => {
      setIsOnline(online);
      setPendingCount(pending);
    });
    return unsubscribe;
  }, []);

  return {
    isOnline,
    pendingCount,
    syncNow: () => syncEngine.processOutbox()
  };
};
