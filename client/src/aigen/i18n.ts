import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ICU from "i18next-icu";
import { defaultLocale, locales } from "@shared/i18n";

import jaAigenOne from "@/i18n/locales/ja/products/aigen-one.json";
import enAigenOne from "@/i18n/locales/en/products/aigen-one.json";
import viAigenOne from "@/i18n/locales/vi/products/aigen-one.json";

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: { "aigen-one": jaAigenOne },
      en: { "aigen-one": enAigenOne },
      vi: { "aigen-one": viAigenOne },
    },
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    detection: {
      order: ["path", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["localStorage"],
    },
    defaultNS: "aigen-one",
    ns: ["aigen-one"],
    interpolation: {
      escapeValue: false,
    },
    debug: import.meta.env.MODE === "development",
  });

export default i18n;
