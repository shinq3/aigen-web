import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { locales, localeNames, type Locale, isValidLocale } from '@shared/i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [location, setLocation] = useLocation();

  const currentLocale = i18n.language as Locale;

  const changeLanguage = (newLocale: Locale) => {
    // Update i18next language
    i18n.changeLanguage(newLocale);
    
    // Store preference in localStorage
    localStorage.setItem('preferred-language', newLocale);
    
    // Update URL - extract current path without locale prefix
    const pathParts = location.split('/').filter(Boolean);
    let currentPath = '';
    
    // If first part is a valid locale, remove it
    if (pathParts.length > 0 && isValidLocale(pathParts[0])) {
      currentPath = '/' + pathParts.slice(1).join('/');
    } else {
      currentPath = location;
    }
    
    // Navigate to new locale path
    const newPath = `/${newLocale}${currentPath}`;
    setLocation(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-white hover:bg-gray-700"
          data-testid="button-language-switcher"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => changeLanguage(locale)}
            className={currentLocale === locale ? 'bg-accent' : ''}
            data-testid={`menu-item-language-${locale}`}
          >
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}