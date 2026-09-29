import React from 'react';
export interface AudioReadoutButtonProps {
    textToSpeak: string;
    label?: string;
    lang?: string;
    variant?: 'primary' | 'secondary' | 'hazard' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}
export declare const AudioReadoutButton: React.FC<AudioReadoutButtonProps>;
