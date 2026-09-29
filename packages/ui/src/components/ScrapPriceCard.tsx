import React from 'react';
import { AudioReadoutButton } from './AudioReadoutButton';
import { Card } from './Card';

export interface ScrapPriceCardProps {
  category: string;
  nameHi: string;
  nameEn: string;
  ratePerKg: number;
  minRate?: number;
  maxRate?: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  iconName?: string;
  onSelect?: () => void;
  className?: string;
}

export const ScrapPriceCard: React.FC<ScrapPriceCardProps> = ({
  category,
  nameHi,
  nameEn,
  ratePerKg,
  minRate,
  maxRate,
  trend = 'STABLE',
  iconName = 'memory',
  onSelect,
  className = ''
}) => {
  const speechText = `${nameHi}। ${nameEn}। सरकारी रेट ₹${ratePerKg} प्रति किलो।`;

  const trendIcons = {
    UP: { icon: 'trending_up', color: 'text-primary' },
    DOWN: { icon: 'trending_down', color: 'text-tertiary' },
    STABLE: { icon: 'trending_flat', color: 'text-on-surface-variant' }
  };

  return (
    <Card
      level={2}
      accent="secondary"
      interactive={!!onSelect}
      onClick={onSelect}
      className={`flex items-center justify-between gap-space-sm ${className}`}
    >
      <div className="flex items-center gap-space-sm min-w-0">
        {/* Pictogram Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0 border-2 border-outline-variant">
          <span className="material-symbols-outlined text-[32px]">{iconName}</span>
        </div>

        {/* Center: Dual Language Name & Price */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md text-on-surface leading-tight truncate">
              {nameHi}
            </span>
            <span className={`material-symbols-outlined text-[20px] ${trendIcons[trend].color}`}>
              {trendIcons[trend].icon}
            </span>
          </div>
          <span className="font-body-lg text-[14px] text-on-surface-variant leading-tight truncate">
            {nameEn}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-currency-xl text-currency-lg text-secondary font-black">
              ₹ {ratePerKg}
            </span>
            <span className="font-label-md text-[13px] text-on-surface-variant font-bold">
              / किलो (kg)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Audio Readout Target */}
      <AudioReadoutButton
        textToSpeak={speechText}
        variant="secondary"
        size="md"
        className="flex-shrink-0"
      />
    </Card>
  );
};
