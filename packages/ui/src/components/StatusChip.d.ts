import React from 'react';
export interface StatusChipProps {
    status: 'verified' | 'pending' | 'online' | 'offline' | 'hazard' | 'syncing';
    label?: string;
    className?: string;
}
export declare const StatusChip: React.FC<StatusChipProps>;
