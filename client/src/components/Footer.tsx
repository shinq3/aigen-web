import { Link } from "wouter";
import { Github, Twitter, Linkedin, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { linkTo, useLocale } from "@/lib/i18n-utils";

interface FooterProps {
  company: string;
  address: string;
  links: Array<{
    title: string;
    items: Array<{ name: string; href: string }>;
  }>;
  social: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
  }>;
}

export default function Footer({ company, address, links, social }: FooterProps) {
  const { t } = useTranslation('footer');
  const { locale } = useLocale();
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">D</span>
              </div>
              <span className="font-bold text-xl text-white">{company}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('company.description')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4" />
                <span data-testid="text-address">{address}</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {links.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-white" data-testid={`text-footer-section-${index}`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                      data-testid={`link-footer-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">{t('sections.follow')}</h4>
            <div className="flex space-x-4">
              {social.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors text-gray-300"
                  data-testid={`link-social-${item.name.toLowerCase()}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-300" data-testid="text-copyright">
            {t('company.copyright')}
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href={linkTo("/privacy", locale)} className="text-gray-300 hover:text-primary transition-colors" data-testid="link-privacy">
              {t('links.privacy')}
            </Link>
            <Link href={linkTo("/terms", locale)} className="text-gray-300 hover:text-primary transition-colors" data-testid="link-terms">
              {t('links.terms')}
            </Link>
            <Link href={linkTo("/sitemap", locale)} className="text-gray-300 hover:text-primary transition-colors" data-testid="link-sitemap">
              {t('links.sitemap')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}