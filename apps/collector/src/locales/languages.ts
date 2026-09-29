export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
  isRtl?: boolean;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN', region: 'North / Central India' },
  { code: 'en', name: 'English', nativeName: 'English', bcp47: 'en-IN', region: 'Pan-India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', bcp47: 'bn-IN', region: 'West Bengal / Tripura' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN', region: 'Andhra Pradesh / Telangana' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN', region: 'Maharashtra' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN', region: 'Tamil Nadu / Puducherry' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', bcp47: 'ur-IN', isRtl: true, region: 'Pan-India' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', bcp47: 'gu-IN', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN', region: 'Kerala / Lakshadweep' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', bcp47: 'or-IN', region: 'Odisha' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN', region: 'Punjab' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', bcp47: 'as-IN', region: 'Assam' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', bcp47: 'mai-IN', region: 'Bihar / Jharkhand' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', bcp47: 'sat-IN', region: 'Jharkhand / Odisha / WB' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', bcp47: 'ks-IN', isRtl: true, region: 'Jammu & Kashmir' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', bcp47: 'ne-NP', region: 'Sikkim / West Bengal' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', bcp47: 'kok-IN', region: 'Goa / Maharashtra' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', bcp47: 'sd-IN', isRtl: true, region: 'Gujarat / Rajasthan' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', bcp47: 'doi-IN', region: 'Jammu & Kashmir' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', bcp47: 'mni-IN', region: 'Manipur' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर\'', bcp47: 'brx-IN', region: 'Assam' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', bcp47: 'sa-IN', region: 'Traditional' },
  { code: 'kha', name: 'Khasi', nativeName: 'Ka Ktien Khasi', bcp47: 'en-IN', region: 'Meghalaya' },
  { code: 'grt', name: 'Garo', nativeName: 'A·chik', bcp47: 'en-IN', region: 'Meghalaya' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', bcp47: 'en-IN', region: 'Mizoram' },
  { code: 'trp', name: 'Kokborok', nativeName: 'Tripuri / Kokborok', bcp47: 'bn-IN', region: 'Tripura' }
];

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  selectLanguage: string;
  confirmLanguage: string;
  loginTitle: string;
  enterPhone: string;
  enterPin: string;
  loginButton: string;
  demoAutofill: string;
  todayEarnings: string;
  totalScrapCollected: string;
  activeLots: string;
  greenSubsidy: string;
  addScrap: string;
  priceBoard: string;
  handoverQr: string;
  safetyGuidelines: string;
  scanCamera: string;
  uploadPhoto: string;
  aiClassification: string;
  weightKg: string;
  condition: string;
  goodCondition: string;
  brokenCondition: string;
  burntCondition: string;
  findBestRecycler: string;
  handoverCode: string;
  showToRecycler: string;
  payoutAmount: string;
  offlineNotice: string;
  syncPending: string;
  syncSuccess: string;
  cpcbVerified: string;
  audioAssist: string;
  readAloud: string;
  categories: {
    PCB: string;
    SMARTPHONE: string;
    LAPTOP_DESKTOP: string;
    LI_ION_BATTERY: string;
    COPPER_WIRE: string;
    HOME_APPLIANCE: string;
    CRT_MONITOR: string;
  };
}

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  hi: {
    appName: 'कबाड़ीवाला Connect',
    tagline: 'ई-कचरे का सही दाम, तुरंत भुगतान',
    selectLanguage: 'अपनी भाषा चुनें (Select Language)',
    confirmLanguage: 'भाषा पुष्टि करें',
    loginTitle: 'कबाड़ीवाला लॉगिन',
    enterPhone: 'मोबाइल नंबर दर्ज करें',
    enterPin: '4-अंकों का पिन (PIN)',
    loginButton: 'आगे बढ़ें / लॉगिन',
    demoAutofill: 'डेमो खाता चुनें (1-क्लिक)',
    todayEarnings: 'आज की कुल कमाई',
    totalScrapCollected: 'कुल ई-कचरा वजन',
    activeLots: 'सक्रिय लॉट (Pending)',
    greenSubsidy: 'हरित परिवहन सब्सिडी',
    addScrap: 'नया ई-कचरा जोड़ें',
    priceBoard: 'सरकारी न्यूनतम मूल्य (MSP)',
    handoverQr: 'हैंडओवर क्यूआर (QR Code)',
    safetyGuidelines: 'सुरक्षा निर्देश (Safety)',
    scanCamera: 'कैमरे से फोटो लें',
    uploadPhoto: 'गैलरी से चुनें',
    aiClassification: 'AI ई-कचरा पहचान',
    weightKg: 'वजन (किलोग्राम)',
    condition: 'कचरे की स्थिति',
    goodCondition: 'साबुत / अच्छी (100%)',
    brokenCondition: 'टूटा / मिश्रित (85%)',
    burntCondition: 'जला / जंग लगा (65%)',
    findBestRecycler: 'सर्वोत्तम रीसाइक्लर खोजें',
    handoverCode: '4-अंकीय हैंडओवर पिन',
    showToRecycler: 'रीसाइक्लर को यह QR दिखाएं',
    payoutAmount: 'अनुमानित भुगतान',
    offlineNotice: 'ऑफ़लाइन मोड सक्रिय — डेटा सुरक्षित सेव रहेगा',
    syncPending: 'डेटा सिंक लंबित है',
    syncSuccess: 'सभी डेटा सिंक हो गया',
    cpcbVerified: 'CPCB अधिकृत',
    audioAssist: 'आवाज़ में सुनें',
    readAloud: 'पूरा पढ़कर सुनाएं',
    categories: {
      PCB: 'सर्किट बोर्ड (PCB)',
      SMARTPHONE: 'स्मार्टफोन / मोबाइल',
      LAPTOP_DESKTOP: 'लैपटॉप व कंप्यूटर',
      LI_ION_BATTERY: 'लिथियम-आयन बैटरी',
      COPPER_WIRE: 'तांबा तार / केबल',
      HOME_APPLIANCE: 'घरेलू उपकरण (AC/फ्रिज)',
      CRT_MONITOR: 'CRT स्क्रीन व टीवी'
    }
  },
  en: {
    appName: 'Kabadiwala Connect',
    tagline: 'Fair E-Waste Pricing, Instant Payouts',
    selectLanguage: 'Select Your Language',
    confirmLanguage: 'Confirm Language',
    loginTitle: 'Collector Login',
    enterPhone: 'Enter 10-Digit Mobile Number',
    enterPin: 'Enter 4-Digit PIN',
    loginButton: 'Continue / Login',
    demoAutofill: 'Quick Demo Profile',
    todayEarnings: "Today's Total Earnings",
    totalScrapCollected: 'Total E-Waste Collected',
    activeLots: 'Active Lots',
    greenSubsidy: 'Green Mobility Subsidy',
    addScrap: 'Add E-Waste Scrap',
    priceBoard: 'CPCB MSP Price Board',
    handoverQr: 'Handover QR Code',
    safetyGuidelines: 'Safety Guide & Protocols',
    scanCamera: 'Take Photo with Camera',
    uploadPhoto: 'Upload from Gallery',
    aiClassification: 'AI E-Waste Detection',
    weightKg: 'Weight (Kilograms)',
    condition: 'Scrap Condition',
    goodCondition: 'Good / Intact (100%)',
    brokenCondition: 'Broken / Mixed (85%)',
    burntCondition: 'Burnt / Corroded (65%)',
    findBestRecycler: 'Find Best Recycler',
    handoverCode: '4-Digit Fallback PIN',
    showToRecycler: 'Show this QR to Authorized Recycler',
    payoutAmount: 'Estimated Payout',
    offlineNotice: 'Offline Mode Active — Data Saved Locally',
    syncPending: 'Sync Pending with Cloud',
    syncSuccess: 'All Data Synced',
    cpcbVerified: 'CPCB / SPCB Authorized',
    audioAssist: 'Voice Readout',
    readAloud: 'Read Aloud',
    categories: {
      PCB: 'Printed Circuit Boards (PCB)',
      SMARTPHONE: 'Smartphones & Feature Phones',
      LAPTOP_DESKTOP: 'Laptops & Computers',
      LI_ION_BATTERY: 'Lithium-Ion Batteries',
      COPPER_WIRE: 'Copper Wires & Harnesses',
      HOME_APPLIANCE: 'Home Appliances',
      CRT_MONITOR: 'CRT Monitors & Glass TV'
    }
  },
  bn: {
    appName: 'কাবাড়িওয়ালা কানেক্ট',
    tagline: 'ই-বর্জ্যের সঠিক দাম, তাত্ক্ষণিক অর্থ প্রদান',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    confirmLanguage: 'ভাষা নিশ্চিত করুন',
    loginTitle: 'সংগ্রাহক লগইন',
    enterPhone: 'মোবাইল নম্বর লিখুন',
    enterPin: '৪-সংখ্যার পিন (PIN)',
    loginButton: 'এগিয়ে যান / লগইন',
    demoAutofill: 'ডেমো অ্যাকাউন্ট বাছাই করুন',
    todayEarnings: 'আজকের মোট আয়',
    totalScrapCollected: 'মোট ই-বর্জ্যের ওজন',
    activeLots: 'সক্রিয় লট',
    greenSubsidy: 'সবুজ পরিবহন ভর্তুকি',
    addScrap: 'নতুন ই-বর্জ্য যোগ করুন',
    priceBoard: 'সরকারি ন্যূনতম মূল্য (MSP)',
    handoverQr: 'হ্যান্ডওভার কিউআর কোড',
    safetyGuidelines: 'নিরাপত্তা নির্দেশাবলী',
    scanCamera: 'ক্যামেরা দিয়ে ছবি তুলুন',
    uploadPhoto: 'গ্যালারি থেকে বেছে নিন',
    aiClassification: 'AI ই-বর্জ্য শনাক্তকরণ',
    weightKg: 'ওজন (কেজি)',
    condition: 'বর্জ্যের অবস্থা',
    goodCondition: 'সম্পূর্ণ / ভালো (১০০%)',
    brokenCondition: 'ভাঙা / মিশ্রিত (৮৫%)',
    burntCondition: 'পোড়া / ক্ষয়প্রাপ্ত (৬৫%)',
    findBestRecycler: 'সেরা রিসাইক্লার খুঁজুন',
    handoverCode: '৪-সংখ্যার হ্যান্ডওভার পিন',
    showToRecycler: 'রিসাইক্লারকে এই QR কোড দেখান',
    payoutAmount: 'আনুমানিক মূল্য',
    offlineNotice: 'অফলাইন মোড চালু আছে',
    syncPending: 'সিঙ্ক বাকি আছে',
    syncSuccess: 'সমস্ত ডেটা সিঙ্ক হয়েছে',
    cpcbVerified: 'CPCB অনুমোদিত',
    audioAssist: 'ভয়েসে শুনুন',
    readAloud: 'পড়ে শোনান',
    categories: {
      PCB: 'সার্কিট বোর্ড (PCB)',
      SMARTPHONE: 'স্মার্টফোন ও মোবাইল',
      LAPTOP_DESKTOP: 'ল্যাপটপ ও কম্পিউটার',
      LI_ION_BATTERY: 'লিথিয়াম-আয়ন ব্যাটারি',
      COPPER_WIRE: 'তামার তার ও কেবল',
      HOME_APPLIANCE: 'গৃহস্থালির সরঞ্জাম',
      CRT_MONITOR: 'সিআরটি স্ক্রিন ও টিভি'
    }
  },
  te: {
    appName: 'కబాడీవాలా కనెక్ట్',
    tagline: 'ఇ-వ్యర్థాలకు సరైన ధర, తక్షణ చెల్లింపు',
    selectLanguage: 'భాషను ఎంచుకోండి',
    confirmLanguage: 'భాషను నిర్ధారించండి',
    loginTitle: 'కలెక్టర్ లాగిన్',
    enterPhone: 'మొబైల్ నంబర్ నమోదు చేయండి',
    enterPin: '4-అంకెల పిన్ (PIN)',
    loginButton: 'లాగిన్ చేయండి',
    demoAutofill: 'డెమో ఖాతా ఎంచుకోండి',
    todayEarnings: 'ఈరోజు మొత్తం సంపాదన',
    totalScrapCollected: 'మొత్తం ఇ-వ్యర్థాల బరువు',
    activeLots: 'యాక్టివ్ లాట్‌లు',
    greenSubsidy: 'గ్రీన్ ట్రాన్స్‌పోర్ట్ సబ్సిడీ',
    addScrap: 'కొత్త ఇ-వ్యర్థాలను జోడించండి',
    priceBoard: 'ప్రభుత్వ కనీస మద్దతు ధర (MSP)',
    handoverQr: 'హ్యాండ్‌ఓవర్ QR కోడ్',
    safetyGuidelines: 'భద్రతా నియమాలు',
    scanCamera: 'కెమెరాతో ఫోటో తీయండి',
    uploadPhoto: 'గ్యాలరీ నుండి ఎంచుకోండి',
    aiClassification: 'AI ఇ-వ్యర్థాల గుర్తింపు',
    weightKg: 'బరువు (కిలోగ్రాములు)',
    condition: 'పరిస్థితి',
    goodCondition: 'బాగుంది (100%)',
    brokenCondition: 'విరిగినది (85%)',
    burntCondition: 'కాలినది (65%)',
    findBestRecycler: 'ఉత్తమ రీసైక్లర్‌ను కనుగొనండి',
    handoverCode: '4-అంకెల పిన్',
    showToRecycler: 'ఈ QR ను రీసైక్లర్‌కు చూపించండి',
    payoutAmount: 'అంచనా వేసిన చెల్లింపు',
    offlineNotice: 'ఆఫ్‌లైన్ మోడ్ యాక్టివ్‌గా ఉంది',
    syncPending: 'సింక్ పెండింగ్‌లో ఉంది',
    syncSuccess: 'డేటా విజయవంతంగా సింక్ అయింది',
    cpcbVerified: 'CPCB ధృవీకరించబడింది',
    audioAssist: 'వాయిస్ వినండి',
    readAloud: 'చదివి వినిపించు',
    categories: {
      PCB: 'సర్క్యూట్ బోర్డ్ (PCB)',
      SMARTPHONE: 'స్మార్ట్‌ఫోన్ / మొబైల్',
      LAPTOP_DESKTOP: 'ల్యాప్‌టాప్ & కంప్యూటర్',
      LI_ION_BATTERY: 'లిథియం-అయాన్ బ్యాటరీ',
      COPPER_WIRE: 'రాగి వైర్ & కేబుల్',
      HOME_APPLIANCE: 'గృహోపకరణాలు',
      CRT_MONITOR: 'CRT మానిటర్ & టీవీ'
    }
  },
  mr: {
    appName: 'कबाडीवाला कनेक्ट',
    tagline: 'ई-कचऱ्याला योग्य भाव, त्वरित मोबदला',
    selectLanguage: 'आपली भाषा निवडा',
    confirmLanguage: 'भाषा निश्चित करा',
    loginTitle: 'कलेक्टर लॉगिन',
    enterPhone: 'मोबाईल क्रमांक प्रविष्ट करा',
    enterPin: '४-अंकी पिन (PIN)',
    loginButton: 'पुढे जा / लॉगिन करा',
    demoAutofill: 'डेमो खाते निवडा',
    todayEarnings: 'आजची एकूण कमाई',
    totalScrapCollected: 'एकूण ई-कचरा वजन',
    activeLots: 'सक्रिय लॉट',
    greenSubsidy: 'हरित वाहतूक अनुदान',
    addScrap: 'नवीन ई-कचरा जोडा',
    priceBoard: 'सरकारी हमीभाव (MSP)',
    handoverQr: 'हँडओव्हर क्यूआर (QR Code)',
    safetyGuidelines: 'सुरक्षा मार्गदर्शक तत्त्वे',
    scanCamera: 'कॅमेऱ्याने फोटो घ्या',
    uploadPhoto: 'गॅलरीमधून निवडा',
    aiClassification: 'AI ई-कचरा ओळख',
    weightKg: 'वजन (किलोग्रॅम)',
    condition: 'कचऱ्याची स्थिती',
    goodCondition: 'उत्तम / अखंड (१००%)',
    brokenCondition: 'तुटलेले / मिश्र (८५%)',
    burntCondition: 'जळालेले (६५%)',
    findBestRecycler: 'सर्वोत्तम रिसायकलर शोधा',
    handoverCode: '४-अंकी हँडओव्हर पिन',
    showToRecycler: 'हा QR रिसायकलरला दाखवा',
    payoutAmount: 'अंदाजे रक्कम',
    offlineNotice: 'ऑफलाइन मोड सुरू आहे',
    syncPending: 'सिंक प्रलंबित आहे',
    syncSuccess: 'सर्व डेटा सिंक झाला',
    cpcbVerified: 'CPCB मान्यताप्राप्त',
    audioAssist: 'आवाजात ऐका',
    readAloud: 'मोठ्याने वाचा',
    categories: {
      PCB: 'सर्किट बोर्ड (PCB)',
      SMARTPHONE: 'स्मार्टफोन / मोबाईल',
      LAPTOP_DESKTOP: 'लॅपटॉप आणि कॉम्प्युटर',
      LI_ION_BATTERY: 'लिथियम-आयन बॅटरी',
      COPPER_WIRE: 'तांब्याची वायर आणि केबल',
      HOME_APPLIANCE: 'घरगुती उपकरणे',
      CRT_MONITOR: 'CRT स्क्रीन आणि टीव्ही'
    }
  },
  ta: {
    appName: 'கபாடிவாலா கனெக்ட்',
    tagline: 'மின்னணு கழிவுகளுக்கு நியாயமான விலை, உடனடி பணம்',
    selectLanguage: 'மொழியை தேர்ந்தெடுக்கவும்',
    confirmLanguage: 'மொழியை உறுதிப்படுத்தவும்',
    loginTitle: 'சேகரிப்பாளர் உள்நுழைவு',
    enterPhone: 'கைபேசி எண் உள்ளிடவும்',
    enterPin: '4-இலக்க பின் (PIN)',
    loginButton: 'உள்நுழைக',
    demoAutofill: 'டெமோ கணக்கு',
    todayEarnings: 'இன்றைய மொத்த வருமானம்',
    totalScrapCollected: 'மொத்த மின் கழிவு எடை',
    activeLots: 'செயலில் உள்ள லாட்கள்',
    greenSubsidy: 'பசுமை போக்குவரத்து மானியம்',
    addScrap: 'புதிய மின்-கழிவு சேர்க்க',
    priceBoard: 'அரசு குறைந்தபட்ச விலை (MSP)',
    handoverQr: 'ஒப்படைப்பு QR குறியீடு',
    safetyGuidelines: 'பாதுகாப்பு வழிகாட்டுதல்கள்',
    scanCamera: 'கேமரா மூலம் புகைப்படம் எடுக்கவும்',
    uploadPhoto: 'கேலரியில் இருந்து தேர்வு செய்யவும்',
    aiClassification: 'AI மின்-கழிவு கண்டறிதல்',
    weightKg: 'எடை (கிலோ)',
    condition: 'கழிவு நிலை',
    goodCondition: 'நல்ல நிலை (100%)',
    brokenCondition: 'உடைந்தது (85%)',
    burntCondition: 'எரிந்தது (65%)',
    findBestRecycler: 'சிறந்த மறுசுழற்சியாளரைக் கண்டறியவும்',
    handoverCode: '4-இலக்க பின்',
    showToRecycler: 'இந்த QR-ஐ மறுசுழற்சியாளரிடம் காட்டவும்',
    payoutAmount: 'மதிப்பிடப்பட்ட தொகை',
    offlineNotice: 'ஆஃப்லைன் பயன்முறை செயலில் உள்ளது',
    syncPending: 'ஒத்திசைவு நிலுவையில் உள்ளது',
    syncSuccess: 'தரவு ஒத்திசைக்கப்பட்டது',
    cpcbVerified: 'CPCB அங்கீகரிக்கப்பட்டது',
    audioAssist: 'குரலில் கேளுங்கள்',
    readAloud: 'வாசித்து காட்டு',
    categories: {
      PCB: 'சர்க்யூட் பலகை (PCB)',
      SMARTPHONE: 'ஸ்மார்ட்போன் / மொபைல்',
      LAPTOP_DESKTOP: 'லேப்டாப் & கணினி',
      LI_ION_BATTERY: 'லித்தியம்-அயன் பேட்டரி',
      COPPER_WIRE: 'செம்பு கம்பி & கேபிள்',
      HOME_APPLIANCE: 'வீட்டு உபயோக பொருட்கள்',
      CRT_MONITOR: 'CRT திரை & டிவி'
    }
  }
};

export function getTranslation(langCode: string): TranslationDictionary {
  if (TRANSLATIONS[langCode]) {
    return TRANSLATIONS[langCode];
  }
  // Fallback to Hindi if exists or English
  return TRANSLATIONS['hi'] || TRANSLATIONS['en'];
}
