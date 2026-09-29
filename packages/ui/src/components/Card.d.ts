import React from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    level?: 0 | 1 | 2 | 3;
    accent?: 'primary' | 'secondary' | 'hazard' | 'neutral';
    interactive?: boolean;
    children: React.ReactNode;
}
export declare const Card: React.FC<CardProps>;
