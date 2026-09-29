import React, { useState } from 'react';
import { useRecyclerAuth } from './context/RecyclerAuthContext';
import { Header } from './components/Header';
import { Sidebar, type RecyclerTabKey } from './components/Sidebar';
import { RecyclerLogin } from './pages/RecyclerLogin';
import { IntakeScanner } from './pages/IntakeScanner';
import { ActiveQueue } from './pages/ActiveQueue';
import { ComplianceReports } from './pages/ComplianceReports';
import { InventoryOverview } from './pages/InventoryOverview';
import { PayoutLedger } from './pages/PayoutLedger';
import type { ScrapLot } from '@kabadiwala/shared';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useRecyclerAuth();
  const [currentTab, setCurrentTab] = useState<RecyclerTabKey>('scanner');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLotForIntake, setSelectedLotForIntake] = useState<ScrapLot | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black text-on-surface uppercase tracking-wider">
            Loading Recycler Terminal...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <RecyclerLogin onSuccess={() => setCurrentTab('scanner')} />;
  }

  const handleSelectLotForIntake = (lot: ScrapLot) => {
    setSelectedLotForIntake(lot);
    setCurrentTab('scanner');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex-1 flex">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto pb-12">
          {currentTab === 'scanner' && <IntakeScanner />}
          {currentTab === 'queue' && (
            <ActiveQueue onSelectLotForIntake={handleSelectLotForIntake} />
          )}
          {currentTab === 'compliance' && <ComplianceReports />}
          {currentTab === 'inventory' && <InventoryOverview />}
          {currentTab === 'history' && <PayoutLedger />}
        </main>
      </div>
    </div>
  );
};
