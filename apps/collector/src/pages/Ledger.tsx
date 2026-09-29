import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, StatusChip, AudioReadoutButton } from '@kabadiwala/ui';
import type { HandoverTransaction } from '@kabadiwala/shared';

interface LedgerProps {
  onNavigateHome: () => void;
}

const SAMPLE_TRANSACTIONS: HandoverTransaction[] = [
  {
    id: 'txn-101',
    lot_id: 'lot-881',
    collector_id: 'cp-demo-1',
    recycler_id: 'rec-1',
    category: 'PCB',
    weight_kg: 8.5,
    unit_price: 410,
    total_payout: 3485,
    status: 'COMPLETED',
    qr_token: 'KC:PCB:1727500000:VERIFIED',
    fallback_code: '5824',
    tamper_check_passed: true,
    collector_name: 'रमेश कुमार',
    recycler_name: 'EcoRecycle Solutions Hub',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'txn-102',
    lot_id: 'lot-882',
    collector_id: 'cp-demo-1',
    recycler_id: 'rec-2',
    category: 'BATTERIES',
    weight_kg: 4.2,
    unit_price: 270,
    total_payout: 1134,
    status: 'COMPLETED',
    qr_token: 'KC:BAT:1727400000:VERIFIED',
    fallback_code: '3190',
    tamper_check_passed: true,
    collector_name: 'रमेश कुमार',
    recycler_name: 'GreenEarth Metal & E-Waste Refiners',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'txn-103',
    lot_id: 'lot-883',
    collector_id: 'cp-demo-1',
    recycler_id: 'rec-1',
    category: 'CABLES',
    weight_kg: 12.0,
    unit_price: 580,
    total_payout: 6960,
    status: 'COMPLETED',
    qr_token: 'KC:CAB:1727300000:VERIFIED',
    fallback_code: '8241',
    tamper_check_passed: true,
    collector_name: 'रमेश कुमार',
    recycler_name: 'EcoRecycle Solutions Hub',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const Ledger: React.FC<LedgerProps> = () => {
  const { collectorProfile } = useAuth();
  const { currentLanguage } = useLanguage();
  const [transactions] = useState<HandoverTransaction[]>(SAMPLE_TRANSACTIONS);

  const totalEarnings = collectorProfile?.total_earnings || 11579;
  const totalWeight = collectorProfile?.total_kg_recycled || 24.7;
  const totalSubsidy = 138;

  const audioSummary = `आपका वित्तीय खाता: कुल भुगतान ₹${totalEarnings}। कुल हरित मोबिलिटी सब्सिडी ₹${totalSubsidy}। सभी लेनदेन CPCB सत्यापित हैं।`;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              account_balance_wallet
            </span>
            <span>खाता व कमाई (Ledger)</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            पारदर्शी डिजिटल भुगतान व CPCB ऑडिट रिकॉर्ड
          </p>
        </div>
        <AudioReadoutButton textToSpeak={audioSummary} lang={currentLanguage.bcp47} size="sm" />
      </div>

      {/* Summary Bento */}
      <Card level={1} className="p-4 bg-gradient-to-br from-surface-container-low to-surface-container-high">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
            कुल संचित आय (Lifetime Earnings)
          </span>
          <span className="text-xs font-black text-success flex items-center gap-1 bg-success/10 px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-sm">verified</span>
            100% Paid
          </span>
        </div>
        <div className="text-3xl font-black text-primary mb-3">
          ₹{totalEarnings.toLocaleString('en-IN')}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant">
          <div className="bg-surface p-2.5 rounded-xl border border-outline-variant/30">
            <div className="text-[10px] text-on-surface-variant font-bold">कुल ई-कचरा वजन</div>
            <div className="text-base font-black text-on-surface mt-0.5">{totalWeight} kg</div>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-outline-variant/30">
            <div className="text-[10px] text-on-surface-variant font-bold">हरित सब्सिडी (₹3.5/km)</div>
            <div className="text-base font-black text-tertiary mt-0.5">₹{totalSubsidy}</div>
          </div>
        </div>
      </Card>

      {/* UPI / Bank Details Box */}
      <div className="p-3 bg-surface-container-low border-2 border-outline-variant rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-lg">account_balance</span>
          </div>
          <div>
            <div className="text-xs font-black text-on-surface">लिंक्ड बैंक खाता / UPI</div>
            <div className="text-[11px] font-mono text-on-surface-variant">
              {collectorProfile?.upi_id || '9876543210@upi'}
            </div>
          </div>
        </div>
        <StatusChip status="verified" label="KYC OK" />
      </div>

      {/* Transaction History Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-on-surface uppercase tracking-wider">
            हालिया भुगतान रसीदें (Recent Payouts)
          </h3>
          <span className="text-[11px] font-bold text-on-surface-variant">
            {transactions.length} लेनदेन
          </span>
        </div>

        <div className="space-y-2">
          {transactions.map((txn) => (
            <Card
              key={txn.id}
              level={1}
              className="p-3.5 border-l-4 border-l-success flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-on-surface">₹{txn.total_payout}</span>
                  <span className="text-[10px] bg-success-container text-on-success-container px-1.5 py-0.5 rounded font-black">
                    UPI
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {txn.weight_kg} kg • {txn.category}
                  </span>
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  {new Date(txn.created_at).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}{' '}
                  • {txn.recycler_name}
                </div>
              </div>

              <div className="text-right">
                <span className="material-symbols-outlined text-success text-2xl">
                  check_circle
                </span>
                <div className="text-[9px] font-mono text-on-surface-variant">{txn.id}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
