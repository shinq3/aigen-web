import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Blocks,
  Bot,
  CheckCircle,
  CircleDollarSign,
  ClipboardList,
  Database,
  ExternalLink,
  FileSearch,
  FileText,
  GitBranch,
  Languages,
  Layers,
  Lock,
  MessageSquare,
  Mic,
  Presentation,
  Puzzle,
  Plus,
  Rocket,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Workflow,
} from "lucide-react";
import { useLocale } from "@/lib/i18n-utils";
import heroImage from "@assets/generated_images/AIGenOne_hero_office_conversation.png";
import talkToSystemImage from "@assets/generated_images/AIGenOne_talk_to_system.png";
import previewImage from "@assets/preview_1779667793783.png";
import editorImage from "@assets/editor_1779667793781.png";
import featuresImage from "@assets/generated_images/AIGenOne_features_dashboard.png";
import securityImage from "@assets/generated_images/AIGenOne_security_shield.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const valueIcons = [MessageSquare, Store, Settings];
const flowIcons = [Mic, Bot, Layers, Share2];
const pluginIcons = [ClipboardList, Presentation, FileSearch, Languages, Workflow];
const architectureIcons = [Layers, Puzzle, Sparkles, Database, ShieldCheck];
const useCaseIcons = [BarChart3, FileText, Users, MessageSquare, Languages];
const governanceIcons = [Lock, Search, Activity, GitBranch];
const demoUrl = "https://youtu.be/QnKgrSrNcmo";
const contactBaseUrl = "https://d-auchy.studio";

