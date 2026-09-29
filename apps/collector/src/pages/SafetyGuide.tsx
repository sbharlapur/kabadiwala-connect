import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SafetyBanner, AudioReadoutButton, TouchButton } from '@kabadiwala/ui';

interface SafetyGuideProps {
  onNavigateHome: () => void;
}

export const SafetyGuide: React.FC<SafetyGuideProps> = ({ onNavigateHome }) => {
  const { currentLanguage, t } = useLanguage();

  const audioSummary = `ई-कचरा सुरक्षा निर्देश: लिथियम बैटरी को कभी भी हथौड़े से न तोड़ें। एसिड में सर्किट बोर्ड जलाना या धोना कानूनी अपराध है। हमेशा मोटे दस्ताने पहनें।`;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-2xl">
              health_and_safety
            </span>
            <span>{t.safetyGuidelines}</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            CPCB ई-कचरा प्रबंधन नियम 2022 दिशानिर्देश
          </p>
        </div>
        <AudioReadoutButton textToSpeak={audioSummary} lang={currentLanguage.bcp47} size="sm" />
      </div>

      {/* Emergency Hotline Banner */}
      <div className="p-3.5 bg-error text-on-error rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-2xl">emergency</span>
          <div>
            <div className="text-xs font-black">आपातकालीन ई-कचरा हेल्पलाइन</div>
            <div className="text-sm font-black font-mono">1800-11-8005 (CPCB Toll-Free)</div>
          </div>
        </div>
        <a
          href="tel:1800118005"
          className="px-3 py-1.5 bg-white text-error rounded-xl text-xs font-black shadow active:scale-95"
        >
          Call
        </a>
      </div>

      {/* Critical Safety Protocol 1: Li-Ion Batteries */}
      <div className="space-y-2">
        <SafetyBanner
          titleHi="1. लिथियम-आयन बैटरी सुरक्षा (अग्नि जोखिम)"
          titleEn="1. Lithium-Ion Battery Handling (Fire Risk)"
          descriptionHi="बैटरी को कभी न काटें, न दबाएं और न ही आग के पास रखें। फूल चुकी बैटरी को सूखी रेत या सुरक्षित डिब्बे में रखें।"
          descriptionEn="Never puncture or burn batteries. Store swollen packs in dry sand containers."
          hazardType="BATTERY"
        />
        <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface space-y-1">
          <div className="font-bold flex items-center gap-1 text-error">
            <span className="material-symbols-outlined text-sm">cancel</span>
            <span>प्रतिबंधित: हथौड़े से तोड़ना या शॉर्ट-सर्किट करना</span>
          </div>
          <div className="font-bold flex items-center gap-1 text-success">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>अनुशंसित: टर्मिनलों पर बिजली का टेप चिपकाएं</span>
          </div>
        </div>
      </div>

      {/* Critical Safety Protocol 2: Acid Washing Prohibition */}
      <div className="space-y-2">
        <SafetyBanner
          titleHi="2. एसिड से धातु निकालना सख्त मना है"
          titleEn="2. Open Acid Leaching Prohibition"
          descriptionHi="खुले में सर्किट बोर्ड (PCB) को एसिड में धोना या जलाना गैर-कानूनी है। इससे फेफड़े खराब होते हैं और मिट्टी जहरीली होती है।"
          descriptionEn="Acid leaching and open burning of PCBs is strictly banned under CPCB rules."
          hazardType="ACID"
        />
        <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface space-y-1">
          <div className="font-bold flex items-center gap-1 text-error">
            <span className="material-symbols-outlined text-sm">cancel</span>
            <span>प्रतिबंधित: तेजाब/एसिड का इस्तेमाल या खुली भट्टी में जलाना</span>
          </div>
          <div className="font-bold flex items-center gap-1 text-success">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>अनुशंसित: अधिकृत रीसाइक्लर को पूरा बोर्ड सौंपें</span>
          </div>
        </div>
      </div>

      {/* Critical Safety Protocol 3: CRT Leaded Glass */}
      <div className="space-y-2">
        <SafetyBanner
          titleHi="3. पुराने CRT मॉनिटर व टीवी ग्लास"
          titleEn="3. Leaded CRT Funnel Glass Protocol"
          descriptionHi="CRT ट्यूब में भारी मात्रा में सीसा (Lead) और जहरीला फॉस्फर पाउडर होता है। इसे कभी न फोड़ें।"
          descriptionEn="CRT funnels contain heavy lead and toxic phosphors. Do not break or inhale dust."
          hazardType="CRT"
        />
        <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface space-y-1">
          <div className="font-bold flex items-center gap-1 text-error">
            <span className="material-symbols-outlined text-sm">cancel</span>
            <span>प्रतिबंधित: नंगे हाथों से टूटा ग्लास उठाना</span>
          </div>
          <div className="font-bold flex items-center gap-1 text-success">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>अनुशंसित: लेदर के मोटे दस्ताने पहनें</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <TouchButton
          variant="affirmative"
          size="lg"
          fullWidth
          icon="home"
          onClick={onNavigateHome}
        >
          होम पर लौटें
        </TouchButton>
      </div>
    </div>
  );
};
