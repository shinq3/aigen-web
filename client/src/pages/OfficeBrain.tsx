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
  Image,
  BarChart3,
  Settings,
  CheckCircle,
  Globe,
  Brain,
  Lock,
  Upload,
  Bot,
  Zap,
  Eye,
  UserCheck,
  FileCheck,
  Monitor
} from "lucide-react";
import modernOfficeImage from '@assets/stock_images/modern_office_meetin_f1d8354c.jpg';

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

export default function OfficeBrain() {
  const { t } = useTranslation('officebrain');
  
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
  const features = t('features.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    details: string[];
  }>;
  
  const featuresWithIcons = [
    <Users className="w-8 h-8 text-orange-500" />,
    <MessageSquare className="w-8 h-8 text-orange-500" />,
    <FileText className="w-8 h-8 text-orange-500" />,
    <Search className="w-8 h-8 text-orange-500" />,
    <Image className="w-8 h-8 text-orange-500" />,
    <BarChart3 className="w-8 h-8 text-orange-500" />,
    <Settings className="w-8 h-8 text-orange-500" />,
    <CheckCircle className="w-8 h-8 text-orange-500" />,
    <Globe className="w-8 h-8 text-orange-500" />
  ];

  const stepsData = t('howToUse.steps', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;
  
  const steps = stepsData.map((step, index) => ({
    number: (index + 1).toString(),
    title: step.title,
    description: step.description,
    icon: [<UserCheck className="w-6 h-6" />, <Bot className="w-6 h-6" />, <BarChart3 className="w-6 h-6" />][index]
  }));

  const benefitsData = t('benefits.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;
  
  const benefits = benefitsData.map((benefit, index) => ({
    icon: [<Shield className="w-12 h-12 text-orange-500" />, <Zap className="w-12 h-12 text-orange-500" />, <Eye className="w-12 h-12 text-orange-500" />][index],
    title: benefit.title,
    description: benefit.description
  }));

  const useCasesData = t('useCases.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;
  
  const useCases = useCasesData.map((useCase, index) => ({
    title: useCase.title,
    description: useCase.description,
    icon: [<Building className="w-8 h-8 text-orange-500" />, <Users className="w-8 h-8 text-orange-500" />, <Monitor className="w-8 h-8 text-orange-500" />][index]
  }));

  const faqs = t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={modernOfficeImage}
            alt="Modern office meeting background"
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
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
        {/* Hero Section */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200" data-testid="badge-product">
            {t('hero.badge')}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" data-testid="text-title">
            {t('hero.mainTitle')}
          </h1>
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
              {t('hero.tagline')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="text-description">
              {t('hero.description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" data-testid="button-contact">
              <Link href="/contact">{t('hero.buttons.contact')}</Link>
            </Button>
            {/* <Button asChild size="lg" variant="outline" data-testid="button-demo">
              <Link href="/contact">デモを見る</Link>
            </Button> */}
          </div>
        </motion.div>

        {/* What is Office Brain Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-6">
                <Brain className="w-12 h-12" />
                <h2 className="text-2xl lg:text-3xl font-bold">{t('whatIs.title')}</h2>
              </div>
              <p className="text-lg leading-relaxed mb-6 text-orange-100">
                {t('whatIs.description')}
              </p>
              <div className="bg-orange-400/20 rounded-lg p-4">
                <p className="font-semibold text-orange-100">
                  {t('whatIs.note')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12">{t('benefits.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full text-center hover-elevate">
                  <CardContent className="p-8">
                    <div className="mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Use Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12">{t('howToUse.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {step.number}
                      </div>
                      {step.icon}
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12">{t('features.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {featuresWithIcons[index]}
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12">{t('useCases.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover-elevate">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      {useCase.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                    <p className="text-gray-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12">{t('faq.title')}</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                      Q. {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      A. {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div className="text-center" variants={itemVariants}>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-12">
              <Brain className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6" data-testid="text-cta-title">
                {t('cta.title')}
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" data-testid="button-contact-officebrain">
                  <Link href="/contact">{t('cta.buttons.contact')}</Link>
                </Button>
                {/* <Button asChild size="lg" variant="outline" data-testid="button-trial-cta">
                  <Link href="/contact">無料トライアル</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}