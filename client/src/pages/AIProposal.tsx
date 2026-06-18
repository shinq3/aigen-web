import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { 
  Brain, 
  Lightbulb, 
  Users, 
  Target,
  MessageSquare,
  Mic,
  FileText,
  Video,
  Image as ImageIcon,
  Wifi,
  Search,
  FileSearch,
  Database,
  CheckCircle,
  Sparkles
} from "lucide-react";
import aiHeroImage from '@assets/A_vibrant_and_welcoming_scene_1759365957401.png';

export default function AIProposal() {
  const { t } = useTranslation('ai-proposal');
  
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

  const uiExamples = [
    { icon: <MessageSquare className="w-5 h-5" />, text: t('uiux.examples.chat') },
    { icon: <Mic className="w-5 h-5" />, text: t('uiux.examples.voice') },
    { icon: <FileText className="w-5 h-5" />, text: t('uiux.examples.handwriting') },
    { icon: <Video className="w-5 h-5" />, text: t('uiux.examples.video') },
    { icon: <ImageIcon className="w-5 h-5" />, text: t('uiux.examples.image') },
    { icon: <Wifi className="w-5 h-5" />, text: t('uiux.examples.iot') },
  ];

  const ragExamples = [
    { icon: <Search className="w-5 h-5" />, text: t('rag.examples.dictionary') },
    { icon: <Lightbulb className="w-5 h-5" />, text: t('rag.examples.knowledge') },
    { icon: <Database className="w-5 h-5" />, text: t('rag.examples.analytics') },
    { icon: <MessageSquare className="w-5 h-5" />, text: t('rag.examples.faq') },
    { icon: <FileSearch className="w-5 h-5" />, text: t('rag.examples.regulations') },
    { icon: <FileText className="w-5 h-5" />, text: t('rag.examples.minutes') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={aiHeroImage}
            alt="AI collaboration background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 40%' }}
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
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-base px-4 py-1" data-testid="badge-ai">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white" data-testid="text-hero-title">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('hero.description1')}<br />
              {t('hero.description2')}
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
        {/* Section 1: 発想の転換 */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-10 h-10 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900">{t('paradigmShift.title')}</h2>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('paradigmShift.description1')}<br />
                {t('paradigmShift.description2').split('{strong1}')[0]}
                <strong className="text-orange-600">{t('paradigmShift.description2').split('{strong1}')[1].split('{strong1End}')[0]}</strong>
                {t('paradigmShift.description2').split('{strong1End}')[1]}<br />
                {t('paradigmShift.description3').split('{strong2}')[0]}
                <strong className="text-orange-600">{t('paradigmShift.description3').split('{strong2}')[1].split('{strong2End}')[0]}</strong>
                {t('paradigmShift.description3').split('{strong2End}')[1]}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-6 h-6 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">{t('paradigmShift.objectiveData.title')}</h3>
                    </div>
                    <p className="text-blue-800">{t('paradigmShift.objectiveData.description')}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-6 h-6 text-purple-600" />
                      <h3 className="font-semibold text-purple-900">{t('paradigmShift.subjectiveData.title')}</h3>
                    </div>
                    <p className="text-purple-800">{t('paradigmShift.subjectiveData.description')}</p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {t('paradigmShift.conclusion')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 2: UI/UXの固定観念を超える */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-10 h-10 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900">{t('uiux.title')}</h2>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('uiux.description1')}<br />
                {t('uiux.description2')}
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('uiux.description3').split('{strong}')[0]}
                <strong className="text-orange-600">{t('uiux.description3').split('{strong}')[1].split('{strongEnd}')[0]}</strong>
                {t('uiux.description3').split('{strongEnd}')[1]}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('uiux.examplesTitle')}</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {uiExamples.map((example, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 hover-elevate">
                    <div className="text-orange-500 mt-0.5 flex-shrink-0">
                      {example.icon}
                    </div>
                    <p className="text-gray-700">{example.text}</p>
                  </div>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <p className="text-lg font-semibold">
                    {t('uiux.keyMessage')}
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 3: RAGによる社内知識の活用 */}
        <motion.div className="mb-16" variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-10 h-10 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900">{t('rag.title')}</h2>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('rag.description1')}<br />
                {t('rag.description2').split('{strong}')[0]}
                <strong className="text-orange-600">{t('rag.description2').split('{strong}')[1].split('{strongEnd}')[0]}</strong>
                {t('rag.description2').split('{strongEnd}')[1]}
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('rag.description3').split('{strong}')[0]}
                <strong className="text-orange-600">{t('rag.description3').split('{strong}')[1].split('{strongEnd}')[0]}</strong>
                {t('rag.description3').split('{strongEnd}')[1]}<br />
                {t('rag.description4').split('{strong}')[0]}
                <strong className="text-orange-600">{t('rag.description4').split('{strong}')[1].split('{strongEnd}')[0]}</strong>
                {t('rag.description4').split('{strongEnd}')[1]}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('rag.examplesTitle')}</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {ragExamples.map((example, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 hover-elevate">
                    <div className="text-blue-600 mt-0.5 flex-shrink-0">
                      {example.icon}
                    </div>
                    <p className="text-gray-700">{example.text}</p>
                  </div>
                ))}
              </div>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 mb-2">
                        {t('rag.hallucination1').split('{strong}')[0]}
                        <strong className="text-blue-900">{t('rag.hallucination1').split('{strong}')[1].split('{strongEnd}')[0]}</strong>
                        {t('rag.hallucination1').split('{strongEnd}')[1]}
                      </p>
                      <p className="text-gray-800">
                        {t('rag.hallucination2')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 4: 結論 */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
            <CardContent className="p-8 lg:p-12 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-10 h-10 text-white" />
                <h2 className="text-3xl font-bold">{t('conclusion.title')}</h2>
              </div>
              
              <p className="text-xl leading-relaxed mb-8 text-orange-50">
                {t('conclusion.description')}<br />
                <strong className="text-white">{t('conclusion.keyMessage')}</strong>{t('conclusion.keyMessageSuffix')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  <p className="text-lg text-orange-50">{t('conclusion.points.efficiency')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  <p className="text-lg text-orange-50">{t('conclusion.points.system')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  <p className="text-lg text-orange-50">
                    {t('conclusion.points.partner').split('{strong}')[0]}
                    <strong className="text-white">{t('conclusion.points.partner').split('{strong}')[1].split('{strongEnd}')[0]}</strong>
                    {t('conclusion.points.partner').split('{strongEnd}')[1]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
