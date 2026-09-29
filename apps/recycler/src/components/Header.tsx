import React from 'react';
import { useRecyclerAuth } from '../context/RecyclerAuthContext';
import { StatusChip } from '@kabadiwala/ui';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { facility, user, logout } = useRecyclerAuth();

  return (
    <header className="sticky top-0 z-30 bg-surface border-b-2 border-outline-variant/40 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary font-black text-xl flex items-center justify-center shadow-sm">
              क
            </div>
            <div>
              <h1 className="text-base font-black text-on-surface leading-tight">
                {facility?.facility_name || 'Authorized Recycler Hub'}
              </h1>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="font-mono font-bold text-primary">
                  {facility?.cpcb_reg_number || 'CPCB/EW/2024/DEL-0891'}
                </span>
                <span>• {facility?.city || 'Delhi'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <StatusChip status="verified" label="CPCB Authorized" />
            <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2 py-1 rounded-md border border-outline-variant">
              Stock: {facility?.current_stock_kg || 1840} / {facility?.capacity_kg_per_day || 5000} kg
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-on-surface">{user?.name}</div>
              <div className="text-[10px] text-success font-black">Online</div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant transition-colors border border-outline-variant"
              title="लॉगआउट / Logout"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
