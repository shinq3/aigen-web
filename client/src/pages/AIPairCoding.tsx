import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { 
  Code2, 
  MessageSquare, 
  Zap,
  Users,
  Clock,
  Target,
  CheckCircle,
  ArrowRight,
  Mail
} from "lucide-react";
import aiCodingHeroImage from '@assets/A_vibrant_and_welcoming_scene_1759365957401.png';

export default function AIPairCoding() {
  const { t } = useTranslation('ai-pair-coding');
  
  useEffect(() => {
    document.title = t('meta.title');
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'));
    }
  }, [t]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const processSteps = [
    { 
      icon: <MessageSquare className="w-6 h-6" />, 
      title: t('process.steps.conversation.title'),
      description: t('process.steps.conversation.description')
    },
    { 
      icon: <Target className="w-6 h-6" />, 
      title: t('process.steps.features.title'),
      description: t('process.steps.features.description')
    },
    { 
      icon: <Code2 className="w-6 h-6" />, 
      title: t('process.steps.prototype.title'),
      description: t('process.steps.prototype.description')
    },
    { 
      icon: <CheckCircle className="w-6 h-6" />, 
      title: t('process.steps.review.title'),
      description: t('process.steps.review.description')
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      title: t('benefits.speed.title'),
      description: t('benefits.speed.description')
    },
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: t('benefits.accuracy.title'),
      description: t('benefits.accuracy.description')
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: t('benefits.evolution.title'),
      description: t('benefits.evolution.description'),
      list: [
        t('benefits.evolution.list.pm'),
        t('benefits.evolution.list.engineer'),
        t('benefits.evolution.list.designer')
      ]
    }
  ];

  const comparisonData = [
    {
      aspect: t('comparison.rows.requirements'),
      traditional: t('comparison.traditional.requirements'),
      aiPair: t('comparison.aiPair.requirements')
    },
    {
      aspect: t('comparison.rows.design'),
      traditional: t('comparison.traditional.design'),
      aiPair: t('comparison.aiPair.design')
    },
    {
      aspect: t('comparison.rows.prototype'),
      traditional: t('comparison.traditional.prototype'),
      aiPair: t('comparison.aiPair.prototype')
    },
    {
      aspect: t('comparison.rows.changes'),
      traditional: t('comparison.traditional.changes'),
      aiPair: t('comparison.aiPair.changes')
    },
    {
      aspect: t('comparison.rows.team'),
      traditional: t('comparison.traditional.team'),
      aiPair: t('comparison.aiPair.team')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0">
          <img
            src={aiCodingHeroImage}
            alt="AI Pair Coding background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-primary/20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-base px-4 py-1" data-testid="badge-ai-pair-coding">
              <Code2 className="w-4 h-4 inline mr-2" />
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white" data-testid="text-hero-title">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="container mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Introduction Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid="text-intro-title">
                {t('intro.title')}
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>{t('intro.paragraph1')}</p>
                <p>{t('intro.paragraph2')}</p>
                <p>{t('intro.paragraph3')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What is AI Pair Coding */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-10 h-10 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900">{t('definition.title')}</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('definition.description')}
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('process.title')}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex gap-4" data-testid={`process-step-${index}`}>
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">{index + 1}. {step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('benefits.title')}</h2>
              
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} data-testid={`benefit-${index}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{index + 1}. {benefit.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
                        {benefit.list && (
                          <ul className="mt-3 space-y-2">
                            {benefit.list.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-600">
                                <ArrowRight className="w-4 h-4 text-orange-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparison Table */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('comparison.title')}</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="comparison-table">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-bold text-gray-900">{t('comparison.headers.aspect')}</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">{t('comparison.headers.traditional')}</th>
                      <th className="text-left py-4 px-4 font-bold text-orange-600">{t('comparison.headers.aiPair')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-4 font-semibold text-gray-700">{row.aspect}</td>
                        <td className="py-4 px-4 text-gray-600">{row.traditional}</td>
                        <td className="py-4 px-4 text-gray-900 font-medium">{row.aiPair}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Use Cases */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('useCases.title')}</h2>
              <ul className="space-y-3">
                {(t('useCases.list', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3" data-testid={`use-case-${index}`}>
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why Now */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('whyNow.title')}</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>{t('whyNow.paragraph1')}</p>
                <p className="text-xl font-semibold text-orange-600">{t('whyNow.quote')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact CTA */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">{t('contact.title')}</h2>
              <p className="text-white/90 mb-6 text-lg">
                {t('contact.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Link href="/ja/contact">
                  <Button 
                    size="lg" 
                    className="bg-white text-orange-600 hover:bg-gray-100"
                    data-testid="button-contact"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {t('contact.button')}
                  </Button>
                </Link>
              </div>
              <div className="text-white/90">
                <p className="mb-1">{t('contact.email')}</p>
                <p className="font-semibold">{t('contact.person')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
