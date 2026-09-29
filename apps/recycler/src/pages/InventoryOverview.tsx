import React from 'react';
import { Card, StatusChip, TouchButton } from '@kabadiwala/ui';

interface InventoryItem {
  category: string;
  currentKg: number;
  maxCapKg: number;
  color: string;
  isHazardous?: boolean;
}

const INVENTORY_DATA: InventoryItem[] = [
  { category: 'Printed Circuit Boards (PCB)', currentKg: 620, maxCapKg: 1500, color: 'bg-primary', isHazardous: false },
  { category: 'Li-Ion & LFP Batteries (Quarantined)', currentKg: 340, maxCapKg: 500, color: 'bg-error', isHazardous: true },
  { category: 'Copper Cables & Harnesses', currentKg: 480, maxCapKg: 1200, color: 'bg-secondary', isHazardous: false },
  { category: 'LCD / LED Display Panels', currentKg: 210, maxCapKg: 800, color: 'bg-tertiary', isHazardous: false },
  { category: 'CRT Lead Glass / Funnel Tubes', currentKg: 110, maxCapKg: 400, color: 'bg-outline', isHazardous: true },
  { category: 'Flame-Retardant Plastics (ABS/HIPS)', currentKg: 80, maxCapKg: 600, color: 'bg-primary-container', isHazardous: false }
];

export const InventoryOverview: React.FC = () => {
  const totalStockKg = INVENTORY_DATA.reduce((acc, curr) => acc + curr.currentKg, 0);
  const totalCapKg = 5000;
  const utilizationPct = Math.round((totalStockKg / totalCapKg) * 100);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">
              warehouse
            </span>
            <span>Facility Storage & Hazardous Zones</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Real-time material stockpiles vs CPCB fire safety thresholds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusChip status="online" label="Fire Safety Sensors: ONLINE" />
        </div>
      </div>

      {/* Main Stock Capacity Card */}
      <Card level={2} accent="primary" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-black uppercase text-on-surface-variant">
              Total Facility Capacity Utilization
            </div>
            <div className="text-3xl font-black text-on-surface font-mono mt-1">
              {totalStockKg} <span className="text-lg text-on-surface-variant">/ {totalCapKg} kg</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-primary font-mono">{utilizationPct}%</div>
            <div className="text-xs text-on-surface-variant font-bold">Within Safe Operating Limit</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden flex">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${utilizationPct}%` }}
          />
        </div>
      </Card>

      {/* Battery Hazard Quarantine Station Card */}
      <div className="p-5 bg-error-container/20 border-2 border-error rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error text-3xl">
              battery_alert
            </span>
            <div>
              <h3 className="font-black text-base text-on-surface">
                Lithium Battery Hazard Quarantine Bay (Bay 4-B)
              </h3>
              <p className="text-xs text-on-surface-variant font-medium">
                Complies with Section 11 of E-Waste Rules (Fire & Thermal Runaway Containment)
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-error text-on-error rounded-full text-xs font-black">
            HIGH PRIORITY ZONE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <div className="text-[10px] font-black uppercase text-on-surface-variant">
              Zone Temperature
            </div>
            <div className="text-lg font-black text-on-surface font-mono">24.2 °C</div>
            <div className="text-[10px] text-success font-bold">Normal (Threshold: 45°C)</div>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <div className="text-[10px] font-black uppercase text-on-surface-variant">
              Suppression Agent
            </div>
            <div className="text-lg font-black text-on-surface">Lith-Ex PyroBubbles</div>
            <div className="text-[10px] text-success font-bold">Charged & Armed</div>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <div className="text-[10px] font-black uppercase text-on-surface-variant">
              Downstream Refiner Dispatch
            </div>
            <div className="text-lg font-black text-primary font-mono">Scheduled Oct 2</div>
            <div className="text-[10px] text-on-surface-variant font-bold">To Attero Recycling</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-on-surface uppercase tracking-wider">
          Material Category Storage Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INVENTORY_DATA.map((item) => {
            const pct = Math.round((item.currentKg / item.maxCapKg) * 100);
            return (
              <Card key={item.category} level={2} accent={item.isHazardous ? 'hazard' : 'neutral'} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-on-surface">{item.category}</span>
                  <span className="font-mono text-xs font-bold text-on-surface-variant">
                    {item.currentKg} / {item.maxCapKg} kg
                  </span>
                </div>

                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-on-surface-variant">
                  <span>{pct}% capacity used</span>
                  <span>{item.isHazardous ? '⚠️ Hazardous Protocols' : 'Standard Staging'}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
