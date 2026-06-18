import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsManager from "@/components/admin/NewsManager";
import ContactManager from "@/components/admin/ContactManager";
import UsersManager from "@/components/admin/UsersManager";
import RssSourcesManager from "@/components/admin/RssSourcesManager";
import RssImportQueueManager from "@/components/admin/RssImportQueueManager";
import ProfileManager from "@/components/admin/ProfileManager";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { LogOut, Newspaper, MessageSquare, Users, Home, RssIcon, Clock, User } from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user, logout, logoutPending } = useAdminAuth();
  const { t } = useTranslation(['admin', 'common']);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.username?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-lg">{t('dashboard')}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('welcome', { username: user?.username })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild data-testid="button-home">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    {t('home')}
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  disabled={logoutPending}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutPending ? t('login.signingIn') : t('logout')}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="news" className="space-y-8">
          <TabsList className={`grid w-full ${user?.role === 'superadmin' ? 'grid-cols-6' : 'grid-cols-5'}`}>
            <TabsTrigger value="news" data-testid="tab-news">
              <Newspaper className="w-4 h-4 mr-2" />
              {t('tabs.news')}
            </TabsTrigger>
            <TabsTrigger value="rss" data-testid="tab-rss">
              <RssIcon className="w-4 h-4 mr-2" />
              RSS
            </TabsTrigger>
            <TabsTrigger value="queue" data-testid="tab-queue">
              <Clock className="w-4 h-4 mr-2" />
              Queue
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">
              <MessageSquare className="w-4 h-4 mr-2" />
              {t('tabs.contacts')}
            </TabsTrigger>
            {user?.role === 'superadmin' && (
              <TabsTrigger value="users" data-testid="tab-users">
                <Users className="w-4 h-4 mr-2" />
                {t('tabs.users')}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="rss">
            <RssSourcesManager />
          </TabsContent>

          <TabsContent value="queue">
            <RssImportQueueManager />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileManager />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactManager />
          </TabsContent>

          {user?.role === 'superadmin' && (
            <TabsContent value="users">
              <UsersManager />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}