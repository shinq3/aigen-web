import { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { useTranslation } from "react-i18next";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChatButton } from "@/components/ChatButton";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import News from "@/pages/News";
import LingaLink from "@/pages/LingaLink";
import Edumate from "@/pages/Edumate";
import OfficeBrain from "@/pages/OfficeBrain";
import EnterpriseLLM from "@/pages/EnterpriseLLM";
import AIGenOne from "@/pages/AIGenOne";
import AIProposal from "@/pages/AIProposal";
import AIPairCoding from "@/pages/AIPairCoding";
import Admin from "@/pages/Admin";
import NewsDetail from "@/pages/NewsDetail";
import ChatPage from "@/pages/ChatPage";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { extractLocaleFromPath, linkTo, useLocale } from "@/lib/i18n-utils";
import { defaultLocale, isValidLocale, type Locale } from "@shared/i18n";

function Router() {
  const [location] = useLocation();
  const { i18n } = useTranslation();
  
  // Extract locale and clean path from current location
  const { locale, cleanPath } = extractLocaleFromPath(location);
  
  // Update i18n language when locale changes in URL
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      {/* Redirects for routes without locale prefix - must be before /:locale routes */}
      <Route path="/admin">
        <Redirect to={linkTo('/admin', defaultLocale)} />
      </Route>
      
      <Route path="/products">
        <Redirect to={linkTo('/products', defaultLocale)} />
      </Route>
      
      <Route path="/products/lingalink">
        <Redirect to={linkTo('/products/lingalink', defaultLocale)} />
      </Route>
      
      <Route path="/products/edumate">
        <Redirect to={linkTo('/products/edumate', defaultLocale)} />
      </Route>
      
      <Route path="/products/officebrain">
        <Redirect to={linkTo('/products/officebrain', defaultLocale)} />
      </Route>
      
      <Route path="/products/enterprise-llm">
        <Redirect to={linkTo('/products/enterprise-llm', defaultLocale)} />
      </Route>
      
      <Route path="/products/aigen-one">
        <Redirect to={linkTo('/products/aigen-one', defaultLocale)} />
      </Route>
      
      <Route path="/products/bayd-system">
        <Redirect to={linkTo('/products/bayd-system', defaultLocale)} />
      </Route>
      
      <Route path="/about">
        <Redirect to={linkTo('/about', defaultLocale)} />
      </Route>
      
      <Route path="/contact">
        <Redirect to={linkTo('/contact', defaultLocale)} />
      </Route>
      
      <Route path="/news/:id">
        {(params) => (
          <Redirect to={linkTo(`/news/${params.id}`, defaultLocale)} />
        )}
      </Route>
      
      <Route path="/news">
        <Redirect to={linkTo('/news', defaultLocale)} />
      </Route>
      
      <Route path="/ai-proposal">
        <Redirect to={linkTo('/ai-proposal', defaultLocale)} />
      </Route>
      
      <Route path="/ai-pair-coding">
        <Redirect to={linkTo('/ai-pair-coding', defaultLocale)} />
      </Route>
      
      <Route path="/chat">
        <Redirect to={linkTo('/chat', defaultLocale)} />
      </Route>
      
      {/* Root redirect to default locale */}
      <Route path="/">
        <Redirect to={linkTo('/', defaultLocale)} />
      </Route>
      
      {/* Locale-prefixed routes */}
      <Route path="/:locale">
        {(params) => {
          const localeParam = params.locale;
          if (!isValidLocale(localeParam)) {
            return <NotFound />;
          }
          return <Home />;
        }}
      </Route>
      
      <Route path="/:locale/products">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <Products />;
        }}
      </Route>
      
      <Route path="/:locale/products/lingalink">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <LingaLink />;
        }}
      </Route>
      
      <Route path="/:locale/products/edumate">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <Edumate />;
        }}
      </Route>
      
      <Route path="/:locale/products/officebrain">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <OfficeBrain />;
        }}
      </Route>
      
      <Route path="/:locale/products/enterprise-llm">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <EnterpriseLLM />;
        }}
      </Route>

      <Route path="/:locale/products/aigen-one">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <AIGenOne />;
        }}
      </Route>
      
      <Route path="/:locale/about">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <About />;
        }}
      </Route>
      
      <Route path="/:locale/contact">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <Contact />;
        }}
      </Route>
      
      <Route path="/:locale/news/:id">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <NewsDetail />;
        }}
      </Route>
      
      <Route path="/:locale/news">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <News />;
        }}
      </Route>
      
      <Route path="/:locale/ai-proposal">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <AIProposal />;
        }}
      </Route>
      
      <Route path="/:locale/ai-pair-coding">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <AIPairCoding />;
        }}
      </Route>
      
      <Route path="/:locale/admin">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <Admin />;
        }}
      </Route>
      
      <Route path="/:locale/chat">
        {(params) => {
          if (!isValidLocale(params.locale)) return <NotFound />;
          return <ChatPage />;
        }}
      </Route>
      
      {/* Catch-all for invalid routes */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { t, i18n } = useTranslation('footer');
  const { locale } = useLocale();
  const [location] = useLocation();
  
  const { locale: urlLocale } = extractLocaleFromPath(location);
  
  useEffect(() => {
    if (urlLocale && i18n.language !== urlLocale) {
      i18n.changeLanguage(urlLocale);
    }
  }, [urlLocale, i18n]);
  
  const isChatPage = location.includes('/chat');
  
  // TODO: remove mock functionality - replace with real data from CMS
  const footerLinks = [
    {
      title: t('sections.products'),
      items: [
        { name: "LingaLink", href: linkTo("/products/lingalink", locale) },
        { name: "EduMate", href: linkTo("/products/edumate", locale) },
        { name: "OfficeBrain", href: linkTo("/products/officebrain", locale) },
        { name: "Enterprise LLM", href: linkTo("/products/enterprise-llm", locale) },
        { name: "AiGen-One", href: linkTo("/products/aigen-one", locale) },
        { name: "Bayd-System", href: linkTo("/products/bayd-system", locale) }
      ]
    },
    {
      title: t('sections.company'),
      items: [
        { name: t('links.about'), href: linkTo("/about", locale) },
        { name: t('links.news'), href: linkTo("/news", locale) },
        { name: t('links.careers'), href: linkTo("/careers", locale) },
        { name: t('links.contact'), href: linkTo("/contact", locale) }
      ]
    }
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/dachy-studio", icon: <Github className="w-4 h-4" /> },
    { name: "Twitter", href: "https://twitter.com/dachy_studio", icon: <Twitter className="w-4 h-4" /> },
    { name: "LinkedIn", href: "https://linkedin.com/company/dachy-studio", icon: <Linkedin className="w-4 h-4" /> },
    { name: "Email", href: "mailto:contact@dachy.studio", icon: <Mail className="w-4 h-4" /> }
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light">
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {isChatPage ? <Home /> : <Router />}
            </main>
            <Footer
              company={t('company.name')}
              address={t('company.address')}
              links={footerLinks}
              social={socialLinks}
            />
          </div>
          {isChatPage && <ChatPage />}
          {!isChatPage && <ChatButton />}
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
