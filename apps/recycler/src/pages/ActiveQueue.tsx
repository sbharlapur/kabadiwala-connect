import React, { useState } from 'react';
import { Card, StatusChip, TouchButton } from '@kabadiwala/ui';
import type { ScrapLot } from '@kabadiwala/shared';

interface ActiveQueueProps {
  onSelectLotForIntake: (lot: ScrapLot) => void;
}

const MOCK_INCOMING_LOTS: ScrapLot[] = [
  {
    id: 'lot-881',
    collector_id: 'cp-demo-1',
    category: 'PCB',
    weight_kg: 8.5,
    unit_price: 410,
    condition: 'GOOD',
    confidence_score: 96,
    photo_urls: ['/sample-pcb.jpg'],
    photo_hashes: ['a1b2c3d4e5f6'],
    estimated_payout: 3485,
    status: 'IN_TRANSIT',
    verification_status: 'AI_VERIFIED',
    matched_recycler_id: 'rec-1',
    qr_token: 'KC:PCB:1727500000:VERIFIED_HMAC_SIG',
    fallback_code: '5824',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lot-882',
    collector_id: 'cp-demo-2',
    category: 'BATTERIES',
    weight_kg: 14.2,
    unit_price: 185,
    condition: 'GOOD',
    confidence_score: 94,
    photo_urls: ['/sample-battery.jpg'],
    photo_hashes: ['b2c3d4e5f6a1'],
    estimated_payout: 2627,
    status: 'MATCHED',
    verification_status: 'AI_VERIFIED',
    matched_recycler_id: 'rec-1',
    qr_token: 'KC:BAT:1727500120:SIG2',
    fallback_code: '9103',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lot-883',
    collector_id: 'cp-demo-3',
    category: 'CABLES',
    weight_kg: 22.0,
    unit_price: 290,
    condition: 'BROKEN',
    confidence_score: 89,
    photo_urls: ['/sample-cables.jpg'],
    photo_hashes: ['c3d4e5f6a1b2'],
    estimated_payout: 5423,
    status: 'PENDING',
    verification_status: 'AI_VERIFIED',
    matched_recycler_id: 'rec-1',
    qr_token: 'KC:CAB:1727500340:SIG3',
    fallback_code: '3741',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const ActiveQueue: React.FC<ActiveQueueProps> = ({ onSelectLotForIntake }) => {
  const [filter, setFilter] = useState<'ALL' | 'MATCHED' | 'IN_TRANSIT'>('ALL');

  const filteredLots = MOCK_INCOMING_LOTS.filter((lot) => {
    if (filter === 'MATCHED') return lot.status === 'MATCHED';
    if (filter === 'IN_TRANSIT') return lot.status === 'IN_TRANSIT';
    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header & Metric Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">
              move_to_inbox
            </span>
            <span>Incoming Collector Lots Queue</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Real-time GPS routing & pre-booked intake at Mayapuri Cluster
          </p>
        </div>

        <div className="flex gap-2">
          {(['ALL', 'MATCHED', 'IN_TRANSIT'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filter === mode
                  ? 'bg-primary text-on-primary shadow'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {mode === 'ALL' ? 'All (3)' : mode === 'MATCHED' ? 'At Weighbridge (1)' : 'En Route (1)'}
            </button>
          ))}
        </div>
      </div>

      {/* Lot Cards List */}
      <div className="space-y-4">
        {filteredLots.map((lot) => {
          const isAtWeighbridge = lot.status === 'MATCHED';
          return (
            <Card
              key={lot.id}
              level={2}
              accent={isAtWeighbridge ? 'primary' : 'neutral'}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high border-2 border-outline-variant flex items-center justify-center text-2xl font-black text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl">
                    {lot.category === 'PCB'
                      ? 'developer_board'
                      : lot.category === 'BATTERIES'
                      ? 'battery_charging_full'
                      : 'cable'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-on-surface">
                      Lot #{lot.id}
                    </span>
                    <span className="text-xs font-mono font-bold bg-surface-container-high px-2 py-0.5 rounded text-primary">
                      {lot.category}
                    </span>
                    <StatusChip
                      status={isAtWeighbridge ? 'verified' : 'online'}
                      label={isAtWeighbridge ? 'At Weighbridge' : 'En Route (1.4 km)'}
                    />
                  </div>

                  <div className="text-xs text-on-surface-variant font-medium">
                    Collector: <strong className="text-on-surface">Ramesh Kumar (DEL-KAB-0042)</strong> • Declared Weight: <strong className="text-on-surface">{lot.weight_kg} kg</strong>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant pt-1">
                    <span>Est. Payout: <strong className="text-success font-sans">₹{lot.estimated_payout}</strong></span>
                    <span>• Fallback PIN: <strong className="text-primary font-bold">{lot.fallback_code}</strong></span>
                    <span>• AI Score: <strong>{lot.confidence_score}%</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <TouchButton
                  variant={isAtWeighbridge ? 'affirmative' : 'payout'}
                  size="md"
                  icon="qr_code_scanner"
                  onClick={() => onSelectLotForIntake(lot)}
                >
                  {isAtWeighbridge ? 'Inspect & Settle' : 'Verify Handover'}
                </TouchButton>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
