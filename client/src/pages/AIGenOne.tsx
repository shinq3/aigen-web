import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  Database,
  FileText,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  MessageSquareText,
  Network,
  Plug,
  ShieldCheck,
  Users,
  WandSparkles,
  Workflow,
} from "lucide-react";
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

const platformIcons = [LayoutDashboard, MessageSquareText, BrainCircuit, Bot, Workflow];
const fdeIcons = [Users, Network, Gauge];
const outcomeIcons = [FileText, BarChart3, Database];
const governanceIcons = [LockKeyhole, ShieldCheck, Plug];
const outcomeImages = [builderImage, fieldDiscoveryImage, teamAdoptionImage];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function SectionLabel({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return (
    <p className={`mb-4 text-xs font-bold uppercase tracking-[0.18em] ${inverse ? "text-orange-300" : "text-orange-700"}`}>
      {children}
    </p>
  );
}

function DashboardVisual() {
  return (
    <figure className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-2xl">
      <div className="flex h-10 items-center gap-2 border-b border-slate-700 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
        <span className="ml-3 text-[10px] font-semibold text-slate-400">AiGen-One / Actual Dashboard</span>
      </div>
      <img src={dashboardImage} alt="AiGen-One dashboard" className="block h-auto w-full bg-white" />
    </figure>
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
    <div className="overflow-hidden bg-white text-slate-950">
      <section className="relative flex h-[calc(100svh-7rem)] min-h-[620px] max-h-[760px] items-end overflow-hidden text-white">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover object-[63%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.98)_0%,rgba(2,6,23,.88)_34%,rgba(2,6,23,.28)_70%,rgba(2,6,23,.12)_100%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-24 sm:pb-24">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }} className="max-w-[680px]">
            <motion.div variants={reveal} transition={{ duration: 0.55 }} className="mb-7 inline-flex items-center gap-2 border-l-2 border-orange-400 pl-3 text-xs font-bold uppercase tracking-[0.18em] text-orange-200">
              {t("hero.eyebrow")}
            </motion.div>
            <motion.p variants={reveal} transition={{ duration: 0.55 }} className="mb-3 text-xl font-bold text-white sm:text-2xl">AiGen-One</motion.p>
            <motion.h1 variants={reveal} transition={{ duration: 0.65 }} className="whitespace-pre-line text-[clamp(2.6rem,6vw,5.4rem)] font-bold leading-[1.04] tracking-[0]">
              {t("hero.title")}
            </motion.h1>
            <motion.p variants={reveal} transition={{ duration: 0.6 }} className="mt-7 max-w-xl text-base font-medium leading-8 text-slate-200 sm:text-lg">
              {t("hero.description")}
            </motion.p>
            <motion.div variants={reveal} transition={{ duration: 0.6 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 rounded-md bg-orange-500 px-6 text-white hover:bg-orange-600" asChild>
                <a href={contactUrl}>{t("hero.primaryCta")}<ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-md border-white/35 bg-white/5 px-6 text-white hover:bg-white hover:text-slate-950" asChild>
                <a href="#platform">{t("hero.secondaryCta")}<ArrowDown className="ml-2 h-4 w-4" /></a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-3">
          {list("hero.proofs").map((proof) => <div key={proof} className="flex items-center gap-3 text-sm font-semibold text-slate-700"><Check className="h-4 w-4 shrink-0 text-orange-600" />{proof}</div>)}
        </div>
      </section>

      <section id="fde" className="scroll-mt-16 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
            <div>
              <SectionLabel>{t("fde.eyebrow")}</SectionLabel>
              <h2 className="whitespace-pre-line text-3xl font-bold leading-tight sm:text-5xl">{t("fde.title")}</h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-slate-600">{t("fde.description")}</p>
              <p className="mt-5 border-l-2 border-orange-500 pl-4 text-sm font-semibold leading-7 text-slate-800">{t("fde.note")}</p>
            </div>
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch">
            <figure className="relative min-h-[420px] overflow-hidden rounded-lg">
              <img src={fieldDiscoveryImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 right-5 text-sm font-semibold leading-6 text-white">{t("fde.photoCaption")}</figcaption>
            </figure>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {objects("fde.steps").map((step, index) => {
                const Icon = fdeIcons[index];
                return <motion.div key={step.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.12 }} className="grid grid-cols-[48px_1fr] gap-4 py-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-50 text-orange-700"><Icon className="h-5 w-5" /></span>
                  <div><div className="flex items-center justify-between"><h3 className="text-xl font-bold">{step.title}</h3><span className="text-xs font-bold text-slate-300">0{index + 1}</span></div><p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p></div>
                </motion.div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="scroll-mt-16 bg-slate-950 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
            <div>
              <SectionLabel inverse>{t("platform.eyebrow")}</SectionLabel>
              <h2 className="whitespace-pre-line text-3xl font-bold leading-tight sm:text-5xl">{t("platform.title")}</h2>
            </div>
            <p className="text-lg leading-8 text-slate-300">{t("platform.description")}</p>
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.5fr_.75fr] lg:items-center">
            <DashboardVisual />
            <div className="divide-y divide-slate-800 border-y border-slate-800">
              {objects("platform.layers").map((layer, index) => {
                const Icon = platformIcons[index];
                return <div key={layer.title} className="flex gap-4 py-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/5 text-orange-300"><Icon className="h-4 w-4" /></span><div><h3 className="font-bold">{layer.title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{layer.description}</p></div></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="build" className="scroll-mt-16 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative overflow-hidden rounded-lg bg-slate-950">
              <img src={builderImage} alt="" className="aspect-[4/3] h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 rounded-md border border-white/15 bg-slate-950/90 p-4 text-white backdrop-blur-sm sm:inset-x-8 sm:bottom-8">
                <div className="flex items-start gap-3"><MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" /><p className="text-sm font-medium leading-6">{t("build.prompt")}</p></div>
              </div>
            </div>
            <div>
              <SectionLabel>{t("build.eyebrow")}</SectionLabel>
              <h2 className="whitespace-pre-line text-3xl font-bold leading-tight sm:text-5xl">{t("build.title")}</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">{t("build.description")}</p>
              <div className="mt-9 divide-y divide-slate-200 border-y border-slate-200">
                {objects("build.outputs").map((output, index) => {
                  const Icon = [BrainCircuit, Bot, Workflow][index];
                  return <div key={output.title} className="grid grid-cols-[42px_1fr] gap-3 py-5"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50 text-orange-700"><Icon className="h-4 w-4" /></span><div><h3 className="font-bold">{output.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{output.description}</p></div></div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-slate-800 py-20 text-white sm:py-28">
        <img src={teamAdoptionImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.96)_0%,rgba(2,6,23,.78)_55%,rgba(2,6,23,.42)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-4">
          <SectionLabel inverse>{t("journey.eyebrow")}</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <h2 className="whitespace-pre-line text-3xl font-bold leading-tight sm:text-5xl">{t("journey.title")}</h2>
            <p className="text-lg leading-8 text-slate-200">{t("journey.description")}</p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/15 bg-white/15 md:grid-cols-5">
            {objects("journey.steps").map((step, index) => <div key={step.title} className="bg-slate-950/80 p-6 backdrop-blur-sm"><span className="text-xs font-bold text-orange-300">0{index + 1}</span><h3 className="mt-8 font-bold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <SectionLabel>{t("outcomes.eyebrow")}</SectionLabel>
            <h2 className="whitespace-pre-line text-3xl font-bold leading-tight sm:text-5xl">{t("outcomes.title")}</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">{t("outcomes.description")}</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {objects("outcomes.items").map((item, index) => {
              const Icon = outcomeIcons[index];
              return <article key={item.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white"><div className="relative aspect-[16/9] overflow-hidden"><img src={outcomeImages[index]} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" /><Icon className="absolute bottom-4 left-4 h-6 w-6 text-white" /></div><div className="p-6"><p className="text-xs font-bold uppercase text-orange-700">{item.label}</p><h3 className="mt-2 text-xl font-bold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p></div></article>;
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-28">
        <img src={governanceImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.98)_0%,rgba(2,6,23,.88)_52%,rgba(2,6,23,.55)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel inverse>{t("governance.eyebrow")}</SectionLabel>
              <h2 className="whitespace-pre-line text-3xl font-bold leading-tight sm:text-5xl">{t("governance.title")}</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">{t("governance.description")}</p>
            </div>
            <div className="divide-y divide-white/15 border-y border-white/15 bg-slate-950/55 px-5 backdrop-blur-sm">
              {objects("governance.items").map((item, index) => {
                const Icon = governanceIcons[index];
                return <div key={item.title} className="flex gap-4 py-6"><Icon className="mt-1 h-5 w-5 shrink-0 text-orange-300" /><div><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p></div></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-16 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <SectionLabel>{t("pricing.eyebrow")}</SectionLabel>
              <h2 className="text-3xl font-bold sm:text-5xl">{t("pricing.title")}</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">{t("pricing.description")}</p>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              {objects("pricing.plans").map((plan, index) => <div key={plan.name} className={`grid gap-3 border-b border-slate-200 p-5 last:border-b-0 sm:grid-cols-[1fr_1.6fr_auto] sm:items-center ${index === 1 ? "bg-orange-50" : "bg-white"}`}><div><p className="font-bold">{plan.name}</p><p className="mt-1 text-xs text-slate-500">{plan.target}</p></div><p className="text-sm leading-6 text-slate-600">{plan.features}</p><p className="whitespace-nowrap font-bold text-slate-900">{plan.price}</p></div>)}
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center"><p className="text-sm leading-6 text-slate-600">{t("pricing.note")}</p><Button variant="outline" className="rounded-md" asChild><a href={contactUrl}>{t("pricing.cta")}<ArrowRight className="ml-2 h-4 w-4" /></a></Button></div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-orange-500 py-20 text-slate-950 sm:py-24">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-orange-400/40" />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em]">{t("cta.eyebrow")}</p>
            <h2 className="whitespace-pre-line text-3xl font-bold leading-tight sm:text-5xl">{t("cta.title")}</h2>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-900/75">{t("cta.description")}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 rounded-md bg-slate-950 px-6 text-white hover:bg-slate-800" asChild><a href={contactUrl}>{t("cta.primary")}<ArrowRight className="ml-2 h-4 w-4" /></a></Button>
              <Button size="lg" variant="outline" className="h-12 rounded-md border-slate-950/30 bg-transparent px-6 text-slate-950 hover:bg-white" asChild><a href={demoUrl} target="_blank" rel="noreferrer">{t("cta.secondary")}<WandSparkles className="ml-2 h-4 w-4" /></a></Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
