import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, WandSparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n-utils";
import heroImage from "@assets/generated_images/AIGenOne_FDE_workshop_v2.jpg";
import builderImage from "@assets/generated_images/AIGenOne_talk_to_system.jpg";
import dashboardImage from "@assets/generated_images/AIGenOne_dashboard_actual_v2.png";
import fieldDiscoveryImage from "@assets/generated_images/AIGenOne_FDE_field_discovery_v2.jpg";
import teamAdoptionImage from "@assets/generated_images/AIGenOne_team_adoption_v2.jpg";
import governanceImage from "@assets/generated_images/AIGenOne_governance_review_v2.jpg";

const mainSiteUrl = "https://d-auchy.studio";
const demoUrl = "https://youtu.be/QnKgrSrNcmo";

const outcomeImages = [builderImage, fieldDiscoveryImage, teamAdoptionImage];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function JourneyIconListen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5h16v10H9l-4 4V5z" />
      <path d="M8.5 9.2h7M8.5 12h4.5" />
    </svg>
  );
}
function JourneyIconBreakdown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}
function JourneyIconBuild(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 6.5a3 3 0 0 1-3.9 3.9L5 16v3h3l5.6-5.6a3 3 0 0 1 3.9-3.9L21 6l-3-3z" />
    </svg>
  );
}
function JourneyIconLaunch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3c2.8 1.8 4.5 4.9 4.5 8.5 0 2-.5 3.7-1.2 5H8.7c-.7-1.3-1.2-3-1.2-5C7.5 7.9 9.2 4.8 12 3z" />
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M8.7 16.5 6 21l3.2-1.4M15.3 16.5 18 21l-3.2-1.4" />
    </svg>
  );
}
function JourneyIconImprove(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  );
}
const journeyIcons = [JourneyIconListen, JourneyIconBreakdown, JourneyIconBuild, JourneyIconLaunch, JourneyIconImprove];

function SectionLabel({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return (
    <p className={`mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] ${inverse ? "text-[#34E1FF]" : "text-[#2D6BFF]"}`}>
      {children}
    </p>
  );
}

function DashboardVisual() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[rgba(234,242,255,.15)] bg-[#0A1120] shadow-2xl">
      <div className="flex h-11 items-center gap-2.5 border-b border-[rgba(234,242,255,.15)] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#34E1FF]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2b3854]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2b3854]" />
        <span className="ml-2.5 font-display text-[10px] font-bold text-[#7488a8]">AiGen-One / Dashboard</span>
      </div>
      <img src={dashboardImage} alt="AiGen-One dashboard" className="block h-auto w-full bg-white" />
    </figure>
  );
}

function TitleLines({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;
        return (
          <span key={i} className={isLast ? "sm:whitespace-nowrap" : undefined}>
            {line.split(/(AI)/g).map((part, j) =>
              part === "AI" ? (
                <span key={j} className="text-[#34E1FF]">AI</span>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
            {!isLast && <br />}
          </span>
        );
      })}
    </>
  );
}

