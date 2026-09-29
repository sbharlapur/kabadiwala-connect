import React from 'react';

export type RecyclerTabKey = 'scanner' | 'queue' | 'compliance' | 'inventory' | 'history';

interface SidebarProps {
  currentTab: RecyclerTabKey;
  onSelectTab: (tab: RecyclerTabKey) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen = false,
  onClose
}) => {
  const menuItems: { key: RecyclerTabKey; label: string; subLabel: string; icon: string; badge?: string }[] = [
    {
      key: 'scanner',
      label: 'Live QR Intake',
      subLabel: 'कैमरा स्कैनर व सत्यापन',
      icon: 'qr_code_scanner',
      badge: 'LIVE'
    },
    {
      key: 'queue',
      label: 'Incoming Lots',
      subLabel: 'कलेक्टर लॉट कतार',
      icon: 'move_to_inbox',
      badge: '3'
    },
    {
      key: 'compliance',
      label: 'CPCB Form-6 Manifests',
      subLabel: 'EPR क्रेडिट व ऑडिट रिपोर्ट',
      icon: 'verified_user'
    },
    {
      key: 'inventory',
      label: 'Storage & Hazards',
      subLabel: 'श्रेणीवार स्टॉक व बैटरी क्षेत्र',
      icon: 'warehouse'
    },
    {
      key: 'history',
      label: 'Payout Ledger',
      subLabel: 'भुगतान व डिजिटल रसीदें',
      icon: 'receipt_long'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-surface-container-lowest border-r-2 border-outline-variant/40 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-black text-lg shadow-sm">
                क
              </div>
              <div className="font-black text-base text-on-surface">
                Recycler Portal
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onSelectTab(item.key);
                    if (onClose) onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-md font-black'
                      : 'bg-transparent text-on-surface hover:bg-surface-container font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-2xl ${
                        isActive ? 'text-primary-container' : 'text-primary'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-sm leading-tight">{item.label}</div>
                      <div
                        className={`text-[11px] font-medium leading-tight mt-0.5 ${
                          isActive ? 'text-white/80' : 'text-on-surface-variant'
                        }`}
                      >
                        {item.subLabel}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-primary'
                          : 'bg-primary-container text-on-primary font-mono'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Compliance Badge */}
        <div className="p-4 m-3 bg-surface-container rounded-2xl border border-outline-variant/60">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-success text-lg">
              verified
            </span>
            <span className="text-xs font-black text-on-surface">CPCB Gateway Link</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-tight">
            E-Waste (Management) Rules 2022 EPR Compliance Node Active.
          </p>
        </div>
      </aside>
    </>
  );
};
