import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  GitPullRequest,
  LayoutDashboard,
  MessageSquare,
  Play,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/lib/i18n-utils";
import dashboardImage from "../../../images/dashboard.jpg";
import officeImage from "@assets/generated_images/AIGenOne_FDE_workshop_v2.jpg";
import builderImage from "@assets/generated_images/AIGenOne_builder_chat_actual.jpg";
import teamImage from "@assets/generated_images/AIGenOne_FDE_field_discovery_v2.jpg";
import aiChatImage from "../../../images/AI_chat.png";
import skillsImage from "../../../images/skills.png";
import agentsImage from "../../../images/agent.png";
import businessMenuImage from "../../../images/bussiness_menu.png";
import shortOneImage from "../../../images/shorts/short-1.jpg";
import shortTwoImage from "../../../images/shorts/short-2.jpg";
import shortThreeImage from "../../../images/shorts/short-3.jpg";
import shortFourImage from "../../../images/shorts/short-4.jpg";
import shortFiveImage from "../../../images/shorts/short-5.jpg";
import shortSixImage from "../../../images/shorts/short-6.jpg";
import "./aigen-experience.css";

const movies = [
  { id: "FRvYDCeY4sc", thumbnail: shortOneImage, short: true },
  { id: "crTaPI7aDSs", thumbnail: shortTwoImage, short: true },
  { id: "s6rt-ZhfYBo", thumbnail: shortThreeImage, short: true },
  { id: "NF4y8nVA6Cs", thumbnail: shortFourImage, short: true },
  { id: "oB5WKp0E4jw", thumbnail: shortFiveImage, short: true },
  { id: "VPtGVQ6d1FM", thumbnail: shortSixImage, short: true },
  {
    id: "QnKgrSrNcmo",
    thumbnail: "https://i.ytimg.com/vi/QnKgrSrNcmo/hqdefault.jpg",
    short: false,
  },
];
const icons = [LayoutDashboard, MessageSquare, Sparkles, Workflow, AppWindow];
const featureScreens = [
  dashboardImage,
  aiChatImage,
  skillsImage,
  agentsImage,
  businessMenuImage,
];
const screenDimensions: Record<string, { width: number; height: number }> = {
  [dashboardImage]: { width: 1667, height: 1038 },
  [builderImage]: { width: 981, height: 854 },
  [aiChatImage]: { width: 1526, height: 900 },
  [skillsImage]: { width: 1777, height: 974 },
  [agentsImage]: { width: 982, height: 967 },
  [businessMenuImage]: { width: 1364, height: 1023 },
};
type Item = {
  title: string;
  description: string;
  label?: string;
  name?: string;
  target?: string;
  features?: string;
  price?: string;
};

const entranceEase = [0.22, 1, 0.36, 1] as const;
const revealViewport = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -48px 0px",
} as const;

function entrance(reduced: boolean | null, title = false, delay = 0): Variants {
  return {
    hidden: reduced
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : {
          opacity: 0,
          y: title ? 28 : 44,
          ...(title ? { filter: "blur(4px)" } : {}),
        },
    visible: {
      opacity: 1,
      y: 0,
      ...(title || reduced ? { filter: "blur(0px)" } : {}),
      transition: {
        duration: reduced ? 0 : 0.95,
        delay: reduced ? 0 : delay,
        ease: entranceEase,
      },
    },
  };
}
function sequence(reduced: boolean | null, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.12,
        delayChildren: reduced ? 0 : delay,
      },
    },
  };
}
function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`scroll-reveal ${className}`}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={revealViewport}
      variants={
        stagger ? sequence(reduced, delay) : entrance(reduced, false, delay)
      }
    >
      {children}
    </motion.div>
  );
}
function Label({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.p className="aigen-label" variants={entrance(reduced)}>
      {children}
    </motion.p>
  );
}
function Heading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <Reveal className="section-heading" stagger>
      <Label>{label}</Label>
      <motion.h2 variants={entrance(reduced, true, 0.12)}>{title}</motion.h2>
      {description && <motion.p className="section-description" variants={entrance(reduced, false, 0.24)}>{description}</motion.p>}
    </Reveal>
  );
}
function ProductFrame({
  image,
  alt,
  compact = false,
}: {
  image: string;
  alt: string;
  compact?: boolean;
}) {
  return (
    <div className={`product-frame ${compact ? "compact" : ""}`}>
      <div className="window-bar">
        <span />
        <span />
        <span />
        <p>
          AiGen-One <span aria-hidden="true">/</span> {alt}
        </p>
        <ShieldCheck size={13} />
      </div>
      <img
        src={image}
        alt={alt}
        loading="lazy"
        width={screenDimensions[image].width}
        height={screenDimensions[image].height}
      />
    </div>
  );
}

