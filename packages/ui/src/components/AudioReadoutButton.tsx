import React, { useState, useEffect } from 'react';

export interface AudioReadoutButtonProps {
  textToSpeak: string;
  label?: string;
  lang?: string;
  variant?: 'primary' | 'secondary' | 'hazard' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioReadoutButton: React.FC<AudioReadoutButtonProps> = ({
  textToSpeak,
  label = 'सुनें',
  lang = 'hi-IN',
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this environment');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const variantStyles = {
    primary: 'bg-primary-container text-on-primary hover:bg-primary border-2 border-primary-container',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary-container border-2 border-secondary',
    hazard: 'bg-tertiary text-on-tertiary hover:bg-tertiary-container border-2 border-tertiary',
    neutral: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border-2 border-outline-variant'
  };

  const sizeStyles = {
    sm: 'min-h-[44px] min-w-[44px] px-3 text-[14px] rounded-xl',
    md: 'min-h-[56px] min-w-[56px] px-4 text-label-md rounded-2xl',
    lg: 'min-h-[64px] min-w-[64px] px-5 text-label-lg rounded-2xl'
  };

  return (
    <button
      type="button"
      aria-label={`Listen: ${textToSpeak}`}
      onClick={handleSpeak}
      className={`relative inline-flex items-center justify-center gap-2 font-bold select-none cursor-pointer transition-all active:translate-y-[2px] active:scale-95 shadow-tactile ${variantStyles[variant]} ${sizeStyles[size]} ${
        isSpeaking ? 'ring-4 ring-primary-fixed animate-pulse' : ''
      } ${className}`}
    >
      <span className="material-symbols-outlined text-[26px]">
        {isSpeaking ? 'volume_up' : 'volume_up'}
      </span>
      {label && <span className="font-label-md leading-none">{isSpeaking ? 'चल रहा है...' : label}</span>}
      {isSpeaking && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-fixed"></span>
        </span>
      )}
    </button>
  );
};
