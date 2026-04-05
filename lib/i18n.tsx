import React, { createContext, useContext, useState } from "react";

const STRINGS: Record<string, Record<"en" | "hy", string>> = {
  appTitle: { en: "ArmApply", hy: "ArmApply" },
  login: { en: "Log in", hy: "Մուտք" },
  register: { en: "Create account", hy: "Գրանցվել" },
  email: { en: "Email", hy: "Էլ. փոստ" },
  password: { en: "Password", hy: "Գաղտնաբառ" },
  feed: { en: "Job feed", hy: "Աշխատանքներ" },
  applications: { en: "My applications", hy: "Իմ դիմումները" },
  settings: { en: "Settings", hy: "Կարգավորումներ" },
  appearance: { en: "Appearance", hy: "Արտաքին տեսք" },
  themePref: { en: "Theme Preference", hy: "Գունային թեմա" },
  themeDesc: { en: "Currently", hy: "Ներկայիս" },
  langUi: { en: "Language (UI)", hy: "Լեզու (Միջերես)" },
  langDesc: { en: "English / Հայերեն", hy: "English / Հայերեն" },
  pipelineSec: { en: "Pipeline & Automation", hy: "Ավտոմատացում" },
  manualTriggers: { en: "Manual Triggers", hy: "Ձեռքով Գործարկում" },
  keywords: { en: "Keywords (comma-separated)", hy: "Բանալի բառեր (ստորակետերով բաժանված)" },
  discover: { en: "Discover Jobs", hy: "Որոնել" },
  scoreMatch: { en: "Score Match", hy: "Գնահատել համապատասխանությունը" },
  notifications: { en: "Notifications", hy: "Ծանուցումներ" },
  telegramBot: { en: "Telegram Bot", hy: "Տելեգրամ բոտ" },
  telegramDesc: { en: "Get alerts for new job matches via @userinfobot", hy: "Ստանալ նոր աշխատանքների ծանուցումներ @userinfobot-ով" },
  saveTelegram: { en: "Save Telegram ID", hy: "Պահպանել Տելեգրամի կոդը" },
  safety: { en: "Safety & AI Settings", hy: "Անվտանգություն և ԱԲ կարգավորումներ" },
  alwaysDry: { en: "Always Dry-Run", hy: "Միշտ Փորձնական" },
  neverApply: { en: "Never apply automatically", hy: "Երբեք ինքնաբերաբար չդիմել" },
  dailyAuto: { en: "Daily Autopilot Bot", hy: "Ամենօրյա բոտ" },
  runPipeline: { en: "Run pipeline automatically", hy: "Աշխատեցնել ավտոմատ" },
  resCovLang: { en: "Resume / Cover Language", hy: "Ռեզյումեի և նամակի լեզու" },
  genBoth: { en: "Generate in both EN / HY", hy: "Գեներացնել EN/HY տարբերակներով" },
  logout: { en: "Log Out", hy: "Ելք" },
  profile: { en: "Profile", hy: "Անձնագիր" },
  apply: { en: "Apply now", hy: "Դիմել հիմա" },
  dryRun: { en: "Dry run (safe)", hy: "Փորձարկում (անվտանգ)" },
  language: { en: "Language", hy: "Լեզու" },
  success: { en: "Success", hy: "Հաջողությամբ" },
  error: { en: "Error", hy: "Սխալ" },
  home: { en: "Home", hy: "Գլխավոր" },
  jobs: { en: "Jobs", hy: "Աշխատանքներ" },

  // Dashboard
  jobSeeker: { en: "Job Seeker", hy: "Աշխատանք փնտրող" },
  hello: { en: "Hello", hy: "Ողջույն" },
  findNextRole: { en: "Let's find your next role", hy: "Եկեք գտնենք Ձեր հաջորդ աշխատանքը" },
  activeAutopilot: { en: "Active Autopilot", hy: "Ակտիվ Ավտոպիլոտ" },
  autopilot: { en: "Autopilot", hy: "Ավտոպիլոտ" },
  tailoringActive: { en: "AI Discovery & Tailoring Active", hy: "ԱԲ որոնումը և համապատասխանեցումը ակտիվ են" },
  automationPaused: { en: "Automation paused", hy: "Ավտոմատացումը կանգնեցված է" },
  discovered: { en: "Discovered", hy: "Գտնված" },
  aiTailored: { en: "AI Tailored", hy: "ԱԲ-ով մշակված" },
  applied: { en: "Applied", hy: "Դիմված" },
  pipelineActivity: { en: "Pipeline Activity", hy: "Գործընթացների պատմություն" },
  noRecentActivity: { en: "No recent activity logged.", hy: "Վերջին գործողություններ չկան:" },

  // Feed
  jobFeed: { en: "Job Feed", hy: "Աշխատանքներ" },
  findNextVenture: { en: "Find your next venture", hy: "Գտեք Ձեր հաջորդ նախագիծը" },
  searchPlaceholder: { en: "Search roles or companies", hy: "Փնտրել հաստիք կամ ընկերություն" },
  comingSoon: { en: "Coming Soon", hy: "Շուտով" },
  comingSoonDesc: { en: "Advanced filters (salary, date) will be available in the next update.", hy: "Ընդլայնված ֆիլտրերը (աշխատավարձ, ամսաթիվ) հասանելի կլինեն հաջորդ թարմացման մեջ:" },
  allJobs: { en: "All Jobs", hy: "Բոլորը" },
  highMatch: { en: "High Match", hy: "Լավագույնները" },
  inYerevan: { en: "In Yerevan", hy: "Երևանում" },
  discoveryFinished: { en: "Bot finished searching in Armenia.", hy: "Բոտն ավարտեց որոնումը Հայաստանում:" },
  discoveryFailed: { en: "Discovery bot failed to start.", hy: "Որոնողական բոտը չհաջողվեց գործարկել:" },
  noJobsFound: { en: "No jobs found", hy: "Աշխատանք չի գտնվել" },
  feedEmptyTitleSearch: { en: "No matches found", hy: "Համապատասխանություն չկա" },
  feedEmptyTitleDefault: { en: "Your feed is warming up", hy: "Ձեր լրահոսը պատրաստվում է" },
  feedEmptyDescSearch: { en: "Try a different search term or check your spelling.", hy: "Փորձեք այլ որոնման բառ կամ ստուգեք ուղղագրությունը:" },
  feedEmptyDescDefault: { en: "Run the AI discovery bot to automate hunting new roles exactly tailored for you.", hy: "Գործարկեք ԱԲ-ն՝ Ձեզ համար հատուկ ընտրված հաստիքներ գտնելու համար:" },
  feedEmptyHint: { en: "Tap the lightning icon above to start AI Discovery.", hy: "Սեղմեք վերևի կայծակի նշանը՝ ԱԲ-ն գործարկելու համար:" },

  // Profile
  personalProfile: { en: "Personal Profile", hy: "Անձնական էջ" },
  cvResume: { en: "CV / Resume", hy: "Ռեզյումե" },
  pdfActive: { en: "PDF Active", hy: "PDF-ը կցված է" },
  noFileUploaded: { en: "No file uploaded", hy: "Ֆայլ կցված չէ" },
  replace: { en: "Replace", hy: "Փոխել" },
  upload: { en: "Upload", hy: "Կցել" },
  autoFillAI: { en: "Auto-Fill Profile with AI", hy: "Լրացնել ԱԲ-ի օգնությամբ" },
  cvUpdated: { en: "CV file updated.", hy: "Ռեզյումեն թարմացվեց:" },
  extractionFailed: { en: "Extraction Failed", hy: "Տվյալների դուրսբերումը ձախողվեց" },
  extractionFailedDesc: { en: "AI could not find readable text in the file. Make sure your PDF is text-based and not a scanned image.", hy: "ԱԲ-ն չկարողացավ կարդալ տեքստը: Համոզվեք, որ PDF-ը տեքստային է, այլ ոչ թե սկանավորված նկար:" },
  profileUpdatedAI: { en: "Profile updated with AI extraction results.", hy: "Պրոֆիլը թարմացվեց ԱԲ-ի տվյալներով:" },
  personalInfo: { en: "Personal Information", hy: "Անձնական տվյալներ" },
  fullName: { en: "Full Name", hy: "Անուն Ազգանուն" },
  profRole: { en: "Professional Role", hy: "Մասնագիտացում" },
  emailAddress: { en: "Email Address", hy: "Էլ. փոստ" },
  phoneNumber: { en: "Phone Number", hy: "Հեռախոսահամար" },
  languages: { en: "Languages", hy: "Լեզուներ" },
  bioSocials: { en: "Bio & Socials", hy: "Կենսագրություն և սոց. հղումներ" },
  shortBio: { en: "Short Bio", hy: "Հակիրճ կենսագրություն" },
  githubUrl: { en: "GitHub URL", hy: "GitHub հղում" },
  linkedinUrl: { en: "LinkedIn URL", hy: "LinkedIn հղում" },
  profExperience: { en: "Professional Experience", hy: "Մասնագիտական փորձ" },
  skills: { en: "Skills (comma separated)", hy: "Հմտություններ (ստորակետով բաժանված)" },
  workExpSum: { en: "Work Experience Summary", hy: "Աշխատանքային փորձի հակիրճ նկարագիր" },
  education: { en: "Education", hy: "Կրթություն" },
  portfolioLinks: { en: "Portfolio / Other Links", hy: "Պորտֆոլիո / Այլ հղումներ" },
  searchPrefs: { en: "Search Preferences", hy: "Որոնման նախապատվություններ" },
  targetRoles: { en: "Target Roles (comma separated)", hy: "Ցանկալի հաստիքներ (ստորակետով բաժանված)" },
  targetLocation: { en: "Target Location", hy: "Ցանկալի վայր" },
  unsetRole: { en: "Unset Role", hy: "Մասնագիտությունը նշված չէ" },
  completeProfile: { en: "Complete your profile", hy: "Լրացրեք Ձեր պրոֆիլը" },

  // Notifications & Bot Activity
  botActivity: { en: "Bot Activity", hy: "Բոտի ակտիվություն" },
  clear: { en: "Clear", hy: "Մաքրել" },
  allCaughtUp: { en: "All caught up!", hy: "Ամեն ինչ դիտված է" },
  noBotSignals: { en: "No active bot signals right now. Run discovery to see new updates here.", hy: "Այս պահին ակտիվ ազդանշաններ չկան: Գործարկեք որոնումը՝ թարմացումներ ստանալու համար:" },
  sysUpdate: { en: "System Update", hy: "Համակարգային թարմացում" },
  botCompletedTask: { en: "Bot completed a background task.", hy: "Բոտն ավարտեց ֆոնային առաջադրանքը:" },
  discScanDone: { en: "Discovery Scan Completed", hy: "Որոնումն ավարտվեց" },
  checkedRolesArmenia: { en: "Checked for new IT roles in Armenia.", hy: "Ստուգվել են նոր ՏՏ հաստիքները Հայաստանում:" },
  newJobsDiscovered: { en: "New Jobs Discovered!", hy: "Գտնվել են նոր աշխատանքներ:" },
  botFoundN: { en: "The bot found %n% new positions matching your criteria.", hy: "Բոտը գտել է %n% նոր հաստիք Ձեր պահանջներին համապատասխան:" },
  aiScoringDone: { en: "AI Scoring Finished", hy: "ԱԲ գնահատումն ավարտվեց" },
  evalScoredN: { en: "Evaluated and scored %n% new roles against your CV.", hy: "Գնահատվել է %n% նոր հաստիք Ձեր ռեզյումեի հիման վրա:" },
  applySubmitted: { en: "Application Auto-Submitted", hy: "Հայտը ավտոմատ ուղարկվեց" },
  applySuccessBody: { en: "The AI successfully submitted your application.", hy: "ԱԲ-ն հաջողությամբ ուղարկեց Ձեր հայտը:" },
};

export type Locale = "en" | "hy";

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = (l: Locale) => {
    setLocaleState(l);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    let str = STRINGS[key as keyof typeof STRINGS]?.[locale] ?? STRINGS[key as keyof typeof STRINGS]?.en ?? key;
    if (params) {
      Object.keys(params).forEach(p => {
        str = str.replace(`%${p}%`, String(params[p]));
      });
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
