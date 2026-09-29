import React from 'react';
export interface SafetyBannerProps {
    titleHi: string;
    titleEn: string;
    descriptionHi: string;
    descriptionEn: string;
    hazardType?: 'BATTERY' | 'CRT' | 'ACID' | 'GENERAL';
    className?: string;
}
export declare const SafetyBanner: React.FC<SafetyBannerProps>;
