import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { BottomNav, type TabKey } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { LanguageSelection } from './pages/LanguageSelection';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { AddScrapFlow } from './pages/AddScrapFlow';
import { PriceBoard } from './pages/PriceBoard';
import { Ledger } from './pages/Ledger';
import { SafetyGuide } from './pages/SafetyGuide';
import type { ScrapLot } from '@kabadiwala/shared';

const CollectorAppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();

  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [activeLotForQr, setActiveLotForQr] = useState<ScrapLot | null>(null);
  const [addScrapStep, setAddScrapStep] = useState<number>(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-primary text-onPrimary font-black text-3xl flex items-center justify-center animate-spin">
          क
        </div>
        <p className="mt-4 font-bold text-sm text-onSurface">कबाड़ीवाला Connect लोड हो रहा है...</p>
      </div>
    );
  }

  // 1. Language selector view (modal or standalone)
  if (showLanguageModal) {
    return <LanguageSelection onConfirm={() => setShowLanguageModal(false)} />;
  }

  // 2. Authentication view
  if (!isAuthenticated) {
    return (
      <Login
        onSuccess={() => setCurrentTab('home')}
        onOpenLanguage={() => setShowLanguageModal(true)}
      />
    );
  }

  const handleNavigate = (tab: TabKey, params?: any) => {
    if (params?.step) {
      setAddScrapStep(params.step);
    } else {
      setAddScrapStep(1);
    }
    if (params?.lot) {
      setActiveLotForQr(params.lot);
    }
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-surface text-onSurface flex flex-col justify-between select-none">
      <div>
        <Header onOpenLanguageModal={() => setShowLanguageModal(true)} />
        <OfflineBanner />

        <main>
          {currentTab === 'home' && (
            <Home
              onNavigate={handleNavigate}
              onOpenLotDetails={(lot) => handleNavigate('add-scrap', { step: 4, lot })}
            />
          )}

          {currentTab === 'add-scrap' && (
            <AddScrapFlow
              initialStep={addScrapStep}
              initialLot={activeLotForQr}
              onFinished={() => {
                setActiveLotForQr(null);
                setAddScrapStep(1);
              }}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'prices' && <PriceBoard onNavigate={handleNavigate} />}

          {currentTab === 'ledger' && (
            <Ledger onNavigateHome={() => handleNavigate('home')} />
          )}

          {currentTab === 'safety' && (
            <SafetyGuide onNavigateHome={() => handleNavigate('home')} />
          )}
        </main>
      </div>

      <BottomNav currentTab={currentTab} onSelectTab={handleNavigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CollectorAppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
