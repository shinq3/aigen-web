import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, Save, User, Globe, RefreshCw, Languages } from 'lucide-react';

type CreatorProfile = {
  id: string;
  locale: string;
  name: string;
  nameReading?: string;
  title?: string;
  about?: string;
  vision?: string;
  projects?: string;
  background?: string;
  company?: string;
  chatbot?: string;
  contact?: string;
};

type ProfileFormData = Omit<CreatorProfile, 'id'>;

const defaultProfiles: Record<string, ProfileFormData> = {
  ja: {
    locale: 'ja',
    name: '内田 伸',
    nameReading: 'うちだ しん',
    title: "D'auchy.Studio 創設者・代表",
    about: "内田伸はD'auchy.Studio（ダウチースタジオ）の創設者であり、このウェブサイトに掲載されているすべてのプロジェクトとプロダクトの開発者です。",
    vision: 'AIは目的ではなく手段である。テクノロジーを通じて人々の創造性と生産性を高めることを使命としています。',
    projects: '内田伸が開発・運営するプロダクト：LingaLink、EduMate、OfficeBrain、Bayd-System',
    background: 'AIと教育テクノロジーの分野で活動するソフトウェアエンジニア・起業家。',
    company: "D'auchy.Studioは内田伸が設立した日本のAIプロダクトイノベーション企業です。",
    chatbot: 'このチャットボットは内田伸が開発したRAGシステムを使用しています。',
    contact: 'お問い合わせはコンタクトページからお願いいたします。'
  },
  en: {
    locale: 'en',
    name: 'Shin Uchida',
    nameReading: '',
    title: "Founder & Director of D'auchy.Studio",
    about: "Shin Uchida is the founder of D'auchy.Studio and the developer behind all projects and products featured on this website.",
    vision: 'AI is not the goal, but a means. Our mission is to enhance creativity and productivity through technology.',
    projects: 'Products by Shin Uchida: LingaLink, EduMate, OfficeBrain, Bayd-System',
    background: 'A software engineer and entrepreneur active in AI and educational technology.',
    company: "D'auchy.Studio is a Japanese AI product innovation company founded by Shin Uchida.",
    chatbot: 'This chatbot uses a RAG system developed by Shin Uchida.',
    contact: 'For inquiries, please use the contact page.'
  },
  vi: {
    locale: 'vi',
    name: 'Shin Uchida',
    nameReading: '',
    title: "Người sáng lập & Giám đốc D'auchy.Studio",
    about: "Shin Uchida là người sáng lập D'auchy.Studio và là nhà phát triển đứng sau tất cả các dự án và sản phẩm trên trang web này.",
    vision: 'AI không phải là mục tiêu mà là phương tiện. Sứ mệnh của chúng tôi là nâng cao sự sáng tạo và năng suất thông qua công nghệ.',
    projects: 'Sản phẩm của Shin Uchida: LingaLink, EduMate, OfficeBrain, Bayd-System',
    background: 'Một kỹ sư phần mềm và doanh nhân hoạt động trong lĩnh vực AI và công nghệ giáo dục.',
    company: "D'auchy.Studio là một công ty đổi mới sản phẩm AI của Nhật Bản được thành lập bởi Shin Uchida.",
    chatbot: 'Chatbot này sử dụng hệ thống RAG được phát triển bởi Shin Uchida.',
    contact: 'Để liên hệ, vui lòng sử dụng trang liên hệ.'
  }
};