export default function AIGenOne() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const contactUrl = `${contactBaseUrl}/${locale}/contact`;

  useEffect(() => {
    document.title = t("meta.title");
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", t("meta.description"));
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = t("meta.description");
      document.head.appendChild(meta);
    }
  }, [t]);

  const heroProofs = t("hero.proofs", { returnObjects: true }) as string[];
  const conceptSteps = t("concept.steps", { returnObjects: true }) as any[];
  const problemItems = t("problem.items", { returnObjects: true }) as any[];
  const values = t("values.items", { returnObjects: true }) as any[];
  const flowSteps = t("flow.steps", { returnObjects: true }) as any[];
  const pluginExamples = t("plugins.items", { returnObjects: true }) as any[];
  const architectureLayers = t("architecture.layers", { returnObjects: true }) as any[];
  const useCases = t("useCases.items", { returnObjects: true }) as any[];
  const roadmap = t("roadmap.phases", { returnObjects: true }) as any[];
  const governance = t("governance.items", { returnObjects: true }) as any[];
  const pricingPlans = t("pricing.plans", { returnObjects: true }) as any[];
  const pricingBaseFees = t("pricing.baseFees", { returnObjects: true }) as any[];
  const pricingNotes = t("pricing.notes", { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="AiGen-One office portal"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/78" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(249,115,22,0.22),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,23,42,0.72)_50%,rgba(15,23,42,0.48))]" />
        </div>

        <div className="relative container mx-auto max-w-6xl px-4 py-20 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-orange-300">
                {t("hero.eyebrow")}
              </p>
              <Badge className="mb-6 border-white/20 bg-white/10 text-white backdrop-blur-sm">
                {t("hero.badge")}
              </Badge>
              <p className="mb-3 text-2xl font-bold tracking-wide text-white sm:text-3xl">
                {t("hero.productName")}
              </p>
              <h1 className="mb-6 whitespace-pre-line text-4xl font-bold leading-tight sm:text-5xl sm:[word-break:keep-all] lg:text-[2.7rem] xl:text-5xl">
                {t("hero.title")}
              </h1>
              <p className="mb-5 text-xl font-semibold text-orange-200 sm:text-2xl">
                {t("hero.subtitle")}
              </p>
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                {t("hero.description")}
              </p>
              <div className="mb-10 grid gap-3 sm:grid-cols-3">
                {heroProofs.map((proof) => (
                  <div key={proof} className="flex items-start gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-3 text-sm text-slate-100 backdrop-blur-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                    <span>{proof}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90" asChild>
                  <a href={contactUrl}>
                    {t("hero.buttons.contact")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" asChild>
                  <a href={demoUrl} target="_blank" rel="noreferrer">
                    {t("hero.buttons.demo")}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -left-4 top-8 w-[86%] overflow-hidden rounded-lg border border-white/10 opacity-70 shadow-2xl">
                <img src={previewImage} alt="AiGen-One portal preview" className="block w-full" />
              </div>
              <div className="relative ml-auto w-[88%] overflow-hidden rounded-lg border border-white/20 shadow-2xl">
                <img src={editorImage} alt="AiGen-One app editor" className="block w-full" />
              </div>
              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xl">
                <Blocks className="h-4 w-4 text-primary" />
                {t("hero.mockupLabel")}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-20 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              {t("concept.eyebrow")}
            </p>
            <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
              {t("concept.title")}
            </h2>
            <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">
              {t("concept.description")}
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.28, delayChildren: 0.08 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative mx-auto max-w-6xl"
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 28, scale: 0.985 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.62, ease: "easeOut" } },
                }}
              >
                <Card className="h-full overflow-hidden border-orange-100 bg-white shadow-xl">
                  <div className="relative min-h-[360px] overflow-hidden bg-slate-950 p-5 text-white sm:min-h-[390px]">
                    <img
                      src={talkToSystemImage}
                      alt="A business user speaks while AiGen-One creates a business system"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/86 via-slate-950/34 to-slate-950/62" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(249,115,22,0.24),transparent_30%)]" />
                    <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">01</div>
                    <div className="absolute left-[8%] top-[17%] w-[50%] max-w-md origin-top-left -skew-y-[1.5deg] rounded-lg border border-white/10 bg-slate-950/78 p-3 shadow-2xl backdrop-blur-sm sm:p-4">
                      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-300" />
                          <span className="h-2 w-2 rounded-full bg-sky-300" />
                          <span className="h-2 w-2 rounded-full bg-emerald-300" />
                        </div>
                        <span className="text-xs font-semibold text-slate-300">AiGen-One Builder</span>
                      </div>
                      <div className="mb-3 space-y-2">
                        <div className="ml-auto max-w-[78%] rounded-md rounded-tr-sm bg-orange-400 px-3 py-2 text-xs font-semibold text-white shadow">
                          {conceptSteps[0]?.example}
                        </div>
                        <div className="max-w-[74%] rounded-md rounded-tl-sm bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow">
                          {conceptSteps[0]?.response}
                        </div>
                      </div>
                      <div className="rounded-md bg-white/96 p-3 text-slate-900 shadow-lg">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <div className="h-2.5 w-24 rounded bg-slate-900" />
                            <div className="mt-2 h-2 w-36 rounded bg-slate-200" />
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <div className="rounded border border-slate-200 p-2">
                            <div className="mb-2 h-2 w-10 rounded bg-slate-300" />
                            <div className="h-7 rounded bg-slate-100" />
                          </div>
                          <div className="rounded border border-slate-200 p-2">
                            <div className="mb-2 h-2 w-12 rounded bg-slate-300" />
                            <div className="h-7 rounded bg-slate-100" />
                          </div>
                          <div className="rounded border border-slate-200 p-2">
                            <div className="mb-2 h-2 w-8 rounded bg-slate-300" />
                            <div className="h-7 rounded bg-orange-100" />
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2">
                          <div className="h-2 rounded bg-slate-100" />
                          <div className="h-2 w-5/6 rounded bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                        <Mic className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-primary">{conceptSteps[0]?.label}</p>
                    </div>
                    <h3 className="mb-3 text-xl font-bold leading-tight text-slate-950">{conceptSteps[0]?.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{conceptSteps[0]?.description}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 28, scale: 0.985 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.62, ease: "easeOut" } },
                }}
              >
                <Card className="h-full overflow-hidden border-sky-100 bg-white shadow-xl">
                  <div className="relative min-h-[360px] overflow-hidden bg-slate-950 p-5 sm:min-h-[390px]">
                    <img
                      src={featuresImage}
                      alt="Plugin apps are added to AiGen-One"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/82 via-white/48 to-slate-950/44" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(14,165,233,0.24),transparent_26%)]" />
                    <div className="absolute left-5 top-5 rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white shadow-sm">02</div>
                    <div className="relative mx-auto mt-10 max-w-md rounded-lg border border-white/60 bg-white/88 p-4 shadow-2xl backdrop-blur-md">
                      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                        <div>
                          <div className="h-3 w-28 rounded bg-slate-900" />
                          <div className="mt-2 h-2 w-40 rounded bg-slate-200" />
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-100">
                          <Store className="h-4 w-4 text-sky-700" />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {pluginExamples.slice(0, 4).map((item, i) => {
                          const Icon = pluginIcons[i % pluginIcons.length];
                          return (
                            <div key={item.title} className="group rounded-md border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-sky-200 hover:bg-sky-50">
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded bg-white shadow-sm">
                                  <Icon className="h-4 w-4 text-sky-700" />
                                </div>
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm">
                                  <Plus className="h-4 w-4" />
                                </div>
                              </div>
                              <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                              <p className="text-xs text-slate-500">{item.category}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-sky-600 text-white">
                        <Store className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-sky-700">{conceptSteps[1]?.label}</p>
                    </div>
                    <h3 className="mb-3 text-xl font-bold leading-tight text-slate-950">{conceptSteps[1]?.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{conceptSteps[1]?.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.985 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.62, ease: "easeOut" } },
              }}
              className="mx-auto mt-5 max-w-4xl"
            >
              <Card className="overflow-hidden border-slate-200 bg-white shadow-xl">
                <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
                  <div className="relative min-h-[330px] overflow-hidden bg-slate-950">
                    <img
                      src={heroImage}
                      alt="Employees use generated AI workflows from the AiGen-One portal"
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/36 via-slate-950/8 to-slate-950/60" />
                    <div className="absolute left-5 top-5 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">03</div>
                  </div>
                  <CardContent className="flex flex-col justify-center p-5 sm:p-7">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white">
                        <Users className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-orange-600">{conceptSteps[2]?.label}</p>
                    </div>
                    <h3 className="mb-3 text-xl font-bold leading-tight text-slate-950">{conceptSteps[2]?.title}</h3>
                    <p className="mb-5 text-sm leading-relaxed text-slate-600">{conceptSteps[2]?.description}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {conceptSteps[2]?.items?.map((item: string) => (
                        <div key={item} className="flex items-center gap-2 rounded-md bg-slate-100 p-3 text-sm font-semibold text-slate-700">
                          <CheckCircle className="h-4 w-4 shrink-0 text-orange-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30 py-20 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("problem.eyebrow")}
              </p>
              <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
                {t("problem.title")}
              </h2>
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                {t("problem.description")}
              </p>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {problemItems.map((item, i) => (
                <motion.div key={item.title} variants={itemVariants}>
                  <Card className="h-full">
                    <CardContent className="p-5">
                      <p className="mb-2 text-xs font-semibold text-primary">{String(i + 1).padStart(2, "0")}</p>
                      <h3 className="mb-2 font-semibold">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              {t("values.eyebrow")}
            </p>
            <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
              {t("values.title")}
            </h2>
            <p className="whitespace-pre-line text-muted-foreground">{t("values.description")}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {values.map((item, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <motion.div key={item.title} variants={itemVariants}>
                  <Card className="h-full hover-elevate">
                    <CardContent className="p-6">
                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="mb-3 text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-orange-300">
                {t("flow.eyebrow")}
              </p>
              <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
                {t("flow.title")}
              </h2>
              <p className="mb-8 leading-relaxed text-slate-300">{t("flow.description")}</p>
              <div className="overflow-hidden rounded-lg border border-white/10 shadow-2xl">
                <img src={featuresImage} alt="AiGen-One generated business app" className="w-full object-cover" />
              </div>
            </motion.div>

            <div className="space-y-4">
              {flowSteps.map((step, i) => {
                const Icon = flowIcons[i % flowIcons.length];
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-400/15 text-orange-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold text-orange-300">{step.number}</p>
                        <h3 className="mb-2 font-semibold">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-slate-300">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("marketplace.eyebrow")}
              </p>
              <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
                {t("marketplace.title")}
              </h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">{t("marketplace.description")}</p>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <Store className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t("marketplace.noteTitle")}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t("marketplace.note")}</p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {pluginExamples.map((plugin, i) => {
                const Icon = pluginIcons[i % pluginIcons.length];
                return (
                  <motion.div key={plugin.title} variants={itemVariants}>
                    <Card className="h-full">
                      <CardContent className="p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline" className="mb-3 text-xs">{plugin.category}</Badge>
                        <h3 className="mb-2 font-semibold">{plugin.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{plugin.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-muted/30 py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("architecture.eyebrow")}
              </p>
              <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
                {t("architecture.title")}
              </h2>
              <p className="leading-relaxed text-muted-foreground">{t("architecture.description")}</p>
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img src={securityImage} alt="AiGen-One enterprise governance" className="w-full object-cover" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {architectureLayers.map((layer, i) => {
              const Icon = architectureIcons[i % architectureIcons.length];
              return (
                <Card key={layer.title} className="h-full">
                  <CardContent className="p-5">
                    <Icon className="mb-4 h-5 w-5 text-primary" />
                    <h3 className="mb-2 text-sm font-semibold">{layer.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{layer.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              {t("useCases.eyebrow")}
            </p>
            <h2 className="mb-5 text-3xl font-bold leading-tight sm:text-4xl">{t("useCases.title")}</h2>
            <p className="text-muted-foreground">{t("useCases.description")}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {useCases.map((item, i) => {
              const Icon = useCaseIcons[i % useCaseIcons.length];
              return (
                <Card key={item.title} className="h-full">
                  <CardContent className="p-5">
                    <Icon className="mb-4 h-5 w-5 text-primary" />
                    <h3 className="mb-3 font-semibold">{item.title}</h3>
                    <ul className="space-y-2">
                      {item.points.map((point: string) => (
                        <li key={point} className="flex gap-2 text-sm leading-snug text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("roadmap.eyebrow")}
              </p>
              <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
                {t("roadmap.title")}
              </h2>
              <p className="leading-relaxed text-muted-foreground">{t("roadmap.description")}</p>
            </div>
            <div className="space-y-4">
              {roadmap.map((phase, i) => (
                <div key={phase.title} className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-[88px_1fr]">
                  <div className="flex items-center gap-3 sm:block">
                    <p className="text-xs font-semibold text-primary">{phase.label}</p>
                    <div className="mt-0 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary sm:mt-3">
                      {i + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">{phase.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("governance.eyebrow")}
              </p>
              <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
                {t("governance.title")}
              </h2>
              <p className="leading-relaxed text-muted-foreground">{t("governance.description")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {governance.map((item, i) => {
                const Icon = governanceIcons[i % governanceIcons.length];
                return (
                  <div key={item.title} className="rounded-lg border border-border bg-card p-5">
                    <Icon className="mb-4 h-5 w-5 text-primary" />
                    <h3 className="mb-2 font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              {t("pricing.eyebrow")}
            </p>
            <h2 className="mb-5 text-3xl font-bold leading-tight sm:text-4xl">
              {t("pricing.title")}
            </h2>
            <p className="leading-relaxed text-muted-foreground">{t("pricing.description")}</p>
          </motion.div>

          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/60">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("pricing.tableHeaders.plan")}
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("pricing.tableHeaders.monthly")}
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("pricing.tableHeaders.target")}
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("pricing.tableHeaders.features")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingPlans.map((plan) => (
                      <tr key={plan.plan} className="border-b border-border last:border-0">
                        <td className="px-5 py-5 align-top font-semibold">{plan.plan}</td>
                        <td className="whitespace-nowrap px-5 py-5 text-right align-top font-semibold text-primary">{plan.monthly}</td>
                        <td className="px-5 py-5 align-top text-muted-foreground">{plan.target}</td>
                        <td className="px-5 py-5 align-top leading-relaxed text-muted-foreground">{plan.features}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card>
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <CircleDollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{t("pricing.baseTitle")}</h3>
                </div>
                <div className="space-y-3">
                  {pricingBaseFees.map((fee) => (
                    <div key={fee.item} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                      <span className="text-sm text-muted-foreground">{fee.item}</span>
                      <span className="whitespace-nowrap text-sm font-semibold">{fee.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">{t("pricing.aiUserTitle")}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{t("pricing.aiUserDescription")}</p>
                <div className="mb-5 rounded-md border border-primary/20 bg-primary/5 p-4 text-sm font-semibold leading-relaxed text-primary">
                  {t("pricing.aiUserQuote")}
                </div>
                <h3 className="mb-3 text-lg font-semibold">{t("pricing.policyTitle")}</h3>
                <ul className="space-y-2">
                  {pricingNotes.map((note) => (
                    <li key={note} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white sm:py-28">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 border-white/20 bg-white/10 text-white">
              <Rocket className="mr-2 h-3.5 w-3.5" />
              {t("cta.badge")}
            </Badge>
            <h2 className="mb-5 whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl leading-relaxed text-slate-300">{t("cta.description")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90" asChild>
                <a href={contactUrl}>
                  {t("cta.buttons.contact")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" asChild>
                <a href={demoUrl} target="_blank" rel="noreferrer">
                  {t("cta.buttons.demo")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
