import React, { useState } from 'react';
import { useRecyclerAuth } from '../context/RecyclerAuthContext';
import { TouchButton } from '@kabadiwala/ui';

interface RecyclerLoginProps {
  onSuccess: () => void;
}

export const RecyclerLogin: React.FC<RecyclerLoginProps> = ({ onSuccess }) => {
  const { login, quickDemoLogin, isLoading } = useRecyclerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter facility email and password');
      return;
    }
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleDemo = async (index: number) => {
    setError(null);
    try {
      await quickDemoLogin(index);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border-2 border-outline-variant rounded-3xl p-6 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary text-3xl font-black flex items-center justify-center mx-auto shadow-md">
            क
          </div>
          <h1 className="text-2xl font-black text-on-surface">
            Recycler & Dismantler Portal
          </h1>
          <p className="text-xs text-on-surface-variant font-medium">
            CPCB / SPCB Authorized Intake & EPR Compliance System
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error/10 border-2 border-error text-error text-xs font-bold rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-on-surface uppercase tracking-wider mb-1">
              Facility Registered Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="delhi@ecorecycle.in"
              className="w-full px-4 py-3 bg-surface-container-low border-2 border-outline-variant rounded-xl font-bold text-on-surface focus:outline-none focus:border-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-on-surface uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-surface-container-low border-2 border-outline-variant rounded-xl font-bold text-on-surface focus:outline-none focus:border-primary text-sm"
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
            Access Facility Terminal
          </TouchButton>
        </form>

        {/* 1-Click Demo Evaluation Pills */}
        <div className="pt-4 border-t-2 border-outline-variant/60">
          <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-wider text-center mb-3">
            Quick 1-Click Evaluation Profiles (SIH 2026)
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleDemo(0)}
              disabled={isLoading}
              className="w-full p-3 bg-surface-container border-2 border-outline-variant rounded-xl flex items-center justify-between text-left hover:border-primary active:scale-[0.98] transition-all"
            >
              <div>
                <div className="text-xs font-black text-on-surface">
                  EcoRecycle Solutions Hub (Mayapuri)
                </div>
                <div className="text-[11px] text-on-surface-variant font-mono">
                  CPCB/EW/2024/DEL-0891 • Capacity: 5,000 kg/day
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-lg">arrow_forward</span>
            </button>

            <button
              onClick={() => handleDemo(1)}
              disabled={isLoading}
              className="w-full p-3 bg-surface-container border-2 border-outline-variant rounded-xl flex items-center justify-between text-left hover:border-primary active:scale-[0.98] transition-all"
            >
              <div>
                <div className="text-xs font-black text-on-surface">
                  GreenEarth Metal & Refiners (Kirti Nagar)
                </div>
                <div className="text-[11px] text-on-surface-variant font-mono">
                  CPCB/EW/2023/DEL-0142 • Capacity: 3,500 kg/day
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
