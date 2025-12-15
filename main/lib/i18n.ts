import { Language } from '../types';

export const LANGUAGES: Language[] = [
  { id: 'en', label: 'English (System)', code: 'en-US' },
  { id: 'es', label: 'Español (Spanish)', code: 'es-ES' },
  { id: 'fr', label: 'Français (French)', code: 'fr-FR' },
  { id: 'de', label: 'Deutsch (German)', code: 'de-DE' },
  { id: 'jp', label: '日本語 (Japanese)', code: 'ja-JP' },
  { id: 'ko', label: '한국어 (Korean)', code: 'ko-KR' },
  { id: 'cn', label: '中文 (Chinese)', code: 'zh-CN' },
  { id: 'ru', label: 'Русский (Russian)', code: 'ru-RU' },
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Navigation & Modules
    dashboard: 'Dashboard',
    aiChat: 'Neural Link',
    analytics: 'Analytics',
    gradebook: 'Gradebook',
    timeline: 'Timeline',
    scheduler: 'Scheduler',
    strategicMap: 'Strategic Map',
    tasks: 'Directives',
    habits: 'Protocols',
    focusLab: 'Focus Lab',
    bioSync: 'Bio-Sync',
    quiz: 'Simulations',
    journal: 'Captain\'s Log',
    codeLab: 'Code Lab',
    vault: 'Neural Vault',
    library: 'Data Library',
    canvas: 'Canvas',
    themeStudio: 'Theme Forge',
    neuralCards: 'Flashcards',
    toolkit: 'Toolkit',
    social: 'Uplink',
    leaderboard: 'Rankings',
    marketplace: 'Supply Depot',
    records: 'Achievements',
    resume: 'Legacy',
    system: 'Core Settings',
    profile: 'Operative Profile',
    projects: 'Command Deck',
    goals: 'Strategic Map',
    news: 'Global Uplink',
    resources: 'Resources',
    
    // Auth & Boot
    secureAccess: 'Secure Access Terminal',
    initializing: 'Initializing Session...',
    login: 'Initialize Session',
    signup: 'New Operative',
    forgotPass: 'Lost Access?',
    recover: 'Recover Identity',
    email: 'Identity (Email)',
    password: 'Passcode',
    confirmPass: 'Confirm Passcode',
    welcomeBack: 'Welcome Back, Operative',
    registerComplete: 'Registration complete! Check email to confirm.',
    authError: 'Authentication Failed',
    
    // Profile & Identity
    codename: 'Codename',
    realName: 'Real Name',
    surname: 'Surname',
    biometrics: 'Biometrics & Identity',
    psychProfile: 'Psych Profile (Bio)',
    interestMatrix: 'Interest Matrix',
    netConnections: 'Net Connections',
    editProtocol: 'Edit Protocol',
    saveChanges: 'Save Changes',
    level: 'Level',
    xp: 'XP',
    
    // Actions & UI
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Initialize',
    add: 'Add',
    close: 'Close',
    loading: 'Processing...',
    success: 'Operation Successful',
    error: 'System Error',
    importData: 'System Restore',
    exportData: 'Export Data',
    terminate: 'Terminate Session',
    typeMessage: 'Enter command or query...',
    
    // Module Specific
    flowState: 'Flow State Engaged',
    systemIdle: 'System Idle',
    pomodoro: 'Pomodoro Sequence',
    deepWork: 'Deep Work Cycle',
    abort: 'ABORT',
    initialize: 'INITIALIZE',
    sonicEnv: 'Sonic Environment',
    visualizer: 'Visualizer Active',
    enableVis: 'Enable Visualizer',
    
    // Notifications
    levelUp: 'LEVEL UP! RANK INCREASED',
    itemAcquired: 'Item Acquired',
    insufficientFunds: 'Insufficient Credits',
    dataSaved: 'Data Node Encrypted',
    citationAdded: 'Source Indexed',
    questComplete: 'Objective Complete',
    directiveInit: 'Directive Initialized',
  },
  // Fallbacks for other languages
  es: { dashboard: 'Tablero' },
  fr: { dashboard: 'Tableau de bord' },
  de: { dashboard: 'Instrumententafel' },
  jp: { dashboard: 'ダッシュボード' },
  ko: { dashboard: '대시보드' },
  cn: { dashboard: '仪表板' },
  ru: { dashboard: 'Приборная панель' },
};

export const useTranslation = (langId: string) => {
  const t = (key: string) => {
    const lang = TRANSLATIONS[langId] || TRANSLATIONS['en'];
    return lang[key] || TRANSLATIONS['en'][key] || key;
  };
  return { t };
};