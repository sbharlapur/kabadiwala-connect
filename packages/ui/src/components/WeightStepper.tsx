import React from 'react';
import { Card } from './Card';
import { AudioReadoutButton } from './AudioReadoutButton';

export interface WeightStepperProps {
  weightKg: number;
  onChange: (newWeight: number) => void;
  maxWeight?: number;
  minWeight?: number;
  step?: number;
  scaleConnected?: boolean;
  className?: string;
}

export const WeightStepper: React.FC<WeightStepperProps> = ({
  weightKg,
  onChange,
  maxWeight = 500,
  minWeight = 0.5,
  step = 0.5,
  scaleConnected = true,
  className = ''
}) => {
  const handleAdd = (delta: number) => {
    const next = Math.max(minWeight, Math.min(maxWeight, Math.round((weightKg + delta) * 10) / 10));
    onChange(next);
  };

  const handleReset = () => {
    onChange(minWeight);
  };

  const speechText = `वजन ${weightKg} किलोग्राम।`;

  return (
    <Card level={2} accent="primary" className={`flex flex-col items-center gap-space-sm ${className}`}>
      {/* Top Scale Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary">
          <span className="material-symbols-outlined text-[20px]">scale</span>
          <span className="font-label-md text-label-md">डिजिटल कांटा (Scale)</span>
        </div>
        <div className="flex items-center gap-1.5 font-label-md text-[13px] text-primary">
          <span className={`w-2.5 h-2.5 rounded-full ${scaleConnected ? 'bg-primary-container animate-pulse' : 'bg-outline'}`}></span>
          <span>{scaleConnected ? 'लाइव जुड़ा हुआ' : 'मैनुअल मोड'}</span>
        </div>
      </div>

      {/* Main Giant Readout */}
      <div className="flex items-center justify-center gap-space-sm my-2 w-full">
        <div className="flex items-baseline gap-2 text-primary-container">
          <span className="font-currency-xl text-[54px] leading-none font-black tracking-tight">
            {weightKg.toFixed(1)}
          </span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface-variant">
            किलो (kg)
          </span>
        </div>
        <AudioReadoutButton textToSpeak={speechText} variant="secondary" size="md" />
      </div>

      {/* Range Slider for rapid sweep */}
      <div className="w-full px-2">
        <input
          type="range"
          min={minWeight}
          max={60}
          step={step}
          value={weightKg}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-3 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary-container"
        />
        <div className="flex justify-between items-center text-on-surface-variant font-label-md text-[13px] pt-1 px-1">
          <span>0kg</span>
          <span>10kg</span>
          <span>25kg</span>
          <span>50kg+</span>
        </div>
      </div>

      {/* Quick Stepper Pills */}
      <div className="grid grid-cols-4 gap-2 w-full mt-2">
        <button
          type="button"
          onClick={() => handleAdd(1)}
          className="min-h-[48px] rounded-xl bg-surface-container-high text-on-surface font-label-lg active:bg-primary-fixed active:text-on-primary-fixed transition-colors flex items-center justify-center border-2 border-outline-variant shadow-sm"
        >
          +1 kg
        </button>
        <button
          type="button"
          onClick={() => handleAdd(5)}
          className="min-h-[48px] rounded-xl bg-surface-container-high text-on-surface font-label-lg active:bg-primary-fixed active:text-on-primary-fixed transition-colors flex items-center justify-center border-2 border-outline-variant shadow-sm"
        >
          +5 kg
        </button>
        <button
          type="button"
          onClick={() => handleAdd(10)}
          className="min-h-[48px] rounded-xl bg-surface-container-high text-on-surface font-label-lg active:bg-primary-fixed active:text-on-primary-fixed transition-colors flex items-center justify-center border-2 border-outline-variant shadow-sm"
        >
          +10 kg
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="min-h-[48px] rounded-xl bg-error-container text-on-error-container font-label-md active:opacity-80 transition-opacity flex items-center justify-center border-2 border-error shadow-sm"
        >
          रीसेट
        </button>
      </div>
    </Card>
  );
};
