export type SupportedLocale = 'en' | 'bn';

interface TranslationMap {
  [key: string]: Partial<Record<SupportedLocale, string>>;
}

let currentLocale: SupportedLocale = 'en';
let listeners: Set<() => void> = new Set();

const translations: TranslationMap = {
  'app.name': { en: 'Open Knowledge Studio', bn: 'ওপেন নলেজ স্টুডিও' },
  'app.tagline': { en: 'Research, Synthesize, Create', bn: 'গবেষণা, সংশ্লেষণ, তৈরি করুন' },
  'nav.home': { en: 'Home', bn: 'হোম' },
  'nav.search': { en: 'Search', bn: 'অনুসন্ধান' },
  'nav.chat': { en: 'Chat', bn: 'চ্যাট' },
  'nav.settings': { en: 'Settings', bn: 'সেটিংস' },
  'nav.knowledge': { en: 'Knowledge Base', bn: 'জ্ঞানভাণ্ডার' },
  'nav.agents': { en: 'Agents', bn: 'এজেন্ট' },
  'nav.workspace': { en: 'Workspace', bn: 'ওয়ার্কস্পেস' },
  'nav.tools': { en: 'Tools', bn: 'টুলস' },
  'nav.epi': { en: 'Epi Map', bn: 'এপি ম্যাপ' },
  'nav.bd': { en: 'Bangladesh', bn: 'বাংলাদেশ' },
  'nav.icd': { en: 'ICD-11', bn: 'আইসিডি-১১' },
  'nav.dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'common.loading': { en: 'Loading...', bn: 'লোড হচ্ছে...' },
  'common.error': { en: 'Error', bn: 'ত্রুটি' },
  'common.save': { en: 'Save', bn: 'সংরক্ষণ' },
  'common.cancel': { en: 'Cancel', bn: 'বাতিল' },
  'common.delete': { en: 'Delete', bn: 'মুছুন' },
  'common.search': { en: 'Search', bn: 'অনুসন্ধান' },
  'common.export': { en: 'Export', bn: 'এক্সপোর্ট' },
  'common.import': { en: 'Import', bn: 'ইম্পোর্ট' },
  'common.refresh': { en: 'Refresh', bn: 'রিফ্রেশ' },
  'chat.send': { en: 'Send', bn: 'পাঠান' },
  'chat.placeholder': { en: 'Type a message...', bn: 'একটি বার্তা লিখুন...' },
  'chat.thinking': { en: 'Thinking...', bn: 'চিন্তা করছে...' },
  'file.new': { en: 'New File', bn: 'নতুন ফাইল' },
  'file.upload': { en: 'Upload', bn: 'আপলোড' },
  'file.save': { en: 'Save File', bn: 'ফাইল সংরক্ষণ' },
  'file.delete': { en: 'Delete File', bn: 'ফাইল মুছুন' },
  'workspace.new': { en: 'New Workspace', bn: 'নতুন ওয়ার্কস্পেস' },
  'workspace.delete': { en: 'Delete Workspace', bn: 'ওয়ার্কস্পেস মুছুন' },
  'agent.new': { en: 'New Agent', bn: 'নতুন এজেন্ট' },
  'agent.run': { en: 'Run Agent', bn: 'এজেন্ট চালান' },
  'epi.title': { en: 'Epidemiological Map', bn: 'মহামারীর মানচিত্র' },
  'epi.cases': { en: 'Cases', bn: 'মামলা' },
  'epi.severity': { en: 'Severity', bn: 'তীব্রতা' },
  'epi.status': { en: 'Status', bn: 'স্থিতি' },
  'surveillance.title': { en: 'Surveillance Dashboard', bn: 'নজরদারি ড্যাশবোর্ড' },
  'surveillance.cases': { en: 'Total Cases', bn: 'মোট মামলা' },
  'surveillance.outbreaks': { en: 'Active Outbreaks', bn: 'সক্রিয় প্রাদুর্ভাব' },
  'surveillance.diseases': { en: 'Diseases Tracked', bn: 'ট্র্যাক করা রোগ' },
  'surveillance.regions': { en: 'Regions', bn: 'অঞ্চল' },
  'outbreak.critical': { en: 'Critical Alert', bn: 'গুরুতর সতর্কতা' },
  'outbreak.high': { en: 'High Alert', bn: 'উচ্চ সতর্কতা' },
  'outbreak.medium': { en: 'Medium Alert', bn: 'মাঝারি সতর্কতা' },
  'outbreak.recommendation': { en: 'Recommendation', bn: 'সুপারিশ' },
  'collab.peers': { en: 'Collaborators', bn: 'সহযোগী' },
  'collab.editing': { en: 'is editing', bn: 'সম্পাদনা করছেন' },
  'sync.pending': { en: 'Pending sync', bn: 'অপেক্ষমাণ সিঙ্ক' },
  'sync.offline': { en: 'Offline', bn: 'অফলাইন' },
  'sync.online': { en: 'Online', bn: 'অনলাইন' },
  'sync.retry': { en: 'Retry', bn: 'পুনরায় চেষ্টা' },
  'icd.search': { en: 'Search ICD-11 codes...', bn: 'আইসিডি-১১ কোড অনুসন্ধান...' },
  'icf.search': { en: 'Search ICF codes...', bn: 'আইসিএফ কোড অনুসন্ধান...' },
  'ichi.search': { en: 'Search ICHI codes...', bn: 'আইসিএইচআই কোড অনুসন্ধান...' },
  'nlq.title': { en: 'Natural Language Query', bn: 'প্রাকৃতিক ভাষা প্রশ্ন' },
  'nlq.placeholder': { en: 'Ask about diseases, conditions, functioning...', bn: 'রোগ, অবস্থা, কার্যকারিতা সম্পর্কে জানুন...' },
  'report.title': { en: 'Report Generator', bn: 'রিপোর্ট জেনারেটর' },
  'report.generate': { en: 'Generate', bn: 'তৈরি করুন' },
  'report.export': { en: 'Export Report', bn: 'রিপোর্ট এক্সপোর্ট' },
  'template.select': { en: 'Select template...', bn: 'টেমপ্লেট নির্বাচন...' },
  'shortcuts.title': { en: 'Keyboard Shortcuts', bn: 'কীবোর্ড শর্টকাট' },
  'shortcuts.search': { en: 'Open search', bn: 'অনুসন্ধান খুলুন' },
  'shortcuts.send': { en: 'Send message', bn: 'বার্তা পাঠান' },
  'shortcuts.help': { en: 'Toggle help', bn: 'সাহায্য টগল' },
  'bd.divisions': { en: 'Divisions', bn: 'বিভাগ' },
  'bd.districts': { en: 'Districts', bn: 'জেলা' },
  'bd.upazilas': { en: 'Upazilas', bn: 'উপজেলা' },
  'bd.drugs': { en: 'Drug Registry', bn: 'ঔষধ নিবন্ধন' },
  'bd.geography': { en: 'Geography', bn: 'ভূগোল' },
};

export function setLocale(locale: SupportedLocale): void {
  currentLocale = locale;
  listeners.forEach((l) => l());
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function t(key: string, fallback?: string): string {
  return translations[key]?.[currentLocale] || translations[key]?.en || fallback || key;
}

export function onLocaleChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getSupportedLocales(): { code: SupportedLocale; name: string; nativeName: string }[] {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  ];
}
