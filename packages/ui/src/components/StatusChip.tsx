import React from 'react';

export interface StatusChipProps {
  status: 'verified' | 'pending' | 'online' | 'offline' | 'hazard' | 'syncing';
  label?: string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label, className = '' }) => {
  const configs = {
    verified: {
      bg: 'bg-primary text-on-primary border-primary',
      icon: 'verified',
      defaultLabel: 'CPCB अधिकृत / Verified'
    },
    pending: {
      bg: 'bg-secondary-fixed text-on-secondary-fixed-variant border-secondary',
      icon: 'sync',
      defaultLabel: 'सिंक हो रहा है / Syncing'
    },
    online: {
      bg: 'bg-primary-fixed text-on-primary-fixed border-primary-container',
      icon: 'wifi',
      defaultLabel: 'ऑनलाइन / Online'
    },
    offline: {
      bg: 'bg-surface-container-high text-on-surface-variant border-outline',
      icon: 'cloud_off',
      defaultLabel: 'ऑफ़लाइन मोड / Offline'
    },
    hazard: {
      bg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary',
      icon: 'warning',
      defaultLabel: 'जोखिम चेतावनी / Hazard'
    },
    syncing: {
      bg: 'bg-secondary-fixed text-on-secondary-fixed-variant border-secondary',
      icon: 'sync',
      defaultLabel: 'कतारबद्ध / Queued'
    }
  };

  const config = configs[status] || configs.online;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 font-label-md text-[13px] leading-tight select-none shadow-sm ${config.bg} ${className}`}
    >
      <span className={`material-symbols-outlined text-[16px] ${status === 'syncing' ? 'animate-spin' : ''}`}>
        {config.icon}
      </span>
      <span className="font-bold truncate">{label || config.defaultLabel}</span>
    </div>
  );
};
