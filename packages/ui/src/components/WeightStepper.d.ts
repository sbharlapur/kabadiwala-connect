import React from 'react';
export interface WeightStepperProps {
    weightKg: number;
    onChange: (newWeight: number) => void;
    maxWeight?: number;
    minWeight?: number;
    step?: number;
    scaleConnected?: boolean;
    className?: string;
}
export declare const WeightStepper: React.FC<WeightStepperProps>;
