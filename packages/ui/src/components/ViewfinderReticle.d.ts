import React from 'react';
export interface ViewfinderReticleProps {
    detectedCategoryHi?: string;
    detectedCategoryEn?: string;
    confidencePercent?: number;
    isScanning?: boolean;
    onRetake?: () => void;
    onTorchToggle?: () => void;
    isTorchOn?: boolean;
    className?: string;
    children?: React.ReactNode;
}
export declare const ViewfinderReticle: React.FC<ViewfinderReticleProps>;