function FeatureGallery() {
  const { t } = useTranslation("aigen-one");
  const features = t("experience.features.items", {
    returnObjects: true,
  }) as Item[];
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  function select(index: number, focus = false) {
    setSelected(index);
    if (focus) tabs.current[index]?.focus();
  }
  return (
    <section id="platform" className="aigen-section feature-section">
      <div className="aigen-wrap">
        <Heading
          label={t("experience.features.label")}
          title={t("experience.features.title")}
          description={t("experience.features.description")}
        />
        <Reveal>
          <div
            className="feature-tabs"
            role="tablist"
            aria-label={t("experience.features.tabs")}
          >
            {features.map((item, i) => {
              const Icon = icons[i];
              return (
                <button
                  key={item.label}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`feature-tab-${i}`}
                  role="tab"
                  aria-selected={selected === i}
                  aria-controls="feature-panel"
                  tabIndex={selected === i ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(event) => {
                    const next =
                      event.key === "ArrowRight"
                        ? (i + 1) % features.length
                        : event.key === "ArrowLeft"
                          ? (i - 1 + features.length) % features.length
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? features.length - 1
                              : null;
                    if (next !== null) {
                      event.preventDefault();
                      select(next, true);
                    }
                  }}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div
            id="feature-panel"
            className={`feature-panel feature-panel-${selected}`}
            role="tabpanel"
            aria-labelledby={`feature-tab-${selected}`}
            tabIndex={0}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected}
                className="feature-content"
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -12 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
              >
                <div className="feature-copy">
                  <span className="feature-index">
                    0{selected + 1} <span>/ 05</span>
                  </span>
                  <h3>{features[selected].title}</h3>
                  <p>{features[selected].description}</p>
                  <span className="feature-tag">
                    <Check size={15} />
                    {t("experience.features.foundation")}
                  </span>
                </div>
                <div className="feature-art">
                  <ProductFrame
                    image={featureScreens[selected]}
                    alt={features[selected].label ?? "AiGen-One"}
                    compact
                  />
                  <span className="visual-caption">
                    {t("experience.visual.actual")}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MovieGallery() {
  const { t } = useTranslation("aigen-one");
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setPlaying(false);
      },
      { threshold: 0 },
    );
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  const shortTitles = t("experience.movies.titles", {
    returnObjects: true,
  }) as string[];
  const title = movies[active].short
    ? shortTitles[active]
    : t("experience.movies.main");
  function change(index: number) {
    setPlaying(false);
    setActive((index + movies.length) % movies.length);
  }
  return (
    <section id="movies" className="aigen-section movie-section" ref={section}>
      <div className="aigen-wrap">
        <Heading
          label="AI AT WORK"
          title={t("experience.movies.title")}
          description={t("experience.movies.description")}
        />
        <Reveal>
          <div
            className="movie-stage"
            role="region"
            aria-roledescription={t("experience.movies.carousel")}
            aria-label={t("experience.movies.title")}
          >
            {playing ? (
              <div
                className={`movie-slide ${movies[active].short ? "short-slide" : ""}`}
              >
                <iframe
                  key={movies[active].id}
                  src={`https://www.youtube-nocookie.com/embed/${movies[active].id}?autoplay=1&rel=0`}
                  title={title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className={`movie-slide ${movies[active].short ? "short-slide" : ""}`}
                  key={active}
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduced ? 1 : 1.02 }}
                  transition={{ duration: reduced ? 0 : 0.35 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.06}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) change(active + 1);
                    if (info.offset.x > 60) change(active - 1);
                  }}
                >
                  <img
                    src={movies[active].thumbnail}
                    alt={title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = dashboardImage;
                    }}
                  />
                  <div className="movie-shade" />
                  <div className="movie-overlay">
                    <p>
                      {movies[active].short
                        ? `SHORT FILM ${String(active + 1).padStart(2, "0")}`
                        : "PRODUCT FILM"}
                    </p>
                    <h3>{title}</h3>
                    <button
                      className="play-button"
                      onClick={() => setPlaying(true)}
                    >
                      <Play size={17} fill="currentColor" />
                      {t("experience.movies.play")}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="movie-controls">
            <div
              className="movie-dots"
              aria-label={t("experience.movies.select")}
            >
              {movies.map((movie, i) => (
                <button
                  key={movie.id}
                  aria-label={
                    movie.short ? shortTitles[i] : t("experience.movies.main")
                  }
                  aria-pressed={active === i}
                  onClick={() => change(i)}
                >
                  <span />
                </button>
              ))}
            </div>
            <p aria-live="polite" aria-atomic="true">
              {title}{" "}
              <span>
                {active + 1} / {movies.length}
              </span>
            </p>
            <div className="gallery-arrows">
              <button
                aria-label={t("experience.movies.previous")}
                onClick={() => change(active - 1)}
              >
                <ChevronLeft size={21} />
              </button>
              <button
                aria-label={t("experience.movies.next")}
                onClick={() => change(active + 1)}
              >
                <ChevronRight size={21} />
              </button>
            </div>
          </div>
          <a
            className="text-link movie-fallback"
            href={`https://www.youtube.com/watch?v=${movies[active].id}`}
            target="_blank"
            rel="noreferrer"
          >
            {t("experience.movies.youtube")}
            <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default function AIGenOne() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const contact = `https://www.aigen.tokyo/contact/?lang=${locale}`;
  const reduced = useReducedMotion();
  const list = (key: string) => t(key, { returnObjects: true }) as string[];
  const items = (key: string) => t(key, { returnObjects: true }) as Item[];
  useEffect(() => {
    document.title = t("meta.title");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t("meta.description"));
  }, [t]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="aigen-experience">
        <section className="aigen-hero">
          <div className="hero-backdrop" aria-hidden="true">
            <img src={officeImage} alt="" fetchPriority="high" />
          </div>
          <div className="aigen-wrap hero-copy">
            <motion.div
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={sequence(reduced, 0.08)}
            >
              <Label>{t("hero.eyebrow")}</Label>
              <h1>
                {t("hero.title")
                  .split("\n")
                  .map((line, i) => (
                    <motion.span key={line} className={i === 1 ? "hero-accent" : ""} variants={entrance(reduced, true)}>
                      {line}
                    </motion.span>
                  ))}
              </h1>
              <motion.p className="hero-description" variants={entrance(reduced)}>{t("hero.description")}</motion.p>
              <motion.div className="hero-actions" variants={entrance(reduced)}>
                <a className="aigen-button" href={contact}>
                  {t("hero.primaryCta")}
                  <ArrowUpRight size={17} />
                </a>
                <a className="text-link" href="#movies">
                  <Play size={15} />
                  {t("hero.secondaryCta")}
                </a>
              </motion.div>
            </motion.div>
          </div>
          <Reveal className="hero-product" delay={0.25}>
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-product-inner">
              <ProductFrame image={dashboardImage} alt="Dashboard" />
              <div className="floating-note note-chat">
                <span className="floating-icon">
                  <MessageSquare size={18} />
                </span>
                <div>
                  <small>AiGen Chat</small>
                  <b>{t("experience.heroNotes.chat")}</b>
                </div>
                <Sparkles size={15} />
              </div>
              <div className="floating-note note-work">
                <span className="floating-icon green">
                  <Check size={18} />
                </span>
                <div>
                  <small>Workflow</small>
                  <b>{t("experience.heroNotes.work")}</b>
                </div>
              </div>
              <span className="hero-screen-caption">
                {t("experience.visual.actual")}
              </span>
            </div>
          </Reveal>
          <div className="hero-bottom aigen-wrap">
            <p>{t("experience.heroNotes.bottom")}</p>
            <span>
              CHAT <span>→</span> WORKFLOW <span>→</span> APPS
            </span>
          </div>
        </section>

        <section className="aigen-section entry-section">
          <div className="aigen-wrap entry-grid">
            <Heading
              label="START WITH EVERYDAY AI"
              title={t("experience.entry.title")}
              description={t("experience.entry.description")}
            />
            <Reveal className="entry-questions" stagger delay={0.15}>
              <motion.p className="entry-intro" variants={entrance(reduced)}>{t("experience.entry.ask")}</motion.p>
              {list("experience.entry.questions").map((question, i) => (
                <motion.div className="entry-question" key={question} variants={entrance(reduced, false, 0.12 * (i + 1))}>
                  <span>0{i + 1}</span>
                  <p>{question}</p>
                  <ArrowUpRight size={19} />
                </motion.div>
              ))}
              <motion.p className="small-note" variants={entrance(reduced, false, 0.48)}>{t("experience.entry.note")}</motion.p>
            </Reveal>
          </div>
        </section>

        <FeatureGallery />
        <MovieGallery />

        <section id="build" className="aigen-section build-section">
          <div className="aigen-wrap">
            <Heading
              label="GROW WITH YOUR WORK"
              title={t("experience.build.title")}
              description={t("experience.build.description")}
            />
            <Reveal className="build-stage">
              <div className="build-dialog">
                <span>
                  <MessageSquare size={17} /> {t("experience.build.voice")}
                </span>
                <p>“{t("build.prompt")}”</p>
                <div>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <ProductFrame image={builderImage} alt="Builder Chat" />
              <p className="build-caption">{t("experience.build.caption")}</p>
            </Reveal>
            <div className="creator-grid">
              {items("build.outputs").map((item, i) => (
                <Reveal
                  className="creator-item"
                  key={item.title}
                  delay={i * 0.1}
                >
                  <span>0{i + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </Reveal>
              ))}
            </div>
            <div className="growth-path">
              {items("experience.growth").map((item, i) => (
                <Reveal key={item.title} delay={i * 0.1}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="fde" className="aigen-section adoption-section">
          <div className="aigen-wrap adoption-grid">
            <Reveal className="adoption-photo">
              <img
                src={teamImage}
                alt={t("experience.adoption.imageAlt")}
                loading="lazy"
                width="1536"
                height="1024"
              />
              <span>{t("experience.adoption.caption")}</span>
            </Reveal>
            <div>
              <Heading
                label="FROM ONE WORKFLOW"
                title={t("experience.adoption.title")}
                description={t("experience.adoption.description")}
              />
              <ol className="adoption-steps">
                {items("fde.steps").map((item, i) => (
                  <motion.li key={item.title} initial={reduced ? false : "hidden"} whileInView="visible" viewport={revealViewport} variants={entrance(reduced, false, i * 0.08)}>
                    <span>0{i + 1}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
              <Reveal>
                <p className="small-note">{t("experience.adoption.fde")}</p>
                <a href={contact} className="text-link">
                  {t("experience.adoption.cta")}
                  <ArrowRight size={17} />
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="practice" className="aigen-section practice-section">
          <div className="aigen-wrap">
            <Heading
              label="OUR OWN PRACTICE"
              title={t("experience.practice.title")}
              description={t("experience.practice.description")}
            />
            <Reveal className="practice-intro">
              <span className="experiment-badge">
                <span />
                {t("experience.practice.badge")}
              </span>
              <p>{t("experience.practice.context")}</p>
            </Reveal>
            <div className="practice-flow">
              <Reveal className="request-origin">
                <span className="google-chat-mark">
                  <MessageSquare size={26} />
                </span>
                <small>Google Chat</small>
                <p>{t("experience.practice.request")}</p>
              </Reveal>
              <ol>
                {list("experience.practice.steps").map((step, i) => (
                  <motion.li
                    initial={reduced ? false : "hidden"}
                    whileInView="visible"
                    viewport={revealViewport}
                    variants={entrance(reduced, false, i * 0.08)}
                    key={step}
                    className={
                      [1, 3, 5].includes(i) ? "human-step" : "ai-step"
                    }
                  >
                    <span className="flow-count">0{i + 1}</span>
                    <span className="flow-role">
                      {[1, 3, 5].includes(i)
                        ? t("experience.practice.human")
                        : "AI"}
                    </span>
                    <b>{step}</b>
                    {i === 4 ? (
                      <GitPullRequest size={20} />
                    ) : i === 5 ? (
                      <ShieldCheck size={20} />
                    ) : (
                      <ArrowRight size={20} />
                    )}
                  </motion.li>
                ))}
              </ol>
            </div>
            <div className="practice-bottom">
              <Reveal>
                <h3>{t("experience.practice.todayTitle")}</h3>
                <p>{t("experience.practice.today")}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h3>{t("experience.practice.futureTitle")}</h3>
                <p>{t("experience.practice.future")}</p>
              </Reveal>
            </div>
            <Reveal className="practice-measure">
              <p>{t("experience.practice.measure")}</p>
            </Reveal>
          </div>
        </section>

        <section className="aigen-section governance-section">
          <div className="aigen-wrap">
            <Heading
              label="MADE FOR TEAMS"
              title={t("experience.governance.title")}
              description={t("experience.governance.description")}
            />
            <div className="governance-grid">
              {items("governance.items").map((item, i) => {
                const Icon = [ShieldCheck, LayoutDashboard, Database][i];
                return (
                  <Reveal
                    className="governance-item"
                    key={item.title}
                    delay={i * 0.1}
                  >
                    <Icon size={27} />
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="connection-strip">
              <span>{t("experience.governance.connect")}</span>
              <span>Google Workspace</span>
              <span>PostgreSQL</span>
              <span>API / MCP</span>
              <span>Git</span>
            </Reveal>
          </div>
        </section>

        <section id="pricing" className="aigen-section pricing-section">
          <div className="aigen-wrap">
            <Heading
              label="PLANS"
              title={t("pricing.title")}
              description={t("pricing.description")}
            />
            <div className="pricing-grid">
              {items("pricing.plans").map((plan, i) => (
                <Reveal
                  className={`pricing-card ${i === 1 ? "featured-plan" : ""}`}
                  key={plan.name}
                  delay={i * 0.1}
                >
                  <span className="plan-role">{plan.target}</span>
                  <h3>{plan.name}</h3>
                  <p className="plan-price">{plan.price}</p>
                  <p className="plan-features">
                    <Check size={17} />
                    {plan.features}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal className="pricing-notes">
              <p>{t("pricing.note")}</p>
              <p>{t("experience.pricingNote")}</p>
              <a href={contact} className="text-link">
                {t("pricing.cta")}
                <ArrowRight size={16} />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="aigen-section final-section">
          <div className="aigen-wrap">
            <Reveal stagger>
              <Label>LET’S CONNECT YOUR WORK</Label>
              <motion.h2 variants={entrance(reduced, true, 0.12)}>{t("cta.title")}</motion.h2>
              <motion.p variants={entrance(reduced, false, 0.24)}>{t("cta.description")}</motion.p>
              <motion.div className="hero-actions" variants={entrance(reduced)}>
                <a className="aigen-button" href={contact}>
                  {t("cta.primary")}
                  <ArrowUpRight size={18} />
                </a>
                <a className="text-link" href="#movies">
                  {t("cta.secondary")}
                  <Play size={16} />
                </a>
              </motion.div>
              <motion.span className="final-wordmark" aria-hidden="true" variants={entrance(reduced)}>
                AiGen-One.
              </motion.span>
            </Reveal>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
