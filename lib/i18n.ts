const STRINGS: Record<string, Record<"en" | "hy", string>> = {
  appTitle: { en: "ArmApply", hy: "ArmApply" },
  login: { en: "Log in", hy: "Մուտք" },
  register: { en: "Create account", hy: "Գրանցվել" },
  email: { en: "Email", hy: "Էլ. փոստ" },
  password: { en: "Password", hy: "Գաղտնաբառ" },
  feed: { en: "Job feed", hy: "Աշխատանքներ" },
  applications: { en: "My applications", hy: "Իմ դիմումները" },
  settings: { en: "Settings", hy: "Կարգավորումներ" },
  profile: { en: "Profile", hy: "Անձնագիր" },
  apply: { en: "Apply now", hy: "Դիմել հիմա" },
  dryRun: { en: "Dry run (safe)", hy: "Փորձարկում (անվտանգ)" },
  language: { en: "Language", hy: "Լեզու" },
};

export type Locale = "en" | "hy";

let locale: Locale = "en";

export function setLocale(l: Locale) {
  locale = l;
}

export function t(key: keyof typeof STRINGS): string {
  return STRINGS[key]?.[locale] ?? STRINGS[key]?.en ?? key;
}
