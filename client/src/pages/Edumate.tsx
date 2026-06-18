import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserPlus,
  Users,
  BookOpen,
  Upload,
  Brain,
  Bell,
  Share2,
  BarChart3,
  Shield,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  FileText,
  MessageCircle,
  ThumbsUp,
  Lightbulb,
  HelpCircle,
  Eye,
  Lock,
  Smartphone
} from "lucide-react";
import studentsStudyingImage from '@assets/stock_images/students_studying_to_59088470.jpg';
import edumateEnterFlowImage from '@assets/Edumente_enter_flow_1759236054934.png';
import edumateTopImage from '@assets/eduMate_top_1759236301458.png';
import edumateEnterResultImage from '@assets/Edumente_enter_result_1759236794018.png';
import remindImage from '@assets/remind_1759237406830.png';
import shareImage from '@assets/共有_1759239992867.png';
import progressImage from '@assets/EduMate_Progress_1759241303889.png';

export default function Edumate() {
  const { t } = useTranslation('edumate');
  
  useEffect(() => {
    document.title = t('meta.title');
    
    // Set meta description
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

  const features = [
    {
      icon: <Upload className="w-8 h-8 text-orange-500" />,
      title: t('mainFeatures.upload.title'),
      description: t('mainFeatures.upload.description'),
      details: t('mainFeatures.upload.details', { returnObjects: true })
    },
    {
      icon: <Brain className="w-8 h-8 text-orange-500" />,
      title: t('mainFeatures.aiConversion.title'),
      description: t('mainFeatures.aiConversion.description'),
      details: t('mainFeatures.aiConversion.details', { returnObjects: true })
    },
    {
      icon: <Bell className="w-8 h-8 text-orange-500" />,
      title: t('mainFeatures.reminder.title'),
      description: t('mainFeatures.reminder.description'),
      details: t('mainFeatures.reminder.details', { returnObjects: true })
    },
    {
      icon: <Share2 className="w-8 h-8 text-orange-500" />,
      title: t('mainFeatures.sharing.title'),
      description: t('mainFeatures.sharing.description'),
      details: t('mainFeatures.sharing.details', { returnObjects: true })
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      title: t('mainFeatures.analytics.title'),
      description: t('mainFeatures.analytics.description'),
      details: t('mainFeatures.analytics.details', { returnObjects: true })
    },
    {
      icon: <Eye className="w-8 h-8 text-orange-500" />,
      title: t('mainFeatures.parentLogin.title'),
      description: t('mainFeatures.parentLogin.description'),
      details: t('mainFeatures.parentLogin.details', { returnObjects: true })
    }
  ];

  const steps = [
    {
      number: "1",
      title: t('howToUse.steps.input.title'),
      description: t('howToUse.steps.input.description'),
      icon: <Upload className="w-6 h-6" />
    },
    {
      number: "2", 
      title: t('howToUse.steps.ai.title'),
      description: t('howToUse.steps.ai.description'),
      icon: <Brain className="w-6 h-6" />
    },
    {
      number: "3",
      title: t('howToUse.steps.reminder.title'),
      description: t('howToUse.steps.reminder.description'),
      icon: <Bell className="w-6 h-6" />
    }
  ];

  const faqs = t('faq.questions', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={studentsStudyingImage}
            alt="Students studying together background"
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
              EduMate
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('heroDescription')}
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
        {/* Hero Section with What is Edumate */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200" data-testid="badge-product">
                学習継続支援プラットフォーム
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" data-testid="text-title">
                Edumate
              </h1>
              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
                  勉強も、友達も、大切にできる。
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-8" data-testid="text-description">
                  ふたりで学んで、ちゃんと続く。保護者にも見える安心設計。
                </p>
              </div>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-10 h-10" />
                    <h2 className="text-xl lg:text-2xl font-bold">Edumateとは？</h2>
                  </div>
                  <p className="text-base leading-relaxed mb-4 text-orange-100">
                    中高生のペア（例：あなたと友達）が今日の学びをAIで"要点カード"に自動変換。翌日のワンポイント復習と、ふたりだけの共有＆リアクションで学習を"続けやすく"します。
                  </p>
                  <div className="bg-orange-400/20 rounded-lg p-3">
                    <p className="text-sm text-orange-100">
                      保護者向けに"学習時間・復習達成率・継続日数"だけを見られる"ママログイン"を用意。やり取りの中身は見えません。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <img 
                src={edumateTopImage} 
                alt="EduMate - 勉強と友情を両立する学習アプリ" 
                className="w-full max-w-lg rounded-lg shadow-xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Target Users Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-target-users">
            {t('targetUsers.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate text-center">
              <CardContent className="p-6">
                <Users className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('targetUsers.studentA.title')}</h3>
                <p className="text-gray-600">{t('targetUsers.studentA.description')}</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate text-center">
              <CardContent className="p-6">
                <UserPlus className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('targetUsers.studentB.title')}</h3>
                <p className="text-gray-600">{t('targetUsers.studentB.description')}</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate text-center">
              <CardContent className="p-6">
                <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('targetUsers.parent.title')}</h3>
                <p className="text-gray-600">{t('targetUsers.parent.description')}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* How to Use Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-how-to-use">
            {t('howToUse.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="hover-elevate h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-orange-600">{step.number}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="text-orange-500">{step.icon}</div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Features Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-main-features">
            {t('mainFeatures.title')}
          </h2>
          <div className="grid gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    {(index === 0 || index === 1 || index === 2 || index === 3 || index === 4) ? (
                      <div className="grid lg:grid-cols-2 gap-6 items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            {feature.icon}
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-4">{feature.description}</p>
                          <div className="grid gap-3">
                            {(feature.details as string[]).map((detail: string, detailIndex: number) => (
                              <div key={detailIndex} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <img 
                            src={
                              index === 0 ? edumateEnterFlowImage : 
                              index === 1 ? edumateEnterResultImage : 
                              index === 2 ? remindImage : 
                              index === 3 ? shareImage : 
                              progressImage
                            }
                            alt={
                              index === 0 ? "EduMate学習内容入力フロー" : 
                              index === 1 ? "AIによる要点カード変換結果" : 
                              index === 2 ? "翌日リマインド機能" : 
                              index === 3 ? "共有された学習内容" : 
                              "学習の進捗状況"
                            }
                            className={index === 0 ? "rounded-lg shadow-lg" : "w-full max-w-sm rounded-lg shadow-lg"}
                            style={index === 0 ? { height: '140px' } : undefined}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-1">
                          <div className="flex items-center gap-3 mb-4">
                            {feature.icon}
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-4">{feature.description}</p>
                        </div>
                        <div className="lg:col-span-2">
                          <div className="grid sm:grid-cols-2 gap-3">
                            {(feature.details as string[]).map((detail: string, detailIndex: number) => (
                              <div key={detailIndex} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Problems Solved Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-problems-solved">
            {t('problemsSolved.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <Target className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="font-semibold mb-2">{t('problemsSolved.continuity.title')}</h3>
                <p className="text-gray-600 text-sm">{t('problemsSolved.continuity.description')}</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <Lightbulb className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="font-semibold mb-2">{t('problemsSolved.meaning.title')}</h3>
                <p className="text-gray-600 text-sm">{t('problemsSolved.meaning.description')}</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="font-semibold mb-2">{t('problemsSolved.parentAnxiety.title')}</h3>
                <p className="text-gray-600 text-sm">{t('problemsSolved.parentAnxiety.description')}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Safety & Privacy Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-safety-privacy">
            {t('safetyPrivacy.title')}
          </h2>
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{t('safetyPrivacy.limitedSharing.title')}</h3>
                  <p className="text-sm text-gray-600">{t('safetyPrivacy.limitedSharing.description')}</p>
                </div>
                <div>
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{t('safetyPrivacy.privacyProtection.title')}</h3>
                  <p className="text-sm text-gray-600">{t('safetyPrivacy.privacyProtection.description')}</p>
                </div>
                <div>
                  <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{t('safetyPrivacy.dataManagement.title')}</h3>
                  <p className="text-sm text-gray-600">{t('safetyPrivacy.dataManagement.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-faq">
            {t('faq.title')}
          </h2>
          <div className="grid gap-4 max-w-3xl mx-auto">
            {(faqs as Array<{question: string, answer: string}>).map((faq: {question: string, answer: string}, index: number) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div className="text-center" variants={itemVariants}>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-12">
              <Users className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6" data-testid="text-cta-title">
                {t('cta.title')}
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-orange-600 border-white hover:bg-orange-50"
                  data-testid="button-cta-free-trial"
                >
                  無料で使ってみる
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-orange-600"
                  data-testid="button-cta-demo"
                >
                  デモを見る
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}