export default function ProfileManager() {
  const { toast } = useToast();
  const [activeLocale, setActiveLocale] = useState('ja');
  const [formData, setFormData] = useState<Record<string, ProfileFormData>>(defaultProfiles);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const { data: profiles = [], isLoading, refetch } = useQuery<CreatorProfile[]>({
    queryKey: ['/api/admin/profiles']
  });

  useEffect(() => {
    if (!isLoading && !hasLoadedInitial) {
      loadProfilesIntoForm();
      setHasLoadedInitial(true);
    }
  }, [profiles, isLoading, hasLoadedInitial]);

  const loadProfilesIntoForm = () => {
    const updatedFormData = { ...defaultProfiles };
    for (const profile of profiles) {
      if (updatedFormData[profile.locale]) {
        updatedFormData[profile.locale] = {
          locale: profile.locale,
          name: profile.name,
          nameReading: profile.nameReading || '',
          title: profile.title || '',
          about: profile.about || '',
          vision: profile.vision || '',
          projects: profile.projects || '',
          background: profile.background || '',
          company: profile.company || '',
          chatbot: profile.chatbot || '',
          contact: profile.contact || ''
        };
      }
    }
    setFormData(updatedFormData);
  };

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.data) {
      const updatedFormData = { ...defaultProfiles };
      for (const profile of result.data) {
        if (updatedFormData[profile.locale]) {
          updatedFormData[profile.locale] = {
            locale: profile.locale,
            name: profile.name,
            nameReading: profile.nameReading || '',
            title: profile.title || '',
            about: profile.about || '',
            vision: profile.vision || '',
            projects: profile.projects || '',
            background: profile.background || '',
            company: profile.company || '',
            chatbot: profile.chatbot || '',
            contact: profile.contact || ''
          };
        }
      }
      setFormData(updatedFormData);
      toast({
        title: '更新完了',
        description: 'サーバーから最新データを取得しました。'
      });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (profile: ProfileFormData) => {
      return apiRequest('/api/admin/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/profiles'] });
      toast({
        title: '保存完了',
        description: 'プロフィールを保存し、RAGインデックスを更新しました。'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'エラー',
        description: error.message || '保存に失敗しました',
        variant: 'destructive'
      });
    }
  });

  const translateMutation = useMutation({
    mutationFn: async (params: { sourceProfile: ProfileFormData; sourceLocale: string; targetLocales: string[] }) => {
      const response = await apiRequest('/api/admin/profiles/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/profiles'] });
      const successCount = data.results?.filter((r: any) => r.success).length || 0;
      const failedLocales = data.results?.filter((r: any) => !r.success).map((r: any) => r.locale) || [];
      
      if (failedLocales.length === 0) {
        toast({
          title: '翻訳完了',
          description: `日本語プロフィールを英語・ベトナム語に翻訳し保存しました（${successCount}言語）`
        });
      } else {
        toast({
          title: '一部翻訳完了',
          description: `${successCount}言語を保存しました。失敗: ${failedLocales.join(', ')}`,
          variant: 'destructive'
        });
      }
      
      // Refresh form data to show translated content
      handleRefresh();
    },
    onError: (error: any) => {
      toast({
        title: 'エラー',
        description: error.message || '翻訳に失敗しました',
        variant: 'destructive'
      });
    }
  });

  const handleTranslateAndSave = () => {
    const jaProfile = formData['ja'] || defaultProfiles['ja'];
    
    if (!jaProfile.name?.trim()) {
      toast({
        title: 'エラー',
        description: '日本語の名前を入力してください',
        variant: 'destructive'
      });
      return;
    }
    
    translateMutation.mutate({
      sourceProfile: jaProfile,
      sourceLocale: 'ja',
      targetLocales: ['en', 'vi']
    });
  };

  const handleInputChange = (locale: string, field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [field]: value
      }
    }));
  };

  const handleSave = (locale: string) => {
    const currentProfile = formData[locale] || defaultProfiles[locale];
    
    const profileToSave: ProfileFormData = {
      locale,
      name: currentProfile?.name?.trim() || defaultProfiles[locale].name,
      nameReading: currentProfile?.nameReading || '',
      title: currentProfile?.title || '',
      about: currentProfile?.about || '',
      vision: currentProfile?.vision || '',
      projects: currentProfile?.projects || '',
      background: currentProfile?.background || '',
      company: currentProfile?.company || '',
      chatbot: currentProfile?.chatbot || '',
      contact: currentProfile?.contact || ''
    };
    
    if (!profileToSave.name) {
      toast({
        title: 'エラー',
        description: '名前は必須です',
        variant: 'destructive'
      });
      return;
    }
    
    saveMutation.mutate(profileToSave);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            クリエイタープロフィール管理
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            data-testid="button-refresh-profiles"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            データ更新
          </Button>
        </div>
        <CardDescription>
          RAGチャットボットがユーザーの質問に答えるための創設者情報を管理します。
          保存時に自動でRAGインデックスが更新されます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeLocale} onValueChange={setActiveLocale}>
          <TabsList className="mb-6">
            <TabsTrigger value="ja" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              日本語
            </TabsTrigger>
            <TabsTrigger value="en" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              English
            </TabsTrigger>
            <TabsTrigger value="vi" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Tiếng Việt
            </TabsTrigger>
          </TabsList>

          {['ja', 'en', 'vi'].map(locale => (
            <TabsContent key={locale} value={locale} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${locale}`}>名前</Label>
                  <Input
                    id={`name-${locale}`}
                    value={formData[locale]?.name || ''}
                    onChange={(e) => handleInputChange(locale, 'name', e.target.value)}
                    placeholder="内田 伸"
                    data-testid={`input-name-${locale}`}
                  />
                </div>
                {locale === 'ja' && (
                  <div className="space-y-2">
                    <Label htmlFor={`nameReading-${locale}`}>読み仮名</Label>
                    <Input
                      id={`nameReading-${locale}`}
                      value={formData[locale]?.nameReading || ''}
                      onChange={(e) => handleInputChange(locale, 'nameReading', e.target.value)}
                      placeholder="うちだ しん"
                      data-testid={`input-nameReading-${locale}`}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor={`title-${locale}`}>肩書き</Label>
                  <Input
                    id={`title-${locale}`}
                    value={formData[locale]?.title || ''}
                    onChange={(e) => handleInputChange(locale, 'title', e.target.value)}
                    placeholder="D'auchy.Studio 創設者"
                    data-testid={`input-title-${locale}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`about-${locale}`}>自己紹介</Label>
                <Textarea
                  id={`about-${locale}`}
                  value={formData[locale]?.about || ''}
                  onChange={(e) => handleInputChange(locale, 'about', e.target.value)}
                  rows={3}
                  data-testid={`input-about-${locale}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`vision-${locale}`}>ビジョン</Label>
                <Textarea
                  id={`vision-${locale}`}
                  value={formData[locale]?.vision || ''}
                  onChange={(e) => handleInputChange(locale, 'vision', e.target.value)}
                  rows={2}
                  data-testid={`input-vision-${locale}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`projects-${locale}`}>プロジェクト</Label>
                <Textarea
                  id={`projects-${locale}`}
                  value={formData[locale]?.projects || ''}
                  onChange={(e) => handleInputChange(locale, 'projects', e.target.value)}
                  rows={2}
                  data-testid={`input-projects-${locale}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`background-${locale}`}>経歴</Label>
                <Textarea
                  id={`background-${locale}`}
                  value={formData[locale]?.background || ''}
                  onChange={(e) => handleInputChange(locale, 'background', e.target.value)}
                  rows={2}
                  data-testid={`input-background-${locale}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`company-${locale}`}>会社情報</Label>
                <Textarea
                  id={`company-${locale}`}
                  value={formData[locale]?.company || ''}
                  onChange={(e) => handleInputChange(locale, 'company', e.target.value)}
                  rows={2}
                  data-testid={`input-company-${locale}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`chatbot-${locale}`}>チャットボット説明</Label>
                <Textarea
                  id={`chatbot-${locale}`}
                  value={formData[locale]?.chatbot || ''}
                  onChange={(e) => handleInputChange(locale, 'chatbot', e.target.value)}
                  rows={2}
                  data-testid={`input-chatbot-${locale}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`contact-${locale}`}>連絡先案内</Label>
                <Textarea
                  id={`contact-${locale}`}
                  value={formData[locale]?.contact || ''}
                  onChange={(e) => handleInputChange(locale, 'contact', e.target.value)}
                  rows={2}
                  data-testid={`input-contact-${locale}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                {locale === 'ja' && (
                  <Button
                    onClick={handleTranslateAndSave}
                    disabled={translateMutation.isPending || saveMutation.isPending}
                    variant="secondary"
                    data-testid="button-translate-all"
                  >
                    {translateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Languages className="w-4 h-4 mr-2" />
                    )}
                    英語・ベトナム語に翻訳して保存
                  </Button>
                )}
                <Button
                  onClick={() => handleSave(locale)}
                  disabled={saveMutation.isPending || translateMutation.isPending}
                  data-testid={`button-save-${locale}`}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  保存してRAG更新
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
