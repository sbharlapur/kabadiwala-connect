import React, { useState } from 'react';
import { Card, StatusChip, TouchButton } from '@kabadiwala/ui';

interface PayoutRecord {
  id: string;
  txnId: string;
  date: string;
  collectorName: string;
  collectorBadge: string;
  upiId: string;
  category: string;
  netWeightKg: number;
  ratePerKg: number;
  condition: string;
  subsidy: number;
  totalAmount: number;
  form6Ref: string;
  status: 'SETTLED' | 'PROCESSING';
}

const MOCK_SETTLEMENTS: PayoutRecord[] = [
  {
    id: 'pay-1',
    txnId: 'TXN-CPCB-88219401',
    date: '2026-09-28 11:32 AM',
    collectorName: 'Ramesh Kumar',
    collectorBadge: 'DEL-KAB-0042',
    upiId: 'ramesh.kumar@okhdfcbank',
    category: 'PCB (Printed Circuit Boards)',
    netWeightKg: 8.5,
    ratePerKg: 410,
    condition: 'GOOD (100%)',
    subsidy: 45,
    totalAmount: 3530,
    form6Ref: 'CPCB-F6-2026-DEL-00941',
    status: 'SETTLED'
  },
  {
    id: 'pay-2',
    txnId: 'TXN-CPCB-88219398',
    date: '2026-09-28 10:18 AM',
    collectorName: 'Sanjay Yadav',
    collectorBadge: 'DEL-KAB-0019',
    upiId: 'sanjay.scrap@paytm',
    category: 'BATTERIES (Li-Ion / LFP Cells)',
    netWeightKg: 14.2,
    ratePerKg: 185,
    condition: 'GOOD (100%)',
    subsidy: 60,
    totalAmount: 2687,
    form6Ref: 'CPCB-F6-2026-DEL-00940',
    status: 'SETTLED'
  },
  {
    id: 'pay-3',
    txnId: 'TXN-CPCB-88219385',
    date: '2026-09-27 04:50 PM',
    collectorName: 'Mohd. Imran',
    collectorBadge: 'DEL-KAB-0081',
    upiId: 'imran.kabadi@axisbank',
    category: 'CABLES (Insulated Copper Wiring)',
    netWeightKg: 32.0,
    ratePerKg: 290,
    condition: 'BROKEN (85%)',
    subsidy: 85,
    totalAmount: 7973,
    form6Ref: 'CPCB-F6-2026-DEL-00939',
    status: 'SETTLED'
  },
  {
    id: 'pay-4',
    txnId: 'TXN-CPCB-88219350',
    date: '2026-09-27 01:20 PM',
    collectorName: 'Anita Devi',
    collectorBadge: 'DEL-KAB-0056',
    upiId: 'anita.devi@sbi',
    category: 'MIXED_PLASTICS (E-Waste ABS/HIPS)',
    netWeightKg: 45.0,
    ratePerKg: 35,
    condition: 'GOOD (100%)',
    subsidy: 50,
    totalAmount: 1625,
    form6Ref: 'CPCB-F6-2026-DEL-00938',
    status: 'SETTLED'
  }
];

export const PayoutLedger: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<PayoutRecord | null>(null);

  const totalDisbursed = MOCK_SETTLEMENTS.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Title & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">
              receipt_long
            </span>
            <span>Collector Instant Payout Ledger</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Real-time direct UPI/NPCI settlements & green mobility subsidy credits
          </p>
        </div>

        <div className="p-3 bg-surface-container-lowest border-2 border-primary rounded-2xl text-right">
          <div className="text-[10px] font-black uppercase text-on-surface-variant">
            Total Disbursed (Last 48 Hrs)
          </div>
          <div className="text-xl font-black text-primary font-mono">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container border-b-2 border-outline-variant font-black text-on-surface uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Txn ID / Date</th>
                <th className="p-4">Collector</th>
                <th className="p-4">Material & Weight</th>
                <th className="p-4">Condition</th>
                <th className="p-4 text-right">Total Payout</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 font-medium">
              {MOCK_SETTLEMENTS.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="hover:bg-surface-container-low/60 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="font-mono font-black text-primary text-xs">
                      {record.txnId}
                    </div>
                    <div className="text-[10px] text-on-surface-variant">
                      {record.date}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-on-surface">
                      {record.collectorName}
                    </div>
                    <div className="text-[10px] font-mono text-on-surface-variant">
                      {record.collectorBadge} • {record.upiId}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-on-surface">
                      {record.category}
                    </div>
                    <div className="font-mono text-xs font-black text-primary">
                      {record.netWeightKg} kg @ ₹{record.ratePerKg}/kg
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                      {record.condition}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="font-black text-sm text-success font-mono">
                      ₹{record.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-on-surface-variant">
                      incl. ₹{record.subsidy} subsidy
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <StatusChip status="verified" label="UPI Settled" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Receipt Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-2 border-primary rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-2xl">
                  check_circle
                </span>
                <span className="font-black text-base text-on-surface">
                  Digital Settlement Receipt
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-sans">Transaction Reference:</span>
                <span className="font-bold text-on-surface">{selectedRecord.txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-sans">Timestamp:</span>
                <span className="text-on-surface">{selectedRecord.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-sans">Collector:</span>
                <span className="font-bold text-on-surface font-sans">{selectedRecord.collectorName} ({selectedRecord.collectorBadge})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-sans">Beneficiary VPA:</span>
                <span className="text-primary font-bold">{selectedRecord.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-sans">CPCB Form-6 Ref:</span>
                <span className="text-success font-bold">{selectedRecord.form6Ref}</span>
              </div>
              <div className="pt-2 border-t border-outline-variant flex justify-between items-baseline font-sans">
                <span className="font-bold text-on-surface">Total Settled:</span>
                <span className="text-2xl font-black text-primary font-mono">
                  ₹{selectedRecord.totalAmount}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <TouchButton
                variant="affirmative"
                size="md"
                fullWidth
                onClick={() => setSelectedRecord(null)}
              >
                Close Receipt
              </TouchButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
