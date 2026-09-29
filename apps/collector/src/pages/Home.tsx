import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, StatusChip, AudioReadoutButton, TouchButton } from '@kabadiwala/ui';
import { db } from '../services/db';
import type { ScrapLot } from '@kabadiwala/shared';
import type { TabKey } from '../components/BottomNav';

interface HomeProps {
  onNavigate: (tab: TabKey, params?: any) => void;
  onOpenLotDetails?: (lot: ScrapLot) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user, collectorProfile, location } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const [activeLots, setActiveLots] = useState<ScrapLot[]>([]);

  useEffect(() => {
    const loadLots = async () => {
      try {
        const lots = await db.lots.orderBy('created_at').reverse().limit(10).toArray();
        setActiveLots(lots);
      } catch (err) {
        console.error('Failed to load lots from Dexie:', err);
      }
    };

    loadLots();
  }, []);

  const totalEarnings = collectorProfile?.total_earnings || 3850;
  const totalWeight = collectorProfile?.total_kg_recycled || 68.5;
  const greenSubsidy = 210.0;
  const lotsCount = activeLots.length || 3;

  const audioSummary = `नमस्ते ${user?.name || ''}। आपकी आज की कुल कमाई ₹${totalEarnings} है। आपने कुल ${totalWeight} किलो ई-कचरा एकत्र किया है।`;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Top Banner Status Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusChip status="verified" label="CPCB Verified" />
          <StatusChip
            status="online"
            label={location.isFallback ? 'Delhi Hub' : 'GPS Active'}
          />
        </div>
        <AudioReadoutButton textToSpeak={audioSummary} lang={currentLanguage.bcp47} size="sm" />
      </div>

      {/* Hero Bento Card: Today's Earnings */}
      <Card level={2} accent="primary" className="bg-gradient-to-br from-primary to-[#00381e] text-on-primary p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-primary-container block">
              {t.todayEarnings}
            </span>
            <div className="text-3xl font-black tracking-tight text-white flex items-baseline gap-1 mt-0.5">
              <span>₹{totalEarnings.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-success-container bg-success/30 px-2 py-0.5 rounded-full">
                +14% MSP
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-surface/10 border border-white/20 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
        </div>

        {/* 3-Stat Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-[10px] text-white/80 font-bold">{t.totalScrapCollected}</div>
            <div className="text-base font-black text-white mt-0.5">{totalWeight} kg</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-[10px] text-white/80 font-bold">{t.activeLots}</div>
            <div className="text-base font-black text-secondary-container mt-0.5">{lotsCount}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-[10px] text-white/80 font-bold">हरित सब्सिडी</div>
            <div className="text-base font-black text-tertiary-container mt-0.5">₹{greenSubsidy}</div>
          </div>
        </div>
      </Card>

      {/* Oversized 2x2 Action Tiles */}
      <div className="grid grid-cols-2 gap-3">
        {/* Add Scrap Button */}
        <button
          onClick={() => onNavigate('add-scrap')}
          className="p-4 bg-primary-container text-on-primary-container border-2 border-primary rounded-2xl flex flex-col items-center text-center justify-center gap-2 shadow-md hover:shadow-lg active:translate-y-[2px] transition-all min-h-[120px] group"
        >
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <span className="material-symbols-outlined text-2xl">add_a_photo</span>
          </div>
          <div>
            <div className="font-black text-sm text-primary">{t.addScrap}</div>
            <div className="text-[10px] text-on-primary-container/80 font-bold mt-0.5">
              AI कैमरा व वजन
            </div>
          </div>
        </button>

        {/* Price Board Button */}
        <button
          onClick={() => onNavigate('prices')}
          className="p-4 bg-secondary-container text-on-secondary-container border-2 border-secondary rounded-2xl flex flex-col items-center text-center justify-center gap-2 shadow-md hover:shadow-lg active:translate-y-[2px] transition-all min-h-[120px] group"
        >
          <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <span className="material-symbols-outlined text-2xl">currency_rupee</span>
          </div>
          <div>
            <div className="font-black text-sm text-secondary">{t.priceBoard}</div>
            <div className="text-[10px] text-on-secondary-container/80 font-bold mt-0.5">
              7 श्रेणियां • CPCB MSP
            </div>
          </div>
        </button>

        {/* Handover QR Button */}
        <button
          onClick={() => onNavigate('add-scrap', { step: 4 })}
          className="p-4 bg-surface-container-low text-on-surface border-2 border-outline-variant rounded-2xl flex flex-col items-center text-center justify-center gap-2 shadow-md hover:shadow-lg active:translate-y-[2px] transition-all min-h-[120px] group"
        >
          <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center group-hover:scale-105 transition-transform border border-outline-variant">
            <span className="material-symbols-outlined text-2xl">qr_code_2</span>
          </div>
          <div>
            <div className="font-black text-sm text-on-surface">{t.handoverQr}</div>
            <div className="text-[10px] text-on-surface-variant font-bold mt-0.5">
              सुरक्षित रीसाइक्लर सत्यापन
            </div>
          </div>
        </button>

        {/* Safety Guidelines Button */}
        <button
          onClick={() => onNavigate('safety')}
          className="p-4 bg-surface-container-low text-on-surface border-2 border-outline-variant rounded-2xl flex flex-col items-center text-center justify-center gap-2 shadow-md hover:shadow-lg active:translate-y-[2px] transition-all min-h-[120px] group"
        >
          <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center group-hover:scale-105 transition-transform border border-error/20">
            <span className="material-symbols-outlined text-2xl">health_and_safety</span>
          </div>
          <div>
            <div className="font-black text-sm text-error">{t.safetyGuidelines}</div>
            <div className="text-[10px] text-on-surface-variant font-bold mt-0.5">
              बैटरी व रसायन सुरक्षा
            </div>
          </div>
        </button>
      </div>

      {/* Active Lots Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
            <span>सक्रिय लॉट सूची ({activeLots.length || 2})</span>
          </h2>
          <button
            onClick={() => onNavigate('ledger')}
            className="text-xs font-black text-primary flex items-center gap-0.5"
          >
            <span>सभी देखें</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {activeLots.length === 0 ? (
          <div className="space-y-2">
            {/* Demo Lots if Dexie is empty */}
            <Card level={1} className="p-3.5 border-l-4 border-l-primary flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-on-surface">सर्किट बोर्ड (PCB)</span>
                  <span className="text-[10px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-black">
                    8.5 kg
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant font-medium">
                  अनुमानित मूल्य: <span className="font-bold text-primary">₹3,485</span> • EcoRecycle Peenya
                </div>
              </div>
              <button
                onClick={() => onNavigate('add-scrap', { step: 4 })}
                className="px-3 py-2 bg-primary text-on-primary rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-base">qr_code</span>
                <span>QR कोड</span>
              </button>
            </Card>

            <Card level={1} className="p-3.5 border-l-4 border-l-secondary flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-on-surface">लिथियम-आयन बैटरी</span>
                  <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-black">
                    4.2 kg
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant font-medium">
                  अनुमानित मूल्य: <span className="font-bold text-secondary">₹1,134</span> • GreenEarth Recyclers
                </div>
              </div>
              <button
                onClick={() => onNavigate('add-scrap', { step: 4 })}
                className="px-3 py-2 bg-secondary text-on-secondary rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-base">qr_code</span>
                <span>QR कोड</span>
              </button>
            </Card>
          </div>
        ) : (
          <div className="space-y-2">
            {activeLots.map((lot) => (
              <Card
                key={lot.id}
                level={1}
                className="p-3.5 border-l-4 border-l-primary flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-on-surface">{lot.category}</span>
                    <span className="text-[10px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-black">
                      {lot.weight_kg} kg
                    </span>
                    <span className="text-[10px] bg-surface-container-highest text-on-surface-variant px-1.5 py-0.5 rounded font-bold">
                      {lot.condition}
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant font-medium">
                    अनुमानित: <span className="font-bold text-primary">₹{lot.estimated_payout}</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('add-scrap', { step: 4, lot })}
                  className="px-3 py-2 bg-primary text-on-primary rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:translate-y-[1px]"
                >
                  <span className="material-symbols-outlined text-base">qr_code</span>
                  <span>QR</span>
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Scrap CTA */}
      <div className="pt-2">
        <TouchButton
          variant="affirmative"
          size="lg"
          fullWidth
          icon="add_circle"
          onClick={() => onNavigate('add-scrap')}
        >
          {t.addScrap} (+AI कैमरा)
        </TouchButton>
      </div>
    </div>
  );
};
