import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ViewfinderReticle,
  WeightStepper,
  TouchButton,
  Card,
  AudioReadoutButton,
  SafetyBanner
} from '@kabadiwala/ui';
import { syncEngine } from '../services/syncService';
import type { ScrapLot, RecyclerFacility, MaterialCategory, ConditionGrade } from '@kabadiwala/shared';
import type { TabKey } from '../components/BottomNav';

interface AddScrapFlowProps {
  initialStep?: number;
  initialLot?: ScrapLot | null;
  onFinished: () => void;
  onNavigate: (tab: TabKey) => void;
}

const CATEGORY_RATES: Record<MaterialCategory, { name: string; rate: number; icon: string }> = {
  PCB: { name: 'सर्किट बोर्ड (PCB)', rate: 410, icon: 'memory' },
  CABLES: { name: 'तांबा तार व केबल', rate: 580, icon: 'cable' },
  BATTERIES: { name: 'लिथियम-आयन बैटरी', rate: 270, icon: 'battery_charging_full' },
  LCD_LED: { name: 'स्मार्टफोन व डिस्प्ले स्क्रीन', rate: 320, icon: 'smartphone' },
  CRT_TV: { name: 'CRT टीवी व भारी मॉनिटर', rate: 45, icon: 'tv' },
  MOTORS_MAGNETS: { name: 'मोटर, कंप्रेसर व ट्रांसफार्मर', rate: 260, icon: 'electric_meter' },
  MIXED_PLASTICS: { name: 'घरेलू ई-उपकरण व प्लास्टिक', rate: 110, icon: 'kitchen' }
};

const SAMPLE_RECYCLERS: RecyclerFacility[] = [
  {
    id: 'rec-1',
    user_id: 'u-rec-1',
    facility_name: 'EcoRecycle Solutions Hub',
    cpcb_reg_number: 'CPCB/EW/2024/DEL-0891',
    facility_type: 'RECYCLER',
    latitude: 28.6289,
    longitude: 77.2065,
    address: 'Plot 42, Mayapuri Industrial Phase II, Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110064',
    phone: '9811223344',
    is_cpcb_verified: true,
    capacity_kg_per_day: 5000,
    current_stock_kg: 1200,
    accepted_categories: ['PCB', 'CABLES', 'BATTERIES', 'LCD_LED', 'CRT_TV', 'MOTORS_MAGNETS', 'MIXED_PLASTICS']
  },
  {
    id: 'rec-2',
    user_id: 'u-rec-2',
    facility_name: 'GreenEarth Metal & E-Waste Refiners',
    cpcb_reg_number: 'CPCB/EW/2023/DEL-0142',
    facility_type: 'DISMANTLER',
    latitude: 28.6500,
    longitude: 77.2300,
    address: 'Kirti Nagar Recycling Cluster, Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110015',
    phone: '9822334455',
    is_cpcb_verified: true,
    capacity_kg_per_day: 3500,
    current_stock_kg: 800,
    accepted_categories: ['PCB', 'CABLES', 'BATTERIES', 'LCD_LED']
  },
  {
    id: 'rec-3',
    user_id: 'u-rec-3',
    facility_name: 'Bharat Circular Electronics Ltd',
    cpcb_reg_number: 'CPCB/EW/2025/NCR-9912',
    facility_type: 'COLLECTION_POINT',
    latitude: 28.5800,
    longitude: 77.1500,
    address: 'Okhla Industrial Area Phase 1, Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110020',
    phone: '9833445566',
    is_cpcb_verified: true,
    capacity_kg_per_day: 8000,
    current_stock_kg: 3200,
    accepted_categories: ['BATTERIES', 'MIXED_PLASTICS', 'CRT_TV']
  }
];