export default function AIGenOne() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const contactUrl = `${mainSiteUrl}/${locale}/contact`;
  const list = (key: string) => t(key, { returnObjects: true }) as string[];
  const objects = (key: string) => t(key, { returnObjects: true }) as Array<Record<string, string>>;

  useEffect(() => {
    document.title = t("meta.title");
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", t("meta.description"));
  }, [t]);

  return (
    <div className="overflow-hidden bg-[#EEF2F8] text-[#0B1220]" style={{ fontFamily: '"Noto Sans JP", Inter, sans-serif' }}>
      <section className="relative flex min-h-[820px] items-center overflow-hidden text-[#EAF2FF]">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover object-[63%_center]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(6,10,22,.97) 0%, rgba(6,10,22,.9) 38%, rgba(6,10,22,.35) 72%, rgba(6,10,22,.1) 100%)" }} />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-24">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }} className="max-w-[760px]">
            <motion.div variants={reveal} transition={{ duration: 0.55 }} className="mb-7 inline-flex items-center gap-2.5 border-l-[3px] border-[#34E1FF] pl-3.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-[#34E1FF]">
              {t("hero.eyebrow")}
            </motion.div>
            <motion.p variants={reveal} transition={{ duration: 0.55 }} className="mb-2.5 text-xl font-bold text-[#EAF2FF]">AiGen-One</motion.p>
            <motion.h1 variants={reveal} transition={{ duration: 0.65 }} className="text-[clamp(2.4rem,6vw,4.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              <TitleLines text={t("hero.title")} />
            </motion.h1>
            <motion.p variants={reveal} transition={{ duration: 0.6 }} className="mt-7 max-w-[560px] text-base leading-[1.9] text-[#B9C6DE] sm:text-lg">
              {t("hero.description")}
            </motion.p>
            <motion.div variants={reveal} transition={{ duration: 0.6 }} className="mt-9 flex flex-col gap-3.5 sm:flex-row">
              <Button size="lg" className="h-12 rounded-lg bg-[#34E1FF] px-7 text-[#060A16] hover:bg-[#34E1FF]/90" asChild>
                <a href={contactUrl}>{t("hero.primaryCta")}<ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-lg border-white/35 bg-transparent px-7 text-[#EAF2FF] hover:bg-white/10" asChild>
                <a href="#platform">{t("hero.secondaryCta")}<ArrowDown className="ml-2 h-4 w-4" /></a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[rgba(11,18,32,.1)] bg-[#EEF2F8] py-8">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-3">
          {list("hero.proofs").map((proof) => (
            <div key={proof} className="flex items-center gap-3 text-sm font-semibold text-[#28374f]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2D6BFF]">
                <Check className="h-3 w-3 text-white" />
              </span>
              {proof}
            </div>
          ))}
        </div>
      </section>

      <section id="fde" className="scroll-mt-16 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
            <div>
              <SectionLabel>{t("fde.eyebrow")}</SectionLabel>
              <h2 className="whitespace-pre-line text-3xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-5xl">{t("fde.title")}</h2>
            </div>
            <div>
              <p className="text-lg leading-[1.9] text-[#41506b]">{t("fde.description")}</p>
              <p className="mt-5 border-l-[3px] border-[#2D6BFF] pl-4 text-sm font-bold leading-7 text-[#0B1220]">{t("fde.note")}</p>
            </div>
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch">
            <figure className="relative min-h-[420px] overflow-hidden rounded-2xl">
              <img src={fieldDiscoveryImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,10,22,.7)] via-transparent to-transparent" />
              <figcaption className="absolute bottom-6 left-6 right-6 text-sm font-semibold leading-[1.7] text-white">{t("fde.photoCaption")}</figcaption>
            </figure>
            <div className="divide-y divide-[rgba(11,18,32,.1)] border-y border-[rgba(11,18,32,.1)]">
              {objects("fde.steps").map((step, index) => (
                <motion.div key={step.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.12 }} className="grid grid-cols-[64px_1fr] gap-5 py-7">
                  <span className="font-display text-3xl font-bold text-[#c6d2e6]">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="mt-2.5 text-sm leading-[1.8] text-[#41506b]">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="scroll-mt-16 bg-[#060A16] py-20 text-[#EAF2FF] sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
            <div>
              <SectionLabel inverse>{t("platform.eyebrow")}</SectionLabel>
              <h2 className="whitespace-pre-line text-3xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-5xl">{t("platform.title")}</h2>
            </div>
            <p className="text-lg leading-[1.9] text-[#9DAEC9]">{t("platform.description")}</p>
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.5fr_.75fr] lg:items-center">
            <DashboardVisual />
            <div className="divide-y divide-[rgba(234,242,255,.12)] border-y border-[rgba(234,242,255,.12)]">
              {objects("platform.layers").map((layer, index) => (
                <div key={layer.title} className="flex gap-4 py-5">
                  <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[rgba(52,225,255,.12)] font-display text-[13px] font-bold text-[#34E1FF]">0{index + 1}</span>
                  <div>
                    <h3 className="font-bold">{layer.title}</h3>
                    <p className="mt-1.5 text-sm leading-[1.7] text-[#8496b3]">{layer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="build" className="scroll-mt-16 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative overflow-hidden rounded-2xl bg-[#060A16]">
              <img src={builderImage} alt="" className="aspect-[4/3] h-full w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060A16] via-[#060A16]/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 rounded-[10px] border border-[rgba(234,242,255,.15)] bg-[rgba(6,10,22,.9)] p-4 text-[#EAF2FF] sm:inset-x-6 sm:bottom-6">
                <p className="text-sm font-medium leading-[1.7]">{t("build.prompt")}</p>
              </div>
            </div>
            <div>
              <SectionLabel>{t("build.eyebrow")}</SectionLabel>
              <h2 className="whitespace-pre-line text-3xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-5xl">{t("build.title")}</h2>
              <p className="mt-6 text-lg leading-[1.9] text-[#41506b]">{t("build.description")}</p>
              <div className="mt-5 divide-y divide-[rgba(11,18,32,.1)] border-y border-[rgba(11,18,32,.1)]">
                {objects("build.outputs").map((output, index) => (
                  <div key={output.title} className="flex gap-3.5 py-5">
                    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border border-[rgba(11,18,32,.1)] bg-[#EEF2F8] font-display text-xs font-bold text-[#2D6BFF]">0{index + 1}</span>
                    <div>
                      <h3 className="font-bold">{output.title}</h3>
                      <p className="mt-1.5 text-sm leading-[1.7] text-[#41506b]">{output.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[rgba(11,18,32,.08)] py-20 text-[#EAF2FF] sm:py-28">
        <img src={teamAdoptionImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(6,10,22,.97) 0%, rgba(6,10,22,.8) 55%, rgba(6,10,22,.4) 100%)" }} />
        <div className="relative mx-auto max-w-6xl px-4">
          <SectionLabel inverse>{t("journey.eyebrow")}</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <h2 className="whitespace-pre-line text-3xl font-extrabold leading-[1.2] sm:text-5xl">{t("journey.title")}</h2>
            <p className="text-lg leading-[1.9] text-[#B9C6DE]">{t("journey.description")}</p>
          </div>
          <div className="relative mt-14">
            <div className="absolute left-20 right-20 top-[87px] hidden h-px md:block" style={{ background: "repeating-linear-gradient(90deg, rgba(52,225,255,.5) 0 8px, transparent 8px 16px)" }} />
            <div className="relative z-10 grid gap-px overflow-hidden rounded-xl border border-[rgba(234,242,255,.15)] bg-[rgba(234,242,255,.15)] sm:grid-cols-2 md:grid-cols-5">
              {objects("journey.steps").map((step, index) => {
                const Icon = journeyIcons[index];
                return (
                  <div key={step.title} className="flex flex-col items-center bg-[rgba(6,10,22,.9)] p-6 text-center">
                    <span className="font-display text-[11px] font-bold tracking-[0.1em] text-[#34E1FF]">STEP 0{index + 1}</span>
                    <span className="mt-3.5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(52,225,255,.35)] bg-[rgba(52,225,255,.1)] text-[#34E1FF]">
                      <Icon className="h-[30px] w-[30px]" />
                    </span>
                    <h3 className="mt-5 font-bold">{step.title}</h3>
                    <p className="mt-2.5 text-xs leading-[1.7] text-[#9DAEC9]">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-[640px]">
            <SectionLabel>{t("outcomes.eyebrow")}</SectionLabel>
            <h2 className="whitespace-pre-line text-3xl font-extrabold leading-[1.2] sm:text-5xl">{t("outcomes.title")}</h2>
            <p className="mt-6 text-lg leading-[1.9] text-[#41506b]">{t("outcomes.description")}</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {objects("outcomes.items").map((item, index) => (
              <article key={item.title} className="overflow-hidden rounded-2xl border border-[rgba(11,18,32,.1)] bg-white">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={outcomeImages[index]} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,10,22,.5)] to-transparent" />
                </div>
                <div className="p-6">
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D6BFF]">{item.label}</p>
                  <h3 className="mt-2.5 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-[1.8] text-[#41506b]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#060A16] py-20 text-[#EAF2FF] sm:py-28">
        <img src={governanceImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-40" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(6,10,22,.98) 0%, rgba(6,10,22,.9) 52%, rgba(6,10,22,.55) 100%)" }} />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel inverse>{t("governance.eyebrow")}</SectionLabel>
              <h2 className="whitespace-pre-line text-3xl font-extrabold leading-[1.2] sm:text-5xl">{t("governance.title")}</h2>
              <p className="mt-6 text-lg leading-[1.9] text-[#9DAEC9]">{t("governance.description")}</p>
            </div>
            <div className="divide-y divide-[rgba(234,242,255,.12)] border-y border-[rgba(234,242,255,.15)]">
              {objects("governance.items").map((item) => (
                <div key={item.title} className="flex gap-4 py-6">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#34E1FF]" />
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-[1.7] text-[#8496b3]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-16 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <SectionLabel>{t("pricing.eyebrow")}</SectionLabel>
              <h2 className="text-3xl font-extrabold sm:text-4xl">{t("pricing.title")}</h2>
              <p className="mt-5 text-base leading-7 text-[#41506b]">{t("pricing.description")}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[rgba(11,18,32,.1)]">
              {objects("pricing.plans").map((plan) => (
                <div key={plan.name} className="grid gap-3 border-b border-[rgba(11,18,32,.1)] bg-white p-5 last:border-b-0 sm:grid-cols-[1fr_1.6fr_auto] sm:items-center">
                  <div>
                    <p className="font-bold">{plan.name}</p>
                    <p className="mt-1 text-xs text-[#7488a8]">{plan.target}</p>
                  </div>
                  <p className="text-sm leading-[1.7] text-[#41506b]">{plan.features}</p>
                  <p className="whitespace-nowrap font-bold text-[#0B1220]">{plan.price}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[rgba(11,18,32,.1)] pt-6 sm:flex-row sm:items-center">
            <p className="text-sm leading-6 text-[#41506b]">{t("pricing.note")}</p>
            <Button variant="outline" className="rounded-lg border-[rgba(11,18,32,.2)]" asChild>
              <a href={contactUrl}>{t("pricing.cta")}<ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#060A16] py-20 text-[#EAF2FF] sm:py-24">
        <div className="absolute right-0 top-0 h-full w-1/3" style={{ background: "radial-gradient(circle at 70% 30%, rgba(52,225,255,.25), transparent 70%)" }} />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="max-w-[760px]">
            <SectionLabel inverse>{t("cta.eyebrow")}</SectionLabel>
            <h2 className="whitespace-pre-line text-3xl font-extrabold leading-[1.2] sm:text-5xl">{t("cta.title")}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-[1.9] text-[#9DAEC9]">{t("cta.description")}</p>
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
              <Button size="lg" className="h-12 rounded-lg bg-[#34E1FF] px-7 text-[#060A16] hover:bg-[#34E1FF]/90" asChild>
                <a href={contactUrl}>{t("cta.primary")}<ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-lg border-white/30 bg-transparent px-7 text-[#EAF2FF] hover:bg-white/10" asChild>
                <a href={demoUrl} target="_blank" rel="noreferrer">{t("cta.secondary")}<WandSparkles className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
