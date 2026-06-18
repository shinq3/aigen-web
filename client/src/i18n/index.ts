import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { defaultLocale, locales } from '@shared/i18n';

// Import translation resources
import jaCommon from './locales/ja/common.json';
import jaHeader from './locales/ja/header.json';
import jaFooter from './locales/ja/footer.json';
import jaHome from './locales/ja/pages/home.json';
import jaAbout from './locales/ja/pages/about.json';
import jaProducts from './locales/ja/pages/products.json';
import jaContact from './locales/ja/pages/contact.json';
import jaNews from './locales/ja/pages/news.json';
import jaLingaLink from './locales/ja/products/lingalink.json';
import jaEdumate from './locales/ja/products/edumate.json';
import jaOfficeBrain from './locales/ja/products/officebrain.json';
import jaEnterpriseLLM from './locales/ja/products/enterprise-llm.json';
import jaBaydSystem from './locales/ja/products/bayd-system.json';
import jaAigenOne from './locales/ja/products/aigen-one.json';
import jaAdmin from './locales/ja/admin.json';
import jaAIProposal from './locales/ja/pages/ai-proposal.json';
import jaAIPairCoding from './locales/ja/pages/ai-pair-coding.json';

import enCommon from './locales/en/common.json';
import enHeader from './locales/en/header.json';
import enFooter from './locales/en/footer.json';
import enHome from './locales/en/pages/home.json';
import enAbout from './locales/en/pages/about.json';
import enProducts from './locales/en/pages/products.json';
import enContact from './locales/en/pages/contact.json';
import enNews from './locales/en/pages/news.json';
import enLingaLink from './locales/en/products/lingalink.json';
import enEdumate from './locales/en/products/edumate.json';
import enOfficeBrain from './locales/en/products/officebrain.json';
import enEnterpriseLLM from './locales/en/products/enterprise-llm.json';
import enBaydSystem from './locales/en/products/bayd-system.json';
import enAigenOne from './locales/en/products/aigen-one.json';
import enAdmin from './locales/en/admin.json';
import enAIProposal from './locales/en/pages/ai-proposal.json';
import enAIPairCoding from './locales/en/pages/ai-pair-coding.json';

import viCommon from './locales/vi/common.json';
import viHeader from './locales/vi/header.json';
import viFooter from './locales/vi/footer.json';
import viHome from './locales/vi/pages/home.json';
import viAbout from './locales/vi/pages/about.json';
import viProducts from './locales/vi/pages/products.json';
import viContact from './locales/vi/pages/contact.json';
import viNews from './locales/vi/pages/news.json';
import viLingaLink from './locales/vi/products/lingalink.json';
import viEdumate from './locales/vi/products/edumate.json';
import viOfficeBrain from './locales/vi/products/officebrain.json';
import viEnterpriseLLM from './locales/vi/products/enterprise-llm.json';
import viBaydSystem from './locales/vi/products/bayd-system.json';
import viAigenOne from './locales/vi/products/aigen-one.json';
import viAdmin from './locales/vi/admin.json';
import viAIProposal from './locales/vi/pages/ai-proposal.json';
import viAIPairCoding from './locales/vi/pages/ai-pair-coding.json';

const resources = {
  ja: {
    common: jaCommon,
    header: jaHeader,
    footer: jaFooter,
    home: jaHome,
    about: jaAbout,
    products: jaProducts,
    contact: jaContact,
    news: jaNews,
    lingalink: jaLingaLink,
    edumate: jaEdumate,
    officebrain: jaOfficeBrain,
    'enterprise-llm': jaEnterpriseLLM,
    'bayd-system': jaBaydSystem,
    'aigen-one': jaAigenOne,
    admin: jaAdmin,
    'ai-proposal': jaAIProposal,
    'ai-pair-coding': jaAIPairCoding,
  },
  en: {
    common: enCommon,
    header: enHeader,
    footer: enFooter,
    home: enHome,
    about: enAbout,
    products: enProducts,
    contact: enContact,
    news: enNews,
    lingalink: enLingaLink,
    edumate: enEdumate,
    officebrain: enOfficeBrain,
    'enterprise-llm': enEnterpriseLLM,
    'bayd-system': enBaydSystem,
    'aigen-one': enAigenOne,
    admin: enAdmin,
    'ai-proposal': enAIProposal,
    'ai-pair-coding': enAIPairCoding,
  },
  vi: {
    common: viCommon,
    header: viHeader,
    footer: viFooter,
    home: viHome,
    about: viAbout,
    products: viProducts,
    contact: viContact,
    news: viNews,
    lingalink: viLingaLink,
    edumate: viEdumate,
    officebrain: viOfficeBrain,
    'enterprise-llm': viEnterpriseLLM,
    'bayd-system': viBaydSystem,
    'aigen-one': viAigenOne,
    admin: viAdmin,
    'ai-proposal': viAIProposal,
    'ai-pair-coding': viAIPairCoding,
  },
};

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    
    // Language detection configuration
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'header', 'footer', 'home', 'about', 'products', 'contact', 'news', 'lingalink', 'edumate', 'officebrain', 'enterprise-llm', 'bayd-system', 'aigen-one', 'admin', 'ai-proposal', 'ai-pair-coding'],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    debug: import.meta.env.MODE === 'development',
  });

export default i18n;