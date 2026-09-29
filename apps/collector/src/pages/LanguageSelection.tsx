import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, type LanguageInfo } from '../locales/languages';
import { useLanguage } from '../context/LanguageContext';
import { TouchButton } from '@kabadiwala/ui';

interface LanguageSelectionProps {
  onConfirm: () => void;
}

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onConfirm }) => {
  const { currentLanguage, setLanguage, speak, t } = useLanguage();
  const [search, setSearch] = useState('');

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      lang.region.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (lang: LanguageInfo) => {
    setLanguage(lang.code);
    speak(`${lang.nativeName} चुनी गई है। ${t.appName} में आपका स्वागत है।`);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col p-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-primary text-onPrimary text-3xl font-black flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-surface">
          क
        </div>
        <h1 className="text-2xl font-black text-onSurface">
          {t.selectLanguage}
        </h1>
        <p className="text-sm text-onSurfaceVariant mt-1">
          26 Indian Languages Supported (22 Scheduled + Regional)
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative my-3">
        <span className="material-symbols-outlined absolute left-3 top-3.5 text-onSurfaceVariant">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="भाषा खोजें / Search Language..."
          className="w-full pl-10 pr-4 py-3 bg-surfaceContainerLow border-2 border-outline/30 rounded-xl font-bold text-onSurface focus:outline-none focus:border-primary text-base"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-3 text-onSurfaceVariant p-1"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Language Grid */}
      <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 max-h-[50vh]">
        {filteredLanguages.map((lang) => {
          const isSelected = currentLanguage.code === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`w-full p-3.5 rounded-xl border-2 flex items-center justify-between text-left transition-all active:scale-[0.98] ${
                isSelected
                  ? 'bg-primaryContainer/30 border-primary text-primary shadow-sm ring-2 ring-primary/20'
                  : 'bg-surfaceContainer border-outline/15 text-onSurface hover:border-outline/40'
              }`}
            >
              <div>
                <div className="text-lg font-black">{lang.nativeName}</div>
                <div className="text-xs text-onSurfaceVariant font-medium">
                  {lang.name} • {lang.region}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSelected && (
                  <span className="material-symbols-outlined text-primary font-black text-2xl">
                    check_circle
                  </span>
                )}
                <span className="material-symbols-outlined text-onSurfaceVariant text-lg">
                  volume_up
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="pt-4 pb-safe">
        <TouchButton
          variant="affirmative"
          size="xl"
          fullWidth
          icon="check"
          onClick={onConfirm}
        >
          {t.confirmLanguage} ({currentLanguage.nativeName})
        </TouchButton>
      </div>
    </div>
  );
};
