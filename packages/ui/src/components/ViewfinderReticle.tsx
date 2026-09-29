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

export const ViewfinderReticle: React.FC<ViewfinderReticleProps> = ({
  detectedCategoryHi = 'सर्किट बोर्ड (PCB)',
  detectedCategoryEn = 'Circuit Board',
  confidencePercent = 96,
  isScanning = false,
  onRetake,
  onTorchToggle,
  isTorchOn = false,
  className = '',
  children
}) => {
  return (
    <div
      className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-inverse-surface shadow-xl border-2 border-outline-variant ${className}`}
    >
      {/* Background / Feed / Children */}
      {children}

      {/* Reticle Corner Brackets */}
      <div className="absolute inset-4 pointer-events-none flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-tl-xl border-t-4 border-l-4 border-primary-fixed shadow-sm"></div>
          <div className="w-8 h-8 rounded-tr-xl border-t-4 border-r-4 border-primary-fixed shadow-sm"></div>
        </div>

        {/* Center Scanner animation */}
        {isScanning && (
          <div className="self-center flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-primary-fixed/20 animate-ping"></div>
              <div className="w-16 h-16 rounded-xl bg-primary/60 backdrop-blur-md flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-primary-fixed text-[36px]">
                  qr_code_scanner
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-end">
          <div className="w-8 h-8 rounded-bl-xl border-b-4 border-l-4 border-primary-fixed shadow-sm"></div>
          <div className="w-8 h-8 rounded-br-xl border-b-4 border-r-4 border-primary-fixed shadow-sm"></div>
        </div>
      </div>

      {/* Bottom Floating AI Confidence Pill */}
      {detectedCategoryHi && (
        <div className="absolute bottom-3 inset-x-3 z-20 bg-surface/95 backdrop-blur-md rounded-xl p-space-xs shadow-xl flex items-center justify-between gap-space-xs border border-outline-variant">
          <div className="flex items-center gap-space-xs min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md text-primary font-bold truncate">
                  {detectedCategoryHi}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-[11px] font-extrabold">
                  {confidencePercent}% AI
                </span>
              </div>
              <span className="font-body-lg text-[13px] leading-tight text-on-surface-variant truncate">
                पहचान सफल • {detectedCategoryEn}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
