import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export type TabKey = 'home' | 'add-scrap' | 'prices' | 'ledger' | 'safety';

interface BottomNavProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();

  const tabs: { key: TabKey; label: string; icon: string; highlight?: boolean }[] = [
    { key: 'home', label: 'होम', icon: 'home' },
    { key: 'add-scrap', label: t.addScrap, icon: 'add_a_photo', highlight: true },
    { key: 'prices', label: 'दाम', icon: 'currency_rupee' },
    { key: 'ledger', label: 'खाता', icon: 'account_balance_wallet' },
    { key: 'safety', label: 'सुरक्षा', icon: 'health_and_safety' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t-2 border-outline/20 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          if (tab.highlight) {
            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className="flex flex-col items-center justify-center -mt-5 focus:outline-none group"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-surface transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-primary text-onPrimary ring-4 ring-primaryContainer'
                      : 'bg-secondary text-onSecondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">{tab.icon}</span>
                </div>
                <span
                  className={`text-[10px] font-black mt-1 ${
                    isActive ? 'text-primary' : 'text-onSurfaceVariant'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex flex-col items-center justify-center h-full min-h-[56px] focus:outline-none transition-colors active:bg-surfaceContainer ${
                isActive ? 'text-primary' : 'text-onSurfaceVariant hover:text-onSurface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-2xl ${
                  isActive ? 'font-bold scale-110' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className={`text-[11px] font-bold ${isActive ? 'font-black' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
