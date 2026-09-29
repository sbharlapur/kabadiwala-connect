import React from 'react';
import { useSyncStatus } from '../services/syncService';
import { useLanguage } from '../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingCount, syncNow } = useSyncStatus();
  const { t, speak } = useLanguage();

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <div
      className={`w-full px-4 py-2 text-sm font-bold flex items-center justify-between shadow-md transition-colors ${
        !isOnline ? 'bg-error text-onError' : 'bg-secondary text-onSecondary'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-lg animate-pulse">
          {!isOnline ? 'cloud_off' : 'sync'}
        </span>
        <span>
          {!isOnline
            ? t.offlineNotice
            : `${pendingCount} ${t.syncPending}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isOnline && pendingCount > 0 && (
          <button
            onClick={() => syncNow()}
            className="px-2 py-1 bg-surface text-onSurface text-xs font-black rounded border border-onSurface/20 active:scale-95"
          >
            Sync
          </button>
        )}
        <button
          onClick={() => speak(!isOnline ? t.offlineNotice : `${pendingCount} ${t.syncPending}`)}
          className="p-1 hover:bg-black/10 rounded-full"
          title={t.audioAssist}
        >
          <span className="material-symbols-outlined text-sm">volume_up</span>
        </button>
      </div>
    </div>
  );
};
