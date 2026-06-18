import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, User, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLocale, linkTo } from '@/lib/i18n-utils';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import type { Locale } from '@shared/i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
];

function useTypewriter(lines: string[], locale: string, speed = 40, lineDelay = 300) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const linesKey = lines.join('\n');

  useEffect(() => {
    let cancelled = false;
    let charIndex = 0;

    setDisplayedText('');
    setIsDone(false);

    const type = () => {
      if (cancelled) return;
      if (charIndex <= linesKey.length) {
        setDisplayedText(linesKey.slice(0, charIndex));
        charIndex++;
        const currentChar = linesKey[charIndex - 1];
        const delay = currentChar === '\n' ? lineDelay : speed;
        setTimeout(type, delay);
      } else {
        setIsDone(true);
      }
    };

    const startTimer = setTimeout(type, 600);
    return () => { cancelled = true; clearTimeout(startTimer); };
  }, [linesKey, locale]);

  return { displayedText, isDone };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { locale } = useLocale();
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation('common');
  const introLines = t('chat.introLines', { returnObjects: true }) as string[];
  const { displayedText, isDone } = useTypewriter(introLines, locale);

  const handleLanguageChange = (newLocale: Locale) => {
    i18n.changeLanguage(newLocale);
    setLocation(linkTo('/chat', newLocale));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [hasStartedChat]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          locale,
          sessionId
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: t('chat.error'),
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-language-switch"
            >
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a24] border-gray-800">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`cursor-pointer ${locale === lang.code ? 'text-primary' : 'text-white/80'} hover:text-white hover:bg-white/10`}
                data-testid={`button-lang-${lang.code}`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <AnimatePresence mode="wait">
          {!hasStartedChat ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                D'auchy.studio
              </motion.h1>

              <motion.div
                className="w-full max-w-2xl mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mt-1">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="bg-[#1a1a24] border border-gray-800 rounded-2xl px-5 py-4 max-w-[85%]">
                    <p className="text-base text-gray-200 whitespace-pre-wrap leading-relaxed" data-testid="text-intro-typewriter">
                      {displayedText}
                      {!isDone && <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse align-middle" />}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isDone ? 1 : 0.3, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="relative bg-[#1a1a24] rounded-xl border border-gray-800 p-4">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('chat.placeholder')}
                    className="min-h-[60px] max-h-[120px] resize-none bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 text-lg"
                    rows={2}
                    disabled={isLoading}
                    data-testid="input-fullscreen-chat"
                  />
                  <div className="flex items-center justify-end mt-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={!input.trim() || isLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                      data-testid="button-fullscreen-send"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {t('chat.send')}
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8"
              >
                <Link href={linkTo('/', locale)}>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                    data-testid="button-go-home"
                  >
                    {t('chat.goHome')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6 min-h-0"
            >
              <motion.div 
                className="text-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-primary">
                  D'auchy.studio
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  {t('chat.tagline')}
                </p>
              </motion.div>

              <div className="flex-1 overflow-y-auto min-h-0 pr-2">
                <div className="space-y-4 pb-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index === messages.length - 1 ? 0.1 : 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-blue-400" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1a1a24] text-gray-200 border border-gray-800'
                        }`}
                        data-testid={`text-fullscreen-message-${message.role}`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="bg-[#1a1a24] border border-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="mt-4 bg-[#1a1a24] rounded-xl border border-gray-800 p-3">
                <div className="flex gap-3">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('chat.placeholder')}
                    className="min-h-[44px] max-h-[120px] resize-none bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0"
                    rows={1}
                    disabled={isLoading}
                    data-testid="input-fullscreen-chat-expanded"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                    data-testid="button-fullscreen-send-expanded"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link href={linkTo('/', locale)}>
                  <Button 
                    variant="ghost" 
                    className="text-gray-500 hover:text-white hover:bg-white/10 text-sm"
                    data-testid="button-go-home-chat"
                  >
                    {t('chat.goHome')}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
