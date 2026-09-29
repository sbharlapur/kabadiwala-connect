import Dexie, { type Table } from 'dexie';
import type { ScrapLot, PriceRecord, CollectorProfile } from '@kabadiwala/shared';

export interface OutboxItem {
  id?: number;
  clientUuid: string;
  action: 'CREATE_LOT' | 'CONFIRM_HANDOVER' | 'UPDATE_PROFILE';
  payload: any;
  createdAt: string;
  retryCount: number;
  lastError?: string;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

export interface LocalNotification {
  id?: number;
  title: string;
  message: string;
  type: 'PAYOUT' | 'PRICE_UPDATE' | 'SAFETY' | 'SYNC';
  timestamp: string;
  read: boolean;
  amount?: number;
}

export class KabadiwalaDatabase extends Dexie {
  lots!: Table<ScrapLot, string>;
  prices!: Table<PriceRecord, string>;
  outbox!: Table<OutboxItem, number>;
  profile!: Table<CollectorProfile, string>;
  notifications!: Table<LocalNotification, number>;

  constructor() {
    super('KabadiwalaConnectCollectorDB');
    this.version(1).stores({
      lots: 'id, client_uuid, category, status, created_at, collector_id',
      prices: 'category, base_rate_per_kg, last_updated',
      outbox: '++id, clientUuid, action, status, createdAt',
      profile: 'id, user_id, badge_number',
      notifications: '++id, type, timestamp, read'
    });
  }
}

export const db = new KabadiwalaDatabase();