export const AddScrapFlow: React.FC<AddScrapFlowProps> = ({
  initialStep = 1,
  initialLot = null,
  onFinished,
  onNavigate
}) => {
  const { user } = useAuth();
  const { currentLanguage, t, speak } = useLanguage();

  const [step, setStep] = useState(initialStep);
  const [category, setCategory] = useState<MaterialCategory>(initialLot?.category || 'PCB');
  const [detectedCategory, setDetectedCategory] = useState<string>('सर्किट बोर्ड (PCB)');
  const [confidence, setConfidence] = useState<number>(96);
  const [weightKg, setWeightKg] = useState<number>(initialLot?.weight_kg || 8.5);
  const [condition, setCondition] = useState<ConditionGrade>(initialLot?.condition || 'GOOD');
  const [selectedRecycler, setSelectedRecycler] = useState<RecyclerFacility>(SAMPLE_RECYCLERS[0]);
  const [currentLot, setCurrentLot] = useState<ScrapLot | null>(initialLot);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [handoverConfirmed, setHandoverConfirmed] = useState(false);
  const [confirmedPayout, setConfirmedPayout] = useState<number>(0);

  // Calculate pricing
  const baseRate = CATEGORY_RATES[category]?.rate || 410;
  const conditionMultiplier = condition === 'GOOD' ? 1.0 : condition === 'BROKEN' ? 0.85 : 0.65;
  const scrapValue = Math.round(baseRate * weightKg * conditionMultiplier);
  const distanceKm = 4.2;
  const transportSubsidy = Math.round(distanceKm * 3.5);
  const totalEstimatedPayout = scrapValue + transportSubsidy;

  // Real-time SSE listener for Handover QR (Step 4)
  useEffect(() => {
    if (step === 4 && currentLot && !handoverConfirmed) {
      const streamUrl = `http://localhost:8000/api/v1/handovers/${currentLot.id}/stream`;
      let eventSource: EventSource | null = null;

      try {
        eventSource = new EventSource(streamUrl);
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.status === 'COMPLETED' || data.status === 'VERIFIED') {
              setHandoverConfirmed(true);
              setConfirmedPayout(data.final_payout || totalEstimatedPayout);
              speak(`बधाई हो! ₹${data.final_payout || totalEstimatedPayout} का भुगतान आपके बैंक खाते में जमा कर दिया गया है।`);
            }
          } catch (e) {
            console.warn('SSE parse error:', e);
          }
        };

        eventSource.onerror = () => {
          if (eventSource) eventSource.close();
        };
      } catch (err) {
        console.warn('SSE connection failed:', err);
      }

      return () => {
        if (eventSource) eventSource.close();
      };
    }
  }, [step, currentLot, handoverConfirmed]);

  const handleCaptureComplete = (capturedCategory: MaterialCategory, conf: number) => {
    setCategory(capturedCategory);
    setDetectedCategory(CATEGORY_RATES[capturedCategory]?.name || 'सर्किट बोर्ड');
    setConfidence(conf);
    speak(`${CATEGORY_RATES[capturedCategory]?.name} की पहचान हुई है। विश्वास स्तर ${conf} प्रतिशत है।`);
  };

  const handleCreateLot = async () => {
    setIsSubmitting(true);
    try {
      const lotData = {
        collector_id: user?.id || 'collector-demo-1',
        category: category,
        weight_kg: weightKg,
        condition: condition,
        estimated_payout: totalEstimatedPayout,
        unit_price: baseRate,
        matched_recycler_id: selectedRecycler.id,
        qr_token: `KC:${category.substring(0, 3)}:${Date.now()}:${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        fallback_code: String(Math.floor(1000 + Math.random() * 9000))
      };

      const created = await syncEngine.queueLotCreation(lotData);
      setCurrentLot(created);
      setStep(4);
      speak(`लॉट तैयार है। अनुमानित भुगतान ₹${totalEstimatedPayout}। रीसाइक्लर को QR कोड दिखाएं।`);
    } catch (err: any) {
      console.error('Failed to create lot:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-4 px-2">
      {[
        { num: 1, label: 'AI स्कैन' },
        { num: 2, label: 'वजन' },
        { num: 3, label: 'रीसाइक्लर' },
        { num: 4, label: 'QR कोड' }
      ].map((s, idx) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                step === s.num
                  ? 'bg-primary text-on-primary ring-4 ring-primary-container'
                  : step > s.num
                  ? 'bg-success text-on-success'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {step > s.num ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                s.num
              )}
            </div>
            <span
              className={`text-[10px] font-bold mt-1 ${
                step === s.num ? 'text-primary font-black' : 'text-on-surface-variant'
              }`}
            >
              {s.label}
            </span>
          </div>
          {idx < 3 && (
            <div
              className={`flex-1 h-1 mx-1 rounded ${
                step > idx + 1 ? 'bg-success' : 'bg-outline-variant'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      {renderStepIndicator()}

      {/* STEP 1: Viewfinder Camera & AI Classification */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                photo_camera
              </span>
              <span>AI कैमरा ई-कचरा पहचान</span>
            </h2>
            <AudioReadoutButton
              textToSpeak="कैमरे के सामने ई-कचरा रखें। AI स्वचालित रूप से श्रेणी पहचान लेगा।"
              lang={currentLanguage.bcp47}
              size="sm"
            />
          </div>

          <ViewfinderReticle
            detectedCategoryHi={detectedCategory}
            detectedCategoryEn={category}
            confidencePercent={confidence}
          />

          {/* Category Override Pills */}
          <div>
            <label className="block text-xs font-black text-on-surface uppercase tracking-wider mb-2">
              या श्रेणी स्वयं चुनें (Select Category)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CATEGORY_RATES) as MaterialCategory[]).map((catKey) => {
                const info = CATEGORY_RATES[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => {
                      setCategory(catKey);
                      setDetectedCategory(info.name);
                      setConfidence(98);
                      speak(`${info.name} चुना गया। सरकारी दर ₹${info.rate} प्रति किलो।`);
                    }}
                    className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-primary-container/40 border-primary text-primary shadow-sm font-black'
                        : 'bg-surface-container border-outline-variant text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{info.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate font-bold">{info.name}</div>
                      <div className="text-[10px] text-on-surface-variant">₹{info.rate}/kg</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <TouchButton
            variant="affirmative"
            size="xl"
            fullWidth
            icon="arrow_forward"
            onClick={() => {
              setStep(2);
              speak(`अगला चरण: वजन दर्ज करें। चयनित श्रेणी ${CATEGORY_RATES[category]?.name}।`);
            }}
          >
            आगे बढ़ें: वजन दर्ज करें
          </TouchButton>
        </div>
      )}

      {/* STEP 2: Live Weight Stepper & Condition Multiplier */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">scale</span>
              <span>वजन व स्थिति विवरण</span>
            </h2>
            <AudioReadoutButton
              textToSpeak={`वजन ${weightKg} किलोग्राम। अनुमानित मूल्य ₹${scrapValue}।`}
              lang={currentLanguage.bcp47}
              size="sm"
            />
          </div>

          {/* Selected Category Pill */}
          <div className="p-3 bg-primary-container/30 border-2 border-primary/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                {CATEGORY_RATES[category]?.icon}
              </span>
              <div>
                <div className="text-xs font-black text-primary">
                  {CATEGORY_RATES[category]?.name}
                </div>
                <div className="text-[10px] text-on-surface-variant">
                  न्यूनतम आधार दर: ₹{baseRate}/kg
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-black text-primary underline"
            >
              बदलें
            </button>
          </div>

          {/* Giant Dial Weight Stepper */}
          <WeightStepper
            weightKg={weightKg}
            onChange={(val) => setWeightKg(val)}
            minWeight={0.1}
            maxWeight={500.0}
            step={0.1}
          />

          {/* Condition Selector */}
          <div>
            <label className="block text-xs font-black text-on-surface uppercase tracking-wider mb-2">
              {t.condition} (Condition Multiplier)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'GOOD', label: t.goodCondition, mult: '100%', border: 'border-success' },
                { key: 'BROKEN', label: t.brokenCondition, mult: '85%', border: 'border-secondary' },
                { key: 'BURNT', label: t.burntCondition, mult: '65%', border: 'border-error' }
              ].map((c) => {
                const isSelected = condition === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => {
                      setCondition(c.key as ConditionGrade);
                      speak(`स्थिति: ${c.label}`);
                    }}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all active:scale-95 ${
                      isSelected
                        ? `bg-surface-container-high ${c.border} font-black ring-2 ring-primary`
                        : 'bg-surface-container border-outline-variant text-on-surface'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{c.label}</div>
                    <div className="text-[10px] text-on-surface-variant mt-1 font-black">
                      {c.mult} दर
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Value Calculation Bento */}
          <Card level={2} accent="neutral" className="p-4 bg-surface-container-low">
            <div className="flex justify-between items-center text-xs text-on-surface-variant mb-1">
              <span>कचरा मूल्य ({weightKg} kg × ₹{baseRate} × {conditionMultiplier}):</span>
              <span className="font-black text-on-surface">₹{scrapValue}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant mb-2">
              <span>हरित परिवहन सब्सिडी (4.2 km):</span>
              <span className="font-black text-success">+₹{transportSubsidy}</span>
            </div>
            <div className="pt-2 border-t border-outline-variant flex justify-between items-center">
              <span className="text-sm font-black text-on-surface">{t.payoutAmount}:</span>
              <span className="text-xl font-black text-primary">₹{totalEstimatedPayout}</span>
            </div>
          </Card>

          <div className="flex gap-2">
            <TouchButton
              variant="outline"
              size="lg"
              onClick={() => setStep(1)}
              icon="arrow_back"
            >
              पीछे
            </TouchButton>
            <TouchButton
              variant="affirmative"
              size="lg"
              fullWidth
              icon="arrow_forward"
              onClick={() => {
                setStep(3);
                speak(`रीसाइक्लर सूची। सर्वोत्तम मूल्य ₹${totalEstimatedPayout}।`);
              }}
            >
              रीसाइक्लर चुनें
            </TouchButton>
          </div>
        </div>
      )}

      {/* STEP 3: Recycler Match (Ranked by Payout & Subsidy) */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                local_shipping
              </span>
              <span>{t.findBestRecycler}</span>
            </h2>
            <AudioReadoutButton
              textToSpeak={`सर्वोत्तम रीसाइक्लर चुनें। हरित सब्सिडी के साथ कुल भुगतान ₹${totalEstimatedPayout}`}
              lang={currentLanguage.bcp47}
              size="sm"
            />
          </div>

          <div className="space-y-3">
            {SAMPLE_RECYCLERS.map((recycler, idx) => {
              const isSelected = selectedRecycler.id === recycler.id;
              const bonus = idx === 0 ? transportSubsidy : 0;
              const payout = scrapValue + bonus;

              return (
                <div
                  key={recycler.id}
                  onClick={() => {
                    setSelectedRecycler(recycler);
                    speak(`${recycler.facility_name} चुना गया। कुल भुगतान ₹${payout}।`);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-primary-container/30 border-primary ring-2 ring-primary/30 shadow-md'
                      : 'bg-surface-container border-outline-variant hover:border-outline'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {idx === 0 && (
                        <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded font-black uppercase mb-1 inline-block">
                          ★ Best Match (Top Payout)
                        </span>
                      )}
                      <h3 className="font-black text-sm text-on-surface">
                        {recycler.facility_name}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {recycler.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-primary">₹{payout}</div>
                      <div className="text-[10px] text-on-surface-variant">
                        {idx === 0 ? '4.2 km' : '6.8 km'} दूरी
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40 text-xs">
                    <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-success">
                        verified
                      </span>
                      {recycler.cpcb_reg_number}
                    </span>
                    <span className="font-black text-secondary text-xs flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs text-yellow-500">
                        star
                      </span>
                      4.9
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <TouchButton
              variant="outline"
              size="lg"
              onClick={() => setStep(2)}
              icon="arrow_back"
            >
              पीछे
            </TouchButton>
            <TouchButton
              variant="affirmative"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              icon="check_circle"
              onClick={handleCreateLot}
            >
              QR कोड जनरेट करें (₹{totalEstimatedPayout})
            </TouchButton>
          </div>
        </div>
      )}

      {/* STEP 4: Verifiable Handover QR Code & Live SSE Listener */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">qr_code_scanner</span>
              <span>{t.handoverQr}</span>
            </h2>
            <AudioReadoutButton
              textToSpeak={
                handoverConfirmed
                  ? `सत्यापन पूर्ण! ₹${confirmedPayout || totalEstimatedPayout} का भुगतान हो गया।`
                  : `रीसाइक्लर को यह QR कोड दिखाएं। यदि कैमरा काम न करे तो पिन कोड ${currentLot?.fallback_code || '5824'} बताएं।`
              }
              lang={currentLanguage.bcp47}
              size="sm"
            />
          </div>

          {handoverConfirmed ? (
            <div className="p-6 bg-success text-on-success rounded-3xl shadow-xl text-center space-y-3 animate-bounce-short">
              <div className="w-16 h-16 rounded-full bg-white text-success mx-auto flex items-center justify-center text-3xl font-black shadow-md">
                ✓
              </div>
              <h3 className="text-2xl font-black">भुगतान सफल! (Payment Received)</h3>
              <p className="text-base font-bold text-white/90">
                ₹{confirmedPayout || totalEstimatedPayout} आपके बैंक/UPI खाते में तुरंत क्रेडिट हो गए हैं।
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono">
                Transaction ID: TXN-{Date.now().toString().slice(-8)}
              </div>
              <div className="pt-2">
                <TouchButton
                  variant="payout"
                  size="xl"
                  fullWidth
                  icon="receipt_long"
                  onClick={() => {
                    onFinished();
                    onNavigate('ledger');
                  }}
                >
                  खाता व रसीद देखें (View Ledger)
                </TouchButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Card level={2} accent="primary" className="p-5 text-center flex flex-col items-center justify-center bg-white shadow-lg border-2 border-primary">
                <div className="p-3 bg-white rounded-2xl border border-outline-variant shadow-inner">
                  <QRCode
                    value={currentLot?.qr_token || `KC:PCB:${Date.now()}:DEMOSIG99`}
                    size={200}
                    level="H"
                  />
                </div>

                <div className="mt-3">
                  <div className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
                    {t.showToRecycler}
                  </div>
                  <div className="text-2xl font-black text-primary mt-1">
                    ₹{totalEstimatedPayout}
                  </div>
                </div>

                {/* 4-Digit Fallback Code */}
                <div className="mt-4 pt-3 border-t-2 border-dashed border-outline-variant w-full">
                  <div className="text-[11px] font-black text-on-surface-variant uppercase">
                    {t.handoverCode} (Fallback PIN)
                  </div>
                  <div className="text-3xl font-black tracking-[0.4em] text-on-surface font-mono mt-1 bg-surface-container-low py-2 px-4 rounded-xl inline-block border-2 border-outline-variant">
                    {currentLot?.fallback_code || '5824'}
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1">
                    कैमरा खराबी की स्थिति में रीसाइक्लर को यह 4 अंकों का पिन बताएं
                  </p>
                </div>
              </Card>

              {/* Waiting for Recycler SSE Live Pulse */}
              <div className="p-3.5 bg-primary-container/30 border-2 border-primary/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <div>
                    <div className="text-xs font-black text-primary">रीसाइक्लर स्कैन की प्रतीक्षा...</div>
                    <div className="text-[10px] text-on-surface-variant">
                      रीसाइक्लर द्वारा स्कैन करते ही तुरंत भुगतान की पुष्टि होगी
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setHandoverConfirmed(true);
                    setConfirmedPayout(totalEstimatedPayout);
                    speak(`भुगतान प्राप्त हुआ: ₹${totalEstimatedPayout}`);
                  }}
                  className="px-2 py-1 bg-primary text-on-primary text-[10px] font-black rounded border border-white/20 active:scale-95"
                >
                  Demo Confirm
                </button>
              </div>

              {/* Hazardous Battery / Glass Safety Warning */}
              {(category === 'BATTERIES' || category === 'CRT_TV') && (
                <SafetyBanner
                  titleHi="सुरक्षा सावधानी: बैटरी / सीआरटी ग्लास"
                  titleEn="Hazard Alert: Battery / CRT Leaded Glass"
                  descriptionHi="बैटरी को सीधे धूप या पानी से दूर रखें। टूटे हुए CRT ग्लास को नंगे हाथों से न छुएं।"
                  descriptionEn="Keep batteries away from moisture. Never touch broken CRT phosphor glass with bare hands."
                  hazardType="BATTERY"
                />
              )}

              <div className="pt-2">
                <TouchButton
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon="home"
                  onClick={() => {
                    onFinished();
                    onNavigate('home');
                  }}
                >
                  होम पर लौटें
                </TouchButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
