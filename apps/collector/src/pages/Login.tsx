import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { TouchButton, AudioReadoutButton } from '@kabadiwala/ui';

interface LoginProps {
  onSuccess: () => void;
  onOpenLanguage: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onOpenLanguage }) => {
  const { login, quickDemoLogin, isLoading } = useAuth();
  const { currentLanguage, t } = useLanguage();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || phone.length < 10) {
      setError('कृपया वैध 10-अंकीय मोबाइल नंबर दर्ज करें (Enter valid 10-digit phone)');
      return;
    }
    if (!pin || pin.length < 4) {
      setError('कृपया 4-अंकीय पिन दर्ज करें (Enter 4-digit PIN)');
      return;
    }

    try {
      await login(phone, pin);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'लॉगिन विफल रहा (Login Failed)');
    }
  };

  const handleDemoSelect = async (index: number) => {
    setError(null);
    try {
      await quickDemoLogin(index);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'डेमो लॉगिन विफल रहा');
    }
  };

  const speakText = `${t.loginTitle}। अपना मोबाइल नंबर और 4 अंकों का पिन दर्ज करें। या नीचे दिए गए डेमो बटन पर क्लिक करें।`;

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-4 max-w-md mx-auto">
      {/* Top Bar with Language Selector */}
      <div className="flex justify-between items-center py-2">
        <button
          onClick={onOpenLanguage}
          className="px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-black text-on-surface flex items-center gap-1.5 shadow-sm active:translate-y-[1px]"
        >
          <span className="material-symbols-outlined text-sm">translate</span>
          <span>{currentLanguage.nativeName}</span>
        </button>
        <AudioReadoutButton textToSpeak={speakText} lang={currentLanguage.bcp47} size="sm" />
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary text-3xl font-black flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-surface">
            क
          </div>
          <h1 className="text-2xl font-black text-on-surface">{t.loginTitle}</h1>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">{t.tagline}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border-2 border-error text-error text-xs font-bold rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-on-surface uppercase tracking-wider mb-1">
              {t.enterPhone}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-on-surface-variant font-bold text-base">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="w-full pl-14 pr-4 py-3 bg-surface-container-lowest border-2 border-outline-variant rounded-xl font-bold text-on-surface text-lg tracking-wider focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-on-surface uppercase tracking-wider mb-1">
              {t.enterPin}
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full px-4 py-3 bg-surface-container-lowest border-2 border-outline-variant rounded-xl font-black text-on-surface text-2xl tracking-[0.5em] text-center focus:outline-none focus:border-primary"
            />
          </div>

          <TouchButton
            type="submit"
            variant="affirmative"
            size="xl"
            fullWidth
            isLoading={isLoading}
            icon="login"
          >
            {t.loginButton}
          </TouchButton>
        </form>

        {/* Demo Fast Autofill Section */}
        <div className="mt-8 pt-6 border-t-2 border-outline-variant">
          <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-wider text-center mb-3">
            {t.demoAutofill} (SIH 2026 Evaluation)
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleDemoSelect(0)}
              disabled={isLoading}
              className="w-full p-2.5 bg-surface-container border-2 border-outline-variant rounded-xl flex items-center justify-between text-left hover:border-primary active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                  DEL
                </span>
                <div>
                  <div className="text-xs font-black text-on-surface">रमेश कुमार (Ramesh Kumar)</div>
                  <div className="text-[10px] text-on-surface-variant">Mayapuri Hub, Delhi • E-Rickshaw</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
            </button>

            <button
              onClick={() => handleDemoSelect(1)}
              disabled={isLoading}
              className="w-full p-2.5 bg-surface-container border-2 border-outline-variant rounded-xl flex items-center justify-between text-left hover:border-primary active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary font-bold flex items-center justify-center text-xs">
                  BLR
                </span>
                <div>
                  <div className="text-xs font-black text-on-surface">सुनीता देवी (Sunita Devi)</div>
                  <div className="text-[10px] text-on-surface-variant">Peenya Industrial, Bengaluru • Cart</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
            </button>

            <button
              onClick={() => handleDemoSelect(2)}
              disabled={isLoading}
              className="w-full p-2.5 bg-surface-container border-2 border-outline-variant rounded-xl flex items-center justify-between text-left hover:border-primary active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-xs">
                  BOM
                </span>
                <div>
                  <div className="text-xs font-black text-on-surface">अब्दुल कलाम (Abdul Kalam)</div>
                  <div className="text-[10px] text-on-surface-variant">Dharavi Hub, Mumbai • 3-Wheeler</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center py-2 text-[10px] text-on-surface-variant font-bold">
        CPCB Compliance • SIH 2026 Problem Statement 26229
      </div>
    </div>
  );
};
