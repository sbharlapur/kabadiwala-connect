import React, { useState } from 'react';
import { Card, StatusChip, TouchButton } from '@kabadiwala/ui';

interface Form6Manifest {
  manifestNo: string;
  date: string;
  sender: string;
  collectorPhone: string;
  category: string;
  netWeightKg: number;
  hazardousClassification: string;
  vehicleReg: string;
  status: 'SIGNED_DISPATCHED' | 'ACCEPTED_WEIGHBRIDGE' | 'EPR_CREDITED';
}

const MOCK_MANIFESTS: Form6Manifest[] = [
  {
    manifestNo: 'CPCB-F6-2026-DEL-00941',
    date: '2026-09-28 11:30 AM',
    sender: 'Ramesh Kumar (DEL-KAB-0042)',
    collectorPhone: '+91 98765 43210',
    category: 'PCB (Printed Circuit Boards)',
    netWeightKg: 8.5,
    hazardousClassification: 'Schedule-I E-Waste (Lead/Tin/Brominated FR)',
    vehicleReg: 'DL-1ER-4912 (EV 3-Wheeler)',
    status: 'EPR_CREDITED'
  },
  {
    manifestNo: 'CPCB-F6-2026-DEL-00940',
    date: '2026-09-28 10:15 AM',
    sender: 'Sanjay Yadav (DEL-KAB-0019)',
    collectorPhone: '+91 98111 22334',
    category: 'BATTERIES (Li-Ion / LFP Cells)',
    netWeightKg: 14.2,
    hazardousClassification: 'Schedule-I Hazardous (Lithium/Cobalt/Acid)',
    vehicleReg: 'DL-1ER-9011 (EV 3-Wheeler)',
    status: 'ACCEPTED_WEIGHBRIDGE'
  },
  {
    manifestNo: 'CPCB-F6-2026-DEL-00939',
    date: '2026-09-27 04:45 PM',
    sender: 'Mohd. Imran (DEL-KAB-0081)',
    collectorPhone: '+91 98222 33445',
    category: 'CABLES (Insulated Copper Wiring)',
    netWeightKg: 32.0,
    hazardousClassification: 'Schedule-II Non-Hazardous Recyclable',
    vehicleReg: 'Manual Pushcart (Non-Motorized)',
    status: 'EPR_CREDITED'
  }
];

export const ComplianceReports: React.FC = () => {
  const [selectedManifest, setSelectedManifest] = useState<Form6Manifest | null>(MOCK_MANIFESTS[0]);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadJSON = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(MOCK_MANIFESTS, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `CPCB_Form6_Manifests_Batch_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setIsExporting(false);
    }, 400);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-success text-3xl">
              verified_user
            </span>
            <span>CPCB Form-6 Manifests & EPR Credits</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Statutory compliance tracking pursuant to E-Waste (Management) Rules 2022
          </p>
        </div>

        <button
          onClick={handleDownloadJSON}
          disabled={isExporting}
          className="px-4 py-2.5 bg-primary text-on-primary rounded-xl font-black text-xs flex items-center gap-2 shadow hover:bg-primary/90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>{isExporting ? 'Generating...' : 'Export CPCB Batch XML/JSON'}</span>
        </button>
      </div>

      {/* Summary KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface-container-lowest border-2 border-outline-variant rounded-2xl">
          <div className="text-[11px] font-black uppercase text-on-surface-variant">
            Monthly Formalized Intake
          </div>
          <div className="text-2xl font-black text-primary font-mono mt-1">
            2,480.5 kg
          </div>
          <div className="text-[11px] text-success font-bold mt-1">
            +38% from informal collectors
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest border-2 border-outline-variant rounded-2xl">
          <div className="text-[11px] font-black uppercase text-on-surface-variant">
            EPR Credits Generated
          </div>
          <div className="text-2xl font-black text-success font-mono mt-1">
            2,480 Credits
          </div>
          <div className="text-[11px] text-on-surface-variant font-bold mt-1">
            Eligible for Brand Offsets (SIH-2026)
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest border-2 border-outline-variant rounded-2xl">
          <div className="text-[11px] font-black uppercase text-on-surface-variant">
            Hazardous Residue to TSDF
          </div>
          <div className="text-2xl font-black text-secondary font-mono mt-1">
            86.4 kg (3.4%)
          </div>
          <div className="text-[11px] text-on-surface-variant font-bold mt-1">
            Zero Landfill Compliant
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Manifests Table / List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-black text-on-surface uppercase tracking-wider">
            Verified Manifest Ledger (Form-6)
          </h3>

          <div className="space-y-2">
            {MOCK_MANIFESTS.map((m) => {
              const isSelected = selectedManifest?.manifestNo === m.manifestNo;
              return (
                <div
                  key={m.manifestNo}
                  onClick={() => setSelectedManifest(m)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container border-primary shadow-md'
                      : 'bg-surface-container-lowest border-outline-variant hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-black text-primary">
                      {m.manifestNo}
                    </span>
                    <StatusChip
                      status={m.status === 'EPR_CREDITED' ? 'verified' : 'online'}
                      label={m.status === 'EPR_CREDITED' ? 'EPR Credited' : 'Verified'}
                    />
                  </div>

                  <div className="text-xs font-bold text-on-surface">
                    {m.category} • <span className="font-mono">{m.netWeightKg} kg</span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-1">
                    From: {m.sender} • {m.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Form-6 Certificate Preview */}
        {selectedManifest && (
          <Card level={2} accent="primary" className="p-5 space-y-4">
            <div className="border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2 text-primary font-black text-sm">
                <span className="material-symbols-outlined">description</span>
                <span>CPCB Form-6 Manifest Preview</span>
              </div>
              <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                Rule 19(1) of E-Waste (Management) Rules 2022
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-on-surface-variant block">
                  Manifest Number
                </span>
                <span className="font-mono font-black text-on-surface">
                  {selectedManifest.manifestNo}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-on-surface-variant block">
                  Sender (Informal Collector)
                </span>
                <span className="font-bold text-on-surface">
                  {selectedManifest.sender}
                </span>
                <div className="text-[11px] font-mono text-on-surface-variant">
                  {selectedManifest.collectorPhone}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-on-surface-variant block">
                  Receiver (Authorized Recycler)
                </span>
                <span className="font-bold text-on-surface">
                  EcoRecycle Solutions Hub (Mayapuri Phase II)
                </span>
                <div className="text-[11px] font-mono text-primary">
                  CPCB/EW/2024/DEL-0891
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-on-surface-variant block">
                  E-Waste Classification & Weight
                </span>
                <span className="font-bold text-on-surface">
                  {selectedManifest.category}
                </span>
                <div className="font-mono font-black text-primary text-sm mt-0.5">
                  {selectedManifest.netWeightKg} kg (Net Weighbridge Verified)
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-on-surface-variant block">
                  Hazardous Classification
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  {selectedManifest.hazardousClassification}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-on-surface-variant block">
                  Transport Vehicle Reg
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {selectedManifest.vehicleReg}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant">
              <div className="p-3 bg-success-container/40 border border-success text-success-content rounded-xl text-[11px] font-bold text-center">
                ✓ Digitally signed with SHA-256 HMAC & logged to CPCB National Registry
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
