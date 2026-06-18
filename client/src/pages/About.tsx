import { motion } from "framer-motion";
import { Target, Users, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import teamCollaborationImage from '@assets/stock_images/team_collaboration_o_e582d717.jpg';
import uchidaShinImage from '@assets/shin_s_1759098530802.png';
import michaelItoImage from '@assets/michael_ito_gaijin_1759376666630.png';
import johnKanekoImage from '@assets/generated_images/John_Kaneko_portrait_illustration_92d03ae4.png';
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function About() {
  const { t } = useTranslation('about');
  
  useEffect(() => {
    document.title = t('meta.title') || "私たちについて | D'auchy.Studio";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description') || 'D\'achy.Studioの情報、ミッション、価値観、チーム、歩みについて紹介します。');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('meta.description') || 'D\'achy.Studioの情報、ミッション、価値観、チーム、歩みについて紹介します。';
      document.head.appendChild(meta);
    }
  }, [t]);

  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: t('values.items.0.title', { returnObjects: false }) || "イノベーション",
      description: t('values.items.0.description', { returnObjects: false }) || "最新のAI技術を活用し、従来の課題を解決する革新的なソリューションを提供します。"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: t('values.items.1.title', { returnObjects: false }) || "ユーザー中心", 
      description: t('values.items.1.description', { returnObjects: false }) || "ユーザーのニーズを深く理解し、真に価値のある体験を設計・開発します。"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: t('values.items.2.title', { returnObjects: false }) || "創造性",
      description: t('values.items.2.description', { returnObjects: false }) || "クリエイティブな思考とテクノロジーを組み合わせ、新しい可能性を切り開きます。"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: t('values.items.3.title', { returnObjects: false }) || "持続的成長",
      description: t('values.items.3.description', { returnObjects: false }) || "継続的な学習と改善を通じて、長期的な価値を創造し続けます。"
    }
  ];

  const team = [
    {
      name: t('team.members.0.name', { returnObjects: false }) || "内田 伸",
      role: t('team.members.0.role', { returnObjects: false }) || "AIシステムプロデューサー",
      description: t('team.members.0.description', { returnObjects: false }) || "30年以上の経験からあらゆるシステムの構築を行う。",
      image: uchidaShinImage
    },
    {
      name: t('team.members.1.name', { returnObjects: false }) || "Michael Ito",
      role: t('team.members.1.role', { returnObjects: false }) || "企画・コンサルタント",
      description: t('team.members.1.description', { returnObjects: false }) || "システム・アプリの企画から運用までをご提案。",
      image: michaelItoImage
    },
    {
      name: t('team.members.2.name', { returnObjects: false }) || "John Kaneko",
      role: t('team.members.2.role', { returnObjects: false }) || "プロジェクト・マネージャー",
      description: t('team.members.2.description', { returnObjects: false }) || "プロジェクト成功を導く案内人。",
      image: johnKanekoImage
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={teamCollaborationImage}
            alt="Team collaboration background"
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white" data-testid="text-page-title">
              {t('hero.title') || "私たちについて"}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed text-left">
              {t('hero.description') || "D'auchy.Studioは、AIの力を活用して人々の生活や仕事をより豊かにするプロダクトを開発しています。私たちは技術と創造性を組み合わせ、真に価値のあるソリューションを提供することを使命としています。"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-mission-title">
              {t('mission.title') || "私たちのミッション"}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-600 mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed text-left">
              {t('mission.description') || "私たちは、AIテクノロジーを通じて教育、企業、クリエイティブ分野に革新をもたらします。ユーザーとの共創を大切にし、実用的で持続可能なソリューションを開発することで、社会全体のデジタルトランスフォーメーションに貢献していきます。"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-values-title">
              {t('values.title') || "私たちの価値観"}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-600 mx-auto" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover-elevate">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3" data-testid={`text-value-title-${index}`}>
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed" data-testid={`text-value-description-${index}`}>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-team-title">
              {t('team.title') || "チーム"}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-600 mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
              {t('team.description') || "多様なバックグラウンドを持つ専門家チームが、革新的なプロダクト開発に取り組んでいます。"}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center hover-elevate team-card-height">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-36 h-36 rounded-full mx-auto object-cover"
                        data-testid={`img-team-member-${index}`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" data-testid={`text-member-name-${index}`}>
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3" data-testid={`text-member-role-${index}`}>
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`text-member-description-${index}`}>
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center" data-testid="text-history-title">
              {t('history.title') || "私たちの歩み"}
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-milestone-1">
                    {t('history.milestones.0.title', { returnObjects: false }) || "2024年1月 - D'auchy-Studio設立"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('history.milestones.0.description', { returnObjects: false }) || "AI技術の民主化を目指し、D'auchy.Studioを設立。"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-milestone-2">
                    {t('history.milestones.1.title', { returnObjects: false }) || "2025年5月 - LingaLink リリース"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('history.milestones.1.description', { returnObjects: false }) || "オンライン学習コーチングサービス「LingaLink」を正式リリース。"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-milestone-3">
                    {t('history.milestones.2.title', { returnObjects: false }) || "2025年8月 - OfficeBrain リリース"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('history.milestones.2.description', { returnObjects: false }) || "企業向けRAGシステム「OfficeBrain」をリリース。エンタープライズ市場に参入。"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-milestone-4">
                    {t('history.milestones.3.title', { returnObjects: false }) || "2025年10月 - 現在"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('history.milestones.3.description', { returnObjects: false }) || "EduMateベータ版公開、Bayd-System開発中。さらなる革新的プロダクトを準備中。"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}