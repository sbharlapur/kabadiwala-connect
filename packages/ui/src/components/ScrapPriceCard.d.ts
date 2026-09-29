import React from 'react';
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
export declare const ScrapPriceCard: React.FC<ScrapPriceCardProps>;
