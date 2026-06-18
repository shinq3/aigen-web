import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ExternalLink } from "lucide-react";
import AIGenOne from "@/pages/AIGenOne";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { localeNames, locales, type Locale } from "@shared/i18n";
import { useLocale } from "@/lib/i18n-utils";

const demoUrl = "https://youtu.be/QnKgrSrNcmo";
const mainSiteUrl = "https://d-auchy.studio";

function AigenHeader() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const contactUrl = `${mainSiteUrl}/${locale}/contact`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <a href={`/${locale}`} className="flex min-w-0 items-center gap-3" aria-label="AiGen-One">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">
            A1
          </span>
          <span className="min-w-0">
            <span className="block text-base font-bold leading-tight text-slate-950">AiGen-One</span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">AI Business Portal</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#pricing" className="hover:text-slate-950">Pricing</a>
          <a href={demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-slate-950">
            Demo
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-md border border-slate-200 p-1 sm:flex">
            {locales.map((item) => (
              <a
                key={item}
                href={`/${item}`}
                aria-label={localeNames[item]}
                className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
                  locale === item
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.toUpperCase()}
              </a>
            ))}
          </div>
          <Button className="hidden bg-primary text-white hover:bg-primary/90 sm:inline-flex" asChild>
            <a href={contactUrl}>
              {t("hero.buttons.contact")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function AigenFooter() {
  const { locale } = useLocale();
  const contactUrl = `${mainSiteUrl}/${locale}/contact`;

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold">AiGen-One</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            AI業務を作り、配り、運用するためのAI業務ポータル。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href={contactUrl} className="font-semibold text-white hover:text-orange-200">
            Contact
          </a>
          <a href={mainSiteUrl} className="text-slate-400 hover:text-white">
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
      <div className="min-h-screen bg-background text-foreground">
        <AigenHeader />
        <main>
          <AIGenOne />
        </main>
        <AigenFooter />
      </div>
    </ThemeProvider>
  );
}
