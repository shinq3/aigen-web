import { motion } from "framer-motion";
import { Link } from "wouter";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building,
  Users,
  Shield,
  MessageSquare,
  FileText,
  Search,
  BarChart3,
  Settings,
  CheckCircle,
  Globe,
  Brain,
  Lock,
  Bot,
  Zap,
  Calendar,
  UserCheck,
  FileCheck,
  Monitor,
  Target,
  Workflow,
  BookOpen,
  Newspaper,
  Video,
  Languages,
  TrendingUp,
  Key
} from "lucide-react";
import enterpriseProjectImage from '@assets/stock_images/enterprise_project_m_feeadfd1.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function EnterpriseLLM() {
  const { t } = useTranslation('enterprise-llm');
  
  useEffect(() => {
    document.title = t('meta.title');
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('meta.description');
      document.head.appendChild(meta);
    }
  }, [t]);

  const featuresData = t('features', { returnObjects: true }) as any[];
  const features = featuresData.map((feature, index) => ({
    ...feature,
    icon: [
      <Shield className="w-8 h-8 text-orange-500" />,
      <Building className="w-8 h-8 text-orange-500" />,
      <Target className="w-8 h-8 text-orange-500" />,
      <CheckCircle className="w-8 h-8 text-orange-500" />,
      <MessageSquare className="w-8 h-8 text-orange-500" />,
      <BookOpen className="w-8 h-8 text-orange-500" />,
      <Newspaper className="w-8 h-8 text-orange-500" />,
      <Video className="w-8 h-8 text-orange-500" />,
      <Search className="w-8 h-8 text-orange-500" />,
      <Bot className="w-8 h-8 text-orange-500" />,
      <Languages className="w-8 h-8 text-orange-500" />,
      <BarChart3 className="w-8 h-8 text-orange-500" />
    ][index] || <Shield className="w-8 h-8 text-orange-500" />
  }));

  const systemFeaturesData = t('systemFeatures', { returnObjects: true }) as any[];
  const systemFeatures = systemFeaturesData.map((feature, index) => ({
    ...feature,
    icon: [
      <Settings className="w-6 h-6 text-orange-500" />,
      <Monitor className="w-6 h-6 text-orange-500" />,
      <Key className="w-6 h-6 text-orange-500" />,
      <Lock className="w-6 h-6 text-orange-500" />
    ][index] || <Settings className="w-6 h-6 text-orange-500" />
  }));

  const pricingData = t('pricing', { returnObjects: true }) as any;
  const plans = pricingData.plans.map((plan: any, index: number) => ({
    ...plan,
    recommended: index === 1 // Professional plan (second plan) is recommended
  }));

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={enterpriseProjectImage}
            alt="Enterprise project management background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-primary/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200" data-testid="badge-status">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-white" data-testid="text-title">
              {t('hero.title')}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              {t('hero.subtitle')}<br />
              {t('hero.tagline')}
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-4xl mx-auto">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Button asChild size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-demo">
                <Link href="/contact">
                  デモを予約
                </Link>
              </Button> */}
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10" data-testid="button-more-info">
                <Link href="/contact">
                  {t('hero.buttons.contact')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-features-title">
              {t('coreFeatures.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('coreFeatures.subtitle')}
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* System Management */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {t('systemManagement.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('systemManagement.subtitle')}
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {systemFeatures.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center h-full hover-elevate">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing - Hidden as requested */}
      {/* 
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-pricing-title">
              {pricingData.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {pricingData.subtitle}
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className={`h-full relative ${plan.recommended ? 'border-primary shadow-lg' : ''} hover-elevate`}>
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">{pricingData.recommendedBadge}</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      asChild 
                      className={`w-full mt-6 ${plan.recommended ? 'bg-primary hover:bg-primary/90' : 'variant-outline'}`}
                      data-testid={`button-plan-${plan.name.toLowerCase()}`}
                    >
                      <Link href="/contact">
                        {plan.buttonText}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-orange-600/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-contact">
                <Link href="/contact">
                  {t('cta.buttons.contact')}
                </Link>
              </Button>
              {/* <Button asChild variant="outline" size="lg" data-testid="button-demo-schedule">
                <Link href="/contact">
                  デモンストレーション予約
                </Link>
              </Button> */}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}