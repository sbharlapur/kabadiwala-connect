import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, type LanguageInfo, type TranslationDictionary, getTranslation } from '../locales/languages';

interface LanguageContextType {
  currentLanguage: LanguageInfo;
  t: TranslationDictionary;
  setLanguage: (code: string) => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langCode, setLangCode] = useState<string>(() => {
    return localStorage.getItem('kabadiwala_collector_lang') || 'hi';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
  const t = getTranslation(langCode);

  useEffect(() => {
    localStorage.setItem('kabadiwala_collector_lang', langCode);
    document.documentElement.lang = langCode;
    document.documentElement.dir = currentLanguage.isRtl ? 'rtl' : 'ltr';
  }, [langCode, currentLanguage]);

  const setLanguage = (code: string) => {
    setLangCode(code);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.bcp47;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, t, setLanguage, speak, isSpeaking, stopSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
