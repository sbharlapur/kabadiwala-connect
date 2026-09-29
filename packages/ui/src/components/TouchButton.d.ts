import React from 'react';
export interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'affirmative' | 'payout' | 'hazard' | 'secondary' | 'outline';
    size?: 'md' | 'lg' | 'xl';
    icon?: string;
    fullWidth?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}
export declare const TouchButton: React.FC<TouchButtonProps>;
