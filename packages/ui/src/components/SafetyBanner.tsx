import React from 'react';
import { AudioReadoutButton } from './AudioReadoutButton';

export interface SafetyBannerProps {
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  hazardType?: 'BATTERY' | 'CRT' | 'ACID' | 'GENERAL';
  className?: string;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({
  titleHi,
  titleEn,
  descriptionHi,
  descriptionEn,
  hazardType = 'BATTERY',
  className = ''
}) => {
  const speechText = `चेतावनी: ${titleHi}। ${descriptionHi}।`;

  return (
    <div
      className={`relative w-full bg-error-container/40 border-3 border-tertiary rounded-2xl p-space-md shadow-tactile flex flex-col gap-space-xs ${className}`}
    >
      {/* Top Striped Safety Indicator */}
      <div className="flex items-center justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs min-w-0">
          <div className="w-12 h-12 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">warning</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline-md text-headline-md text-tertiary font-extrabold truncate">
              {titleHi}
            </span>
            <span className="font-label-md text-[13px] text-on-surface-variant font-bold truncate">
              {titleEn}
            </span>
          </div>
        </div>

        <AudioReadoutButton
          textToSpeak={speechText}
          variant="hazard"
          size="md"
          className="flex-shrink-0"
        />
      </div>

      <p className="font-body-bold text-[16px] text-on-surface leading-snug mt-1">
        {descriptionHi}
      </p>
      <p className="font-body-lg text-[13px] text-on-surface-variant leading-tight">
        {descriptionEn}
      </p>
    </div>
  );
};
