import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AudioReadoutButton } from '@kabadiwala/ui';

interface HeaderProps {
  onOpenLanguageModal?: () => void;
  title?: string;
  speakText?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLanguageModal, title, speakText }) => {
  const { currentLanguage, t } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-primary text-onPrimary shadow-md pt-safe">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary text-onSecondary flex items-center justify-center font-black text-xl border-2 border-surface shadow-sm">
            क
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight leading-tight">
              {title || t.appName}
            </h1>
            {user && (
              <p className="text-xs text-primaryContainer font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse"></span>
                {user.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {speakText && (
            <AudioReadoutButton
              textToSpeak={speakText}
              lang={currentLanguage.bcp47}
              size="sm"
            />
          )}

          <button
            onClick={onOpenLanguageModal}
            className="px-2.5 py-1.5 bg-primaryContainer text-onPrimaryContainer rounded-lg font-bold text-xs flex items-center gap-1 border border-surface/20 active:translate-y-[1px] shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">translate</span>
            <span>{currentLanguage.nativeName}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
