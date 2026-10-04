import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Menu, X } from "lucide-react";
import AIGenOne from "@/pages/AIGenOne";
import { ThemeProvider } from "@/components/ThemeProvider";
import { localeNames, locales, type Locale } from "@shared/i18n";
import { useLocale } from "@/lib/i18n-utils";
const AdvisorChat = lazy(() => import("./AdvisorChat"));

function AigenHeader() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const contact = `https://www.aigen.tokyo/contact/?lang=${locale}`;
  const links = [
    { hash: "platform", label: t("nav.platform") },
    { hash: "movies", label: t("nav.demo") },
    { hash: "practice", label: t("nav.practice") },
    { hash: "fde", label: t("nav.fde") },
    { hash: "pricing", label: t("nav.pricing") },
  ];
  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);
  return (
    <header className="aigen-site-header">
      <div className="aigen-header-inner">
        <a href={`/${locale}`} className="aigen-logo" aria-label="AiGen-One">
          AiGen<span>-</span>One.
        </a>
        <nav
          className="aigen-nav"
          aria-label={
            locale === "ja" ? "メインナビゲーション" : "Main navigation"
          }
        >
          {links.map((link) => (
            <a key={link.hash} href={`#${link.hash}`}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="aigen-header-actions">
          <div className="aigen-languages">
            {locales.map((item) => (
              <a
                key={item}
                href={`/${item}`}
                aria-label={localeNames[item]}
                aria-current={locale === item ? "page" : undefined}
              >
                {item.toUpperCase()}
              </a>
            ))}
          </div>
          <a className="aigen-header-cta" href={contact}>
            {t("hero.primaryCta")}
          </a>
          <button
            className="mobile-nav-toggle"
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.menu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          className="mobile-nav"
          id="mobile-nav"
          aria-label={
            locale === "ja" ? "モバイルナビゲーション" : "Mobile navigation"
          }
        >
          {links.map((link) => (
            <a
              key={link.hash}
              href={`#${link.hash}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a className="mobile-contact" href={contact}>
            {t("hero.primaryCta")} <ArrowUpRight size={14} className="inline" />
          </a>
        </nav>
      )}
    </header>
  );
}
function AigenFooter() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  return (
    <footer className="aigen-site-footer">
      <div className="aigen-wrap aigen-footer-inner">
        <div>
          <a href={`/${locale}`} className="aigen-logo">
            AiGen-One.
          </a>
          <p>{t("footer.description")}</p>
        </div>
        <nav>
          <a href={`https://www.aigen.tokyo/contact/?lang=${locale}`}>
            Contact <ArrowUpRight size={12} className="inline" />
          </a>
          <a href="https://d-auchy.studio" target="_blank" rel="noreferrer">
            D’auchy.Studio <ArrowUpRight size={12} className="inline" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
export default function AigenApp() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const pathLocale = window.location.pathname
      .split("/")
      .filter(Boolean)[0] as Locale | undefined;
    if (
      pathLocale &&
      locales.includes(pathLocale) &&
      i18n.language !== pathLocale
    )
      i18n.changeLanguage(pathLocale);
  }, [i18n]);
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [i18n.language]);
  return (
    <ThemeProvider defaultTheme="light">
      <div
        className="min-h-screen bg-background text-foreground"
        style={{ fontFamily: '"Noto Sans JP", Inter, sans-serif' }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:p-3"
        >
          {i18n.language === "ja"
            ? "本文へ移動"
            : i18n.language === "vi"
              ? "Đi đến nội dung"
              : "Skip to content"}
        </a>
        <AigenHeader />
        <main id="main-content">
          <AIGenOne />
        </main>
        <AigenFooter />
        <Suspense fallback={null}>
          <AdvisorChat />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}
