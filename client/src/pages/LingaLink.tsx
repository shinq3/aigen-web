import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Video, 
  Share2, 
  Brain, 
  FileText, 
  Clock, 
  Globe, 
  Mic, 
  MessageSquare,
  Sparkles,
  CheckCircle
} from "lucide-react";
import heroImage from "@assets/image_1758941074318.png";
import onlineLearningImage from '@assets/stock_images/online_learning_educ_92e4c234.jpg';
import reserveImage from '@assets/reserve_1759271037984.png';
import reviewImage from '@assets/review_1759271316548.png';
import historyImage from '@assets/history_1759272285550.png';

export default function LingaLink() {
  const { t } = useTranslation('lingalink');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={onlineLearningImage}
            alt="Online learning background"
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
        {/* Product Overview */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200" data-testid="badge-product">
                {t('hero.badge')}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" data-testid="text-title">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8" data-testid="text-description">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* <Button size="lg" className="bg-orange-500 hover:bg-orange-600" data-testid="button-hero-demo">
                  無料デモを試す
                </Button> */}
                <Button size="lg" variant="outline" data-testid="button-hero-learn-more">
                  {t('hero.buttons.learnMore')}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl" data-testid="img-hero">
                <img 
                  src={heroImage} 
                  alt="LingaLink - 英語でつながる、新しい毎日へ" 
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              </div>
              {/* Floating elements for visual enhancement */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-400 rounded-full opacity-30 animate-pulse delay-700" />
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <GraduationCap className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('summary.students.title')}</h3>
                  <p className="text-orange-100">{t('summary.students.description')}</p>
                </div>
                <div>
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('summary.teachers.title')}</h3>
                  <p className="text-orange-100">{t('summary.teachers.description')}</p>
                </div>
                <div>
                  <Sparkles className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('summary.ai.title')}</h3>
                  <p className="text-orange-100">{t('summary.ai.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Features */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-student-features">
            🎯 {t('studentFeatures.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-elevate md:col-span-2">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-2 gap-6 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-8 h-8 text-orange-500" />
                      <h3 className="text-lg font-semibold">{t('studentFeatures.booking.title')}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{t('studentFeatures.booking.description1')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Video className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{t('studentFeatures.booking.description2')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <img 
                      src={reserveImage}
                      alt="LingaLinkレッスン予約画面"
                      className="w-full max-w-sm rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-orange-500" />
                  <CardTitle>{t('studentFeatures.aiSummary.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{t('studentFeatures.aiSummary.description1')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{t('studentFeatures.aiSummary.description2')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate md:col-span-2">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-2 gap-6 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-8 h-8 text-orange-500" />
                      <h3 className="text-lg font-semibold">{t('studentFeatures.learningRecord.title')}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{t('studentFeatures.learningRecord.description1')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mic className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{t('studentFeatures.learningRecord.description2')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <img 
                      src={historyImage}
                      alt="LingaLink学習記録画面"
                      className="w-full max-w-sm rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate md:col-span-2">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-2 gap-6 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <MessageSquare className="w-8 h-8 text-orange-500" />
                      <h3 className="text-lg font-semibold">{t('studentFeatures.collaboration.title')}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{t('studentFeatures.collaboration.description1')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{t('studentFeatures.collaboration.description2')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <img 
                      src={reviewImage}
                      alt="LingaLink共同作業ツール画面"
                      className="w-full max-w-sm rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Teacher Features */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-teacher-features">
            👩‍🏫 {t('teacherFeatures.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-orange-500" />
                  <CardTitle>{t('teacherFeatures.schedule.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{t('teacherFeatures.schedule.description')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-orange-500" />
                  <CardTitle>{t('teacherFeatures.materialCreation.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{t('teacherFeatures.materialCreation.description1')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{t('teacherFeatures.materialCreation.description2')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-orange-500" />
                  <CardTitle>{t('teacherFeatures.materialManagement.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{t('teacherFeatures.materialManagement.description1')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{t('teacherFeatures.materialManagement.description2')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Common Features */}
        <motion.div className="mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900" data-testid="text-common-features">
            🤝 {t('commonFeatures.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-elevate text-center">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('commonFeatures.multilingual.title')}</h3>
                <p className="text-gray-600 text-sm">{t('commonFeatures.multilingual.description')}</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center">
              <CardContent className="p-6">
                <Video className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('commonFeatures.videoCall.title')}</h3>
                <p className="text-gray-600 text-sm">{t('commonFeatures.videoCall.description')}</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center">
              <CardContent className="p-6">
                <Share2 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('commonFeatures.screenShare.title')}</h3>
                <p className="text-gray-600 text-sm">{t('commonFeatures.screenShare.description')}</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('commonFeatures.reminder.title')}</h3>
                <p className="text-gray-600 text-sm">{t('commonFeatures.reminder.description')}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div className="text-center" variants={itemVariants}>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-12">
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
                  data-testid="button-demo"
                >
                  無料デモを試す
                </Button> */}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-orange-600"
                  data-testid="button-contact"
                >
                  {t('cta.buttons.contact')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}