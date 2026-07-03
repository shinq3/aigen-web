import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ExternalLink } from "lucide-react";
import AIGenOne from "@/pages/AIGenOne";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { localeNames, locales, type Locale } from "@shared/i18n";
import { useLocale } from "@/lib/i18n-utils";
import AdvisorChat from "./AdvisorChat";

const demoUrl = "https://youtu.be/QnKgrSrNcmo";
const mainSiteUrl = "https://d-auchy.studio";

function AigenHeader() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const contactUrl = `${mainSiteUrl}/${locale}/contact`;

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(11,18,32,.08)] bg-[rgba(238,242,248,.85)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <a href={`/${locale}`} className="flex min-w-0 items-center font-display text-lg font-bold tracking-[-0.02em] text-[#0B1220]" aria-label="AiGen-One">
          AiGen<span className="text-[#2D6BFF]">-</span>One
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#41506b] md:flex">
          <a href="#fde" className="hover:text-[#0B1220]">{t("nav.fde")}</a>
          <a href="#platform" className="hover:text-[#0B1220]">{t("nav.platform")}</a>
          <a href="#pricing" className="hover:text-[#0B1220]">{t("nav.pricing")}</a>
          <a href={demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[#0B1220]">
            {t("nav.demo")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[rgba(11,18,32,.1)] p-1">
            {locales.map((item) => (
              <a
                key={item}
                href={`/${item}`}
                aria-label={localeNames[item]}
                className={`rounded px-1.5 py-1 text-[11px] font-semibold transition-colors sm:px-2 sm:text-xs ${
                  locale === item
                    ? "bg-[#060A16] text-white"
                    : "text-[#41506b] hover:bg-black/5 hover:text-[#0B1220]"
                }`}
              >
                {item.toUpperCase()}
              </a>
            ))}
          </div>
          <Button className="hidden rounded-lg bg-[#060A16] text-[#EAF2FF] hover:bg-[#060A16]/90 sm:inline-flex" asChild>
            <a href={contactUrl}>
              {t("hero.primaryCta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function AigenFooter() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const contactUrl = `${mainSiteUrl}/${locale}/contact`;

  return (
    <footer className="border-t border-[rgba(234,242,255,.15)] bg-[#060A16] text-[#EAF2FF]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold">AiGen-One</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#7488a8]">
            {t("footer.description")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href={contactUrl} className="font-semibold text-[#EAF2FF] hover:text-[#34E1FF]">
            Contact
          </a>
          <a href={mainSiteUrl} className="text-[#7488a8] hover:text-[#EAF2FF]">
            D&apos;auchy.Studio
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function AigenApp() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const pathLocale = window.location.pathname.split("/").filter(Boolean)[0] as Locale | undefined;
    if (pathLocale && locales.includes(pathLocale) && i18n.language !== pathLocale) {
      i18n.changeLanguage(pathLocale);
    }
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: '"Noto Sans JP", Inter, sans-serif' }}>
        <AigenHeader />
        <main>
          <AIGenOne />
        </main>
        <AigenFooter />
        <AdvisorChat />
      </div>
    </ThemeProvider>
  );
}
