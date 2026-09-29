import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrapPriceCard, AudioReadoutButton, TouchButton } from '@kabadiwala/ui';
import { syncEngine } from '../services/syncService';
import type { PriceRecord, MaterialCategory } from '@kabadiwala/shared';
import type { TabKey } from '../components/BottomNav';

interface PriceBoardProps {
  onNavigate: (tab: TabKey) => void;
}

const DEFAULT_PRICES: PriceRecord[] = [
  {
    id: 'p-1',
    category: 'CABLES',
    category_name_hi: 'तांबा तार व केबल',
    category_name_en: 'Copper Wire & Cable',
    base_rate_per_kg: 580,
    min_rate_per_kg: 550,
    max_rate_per_kg: 620,
    cpcb_floor_price: 550,
    trend: 'UP',
    trend_percentage: 5.4,
    unit: 'kg',
    last_updated: new Date().toISOString()
  },
  {
    id: 'p-2',
    category: 'PCB',
    category_name_hi: 'सर्किट बोर्ड (PCB)',
    category_name_en: 'Printed Circuit Board',
    base_rate_per_kg: 410,
    min_rate_per_kg: 380,
    max_rate_per_kg: 450,
    cpcb_floor_price: 380,
    trend: 'UP',
    trend_percentage: 7.9,
    unit: 'kg',
    last_updated: new Date().toISOString()
  },
  {
    id: 'p-3',
    category: 'LCD_LED',
    category_name_hi: 'स्मार्टफोन व डिस्प्ले स्क्रीन',
    category_name_en: 'Smartphones & Displays',
    base_rate_per_kg: 320,
    min_rate_per_kg: 300,
    max_rate_per_kg: 360,
    cpcb_floor_price: 300,
    trend: 'STABLE',
    trend_percentage: 0.0,
    unit: 'kg',
    last_updated: new Date().toISOString()
  },
  {
    id: 'p-4',
    category: 'BATTERIES',
    category_name_hi: 'लिथियम-आयन बैटरी',
    category_name_en: 'Lithium-Ion Batteries',
    base_rate_per_kg: 270,
    min_rate_per_kg: 250,
    max_rate_per_kg: 290,
    cpcb_floor_price: 250,
    trend: 'UP',
    trend_percentage: 8.0,
    unit: 'kg',
    last_updated: new Date().toISOString()
  },
  {
    id: 'p-5',
    category: 'MOTORS_MAGNETS',
    category_name_hi: 'मोटर, कंप्रेसर व ट्रांसफार्मर',
    category_name_en: 'Motors & Transformers',
    base_rate_per_kg: 260,
    min_rate_per_kg: 240,
    max_rate_per_kg: 280,
    cpcb_floor_price: 240,
    trend: 'STABLE',
    trend_percentage: 1.2,
    unit: 'kg',
    last_updated: new Date().toISOString()
  },
  {
    id: 'p-6',
    category: 'MIXED_PLASTICS',
    category_name_hi: 'घरेलू ई-उपकरण व प्लास्टिक',
    category_name_en: 'Appliances & Mixed Polymers',
    base_rate_per_kg: 110,
    min_rate_per_kg: 100,
    max_rate_per_kg: 130,
    cpcb_floor_price: 100,
    trend: 'STABLE',
    trend_percentage: 0.0,
    unit: 'kg',
    last_updated: new Date().toISOString()
  },
  {
    id: 'p-7',
    category: 'CRT_TV',
    category_name_hi: 'CRT टीवी व भारी मॉनिटर',
    category_name_en: 'CRT Monitors & Glass TV',
    base_rate_per_kg: 45,
    min_rate_per_kg: 40,
    max_rate_per_kg: 55,
    cpcb_floor_price: 40,
    trend: 'DOWN',
    trend_percentage: -2.1,
    unit: 'kg',
    last_updated: new Date().toISOString()
  }
];

export const PriceBoard: React.FC<PriceBoardProps> = ({ onNavigate }) => {
  const { currentLanguage, t } = useLanguage();
  const [prices, setPrices] = useState<PriceRecord[]>(DEFAULT_PRICES);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await syncEngine.refreshPrices();
        if (data && data.length > 0) {
          setPrices(data);
        }
      } catch (err) {
        console.warn('Failed to load prices, using defaults:', err);
      }
    };

    fetchPrices();
  }, []);

  const audioSummary = `सरकारी न्यूनतम मूल्य (MSP) दरें: तांबा तार ₹580 प्रति किलो, सर्किट बोर्ड PCB ₹410 प्रति किलो, स्मार्टफोन ₹320 प्रति किलो, लिथियम बैटरी ₹270 प्रति किलो, मोटर ₹260 प्रति किलो, घरेलू उपकरण ₹110 प्रति किलो।`;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">
              currency_rupee
            </span>
            <span>{t.priceBoard}</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            CPCB अधिकृत न्यूनतम आधार मूल्य (MSP Floor Rate)
          </p>
        </div>
        <AudioReadoutButton textToSpeak={audioSummary} lang={currentLanguage.bcp47} size="sm" />
      </div>

      {/* Info Highlight Banner */}
      <div className="p-3 bg-secondary-container/30 border-2 border-secondary/40 rounded-2xl flex items-center gap-3">
        <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
        <div className="text-xs text-on-secondary-container leading-snug">
          <strong className="font-black">सख्त CPCB गारंटी:</strong> कोई भी रीसाइक्लर न्यूनतम सरकारी दर (MSP) से कम भुगतान नहीं कर सकता।
        </div>
      </div>

      {/* Prices List */}
      <div className="space-y-3">
        {prices.map((p) => (
          <ScrapPriceCard
            key={p.category}
            category={p.category}
            nameHi={p.category_name_hi}
            nameEn={p.category_name_en}
            ratePerKg={p.base_rate_per_kg}
            minRate={p.min_rate_per_kg}
            maxRate={p.max_rate_per_kg}
            trend={p.trend}
          />
        ))}
      </div>

      {/* Call to Action */}
      <div className="pt-2">
        <TouchButton
          variant="affirmative"
          size="lg"
          fullWidth
          icon="add_a_photo"
          onClick={() => onNavigate('add-scrap')}
        >
          इस दर पर ई-कचरा बेचें
        </TouchButton>
      </div>
    </div>
  );
};
