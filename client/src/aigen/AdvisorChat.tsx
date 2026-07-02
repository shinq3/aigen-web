import { FormEvent, useMemo, useRef, useState } from "react";
import { Bot, Maximize2, MessageCircleQuestion, Minimize2, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/lib/i18n-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ id: string; title: string }>;
};

const apiBase = import.meta.env.VITE_AIGEN_ADVISOR_API_BASE
  || (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4192/api"
    : "https://aigen-one.d-auchy.studio/api");

function RichText({ content }: { content: string }) {
  return (
    <div className="text-sm leading-6 text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mb-3 mt-5 text-lg font-bold text-slate-950 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-5 text-base font-bold text-slate-950 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-4 font-bold text-slate-950 first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
          ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="font-medium text-orange-700 underline underline-offset-2">{children}</a>,
          blockquote: ({ children }) => <blockquote className="mb-3 border-l-2 border-orange-300 bg-orange-50 px-3 py-2 text-slate-600">{children}</blockquote>,
          code: ({ children }) => <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-900">{children}</code>,
          table: ({ children }) => <div className="mb-3 overflow-x-auto"><table className="w-full border-collapse text-left text-xs">{children}</table></div>,
          th: ({ children }) => <th className="border border-slate-200 bg-slate-100 px-2 py-1.5 font-semibold text-slate-900">{children}</th>,
          td: ({ children }) => <td className="border border-slate-200 px-2 py-1.5 align-top">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function AdvisorChat() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const suggestions = t("advisor.suggestions", { returnObjects: true }) as string[];
  const history = useMemo(() => messages.slice(-10).filter((message) => message.content).map(({ role, content }) => ({ role, content })), [messages]);

  const scrollToEnd = () => window.requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));

  async function submit(messageText = input) {
    const message = messageText.trim();
    if (!message || streaming) return;
    setInput("");
    setError("");
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: message };
    const assistantId = crypto.randomUUID();
    setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setStreaming(true);
    setStatus(t("advisor.status.connecting"));
    scrollToEnd();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(`${apiBase}/public/advisor/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ message, locale, history }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) throw new Error(`${response.status} ${response.statusText}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sources: Array<{ id: string; title: string }> = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const packets = buffer.split("\n\n");
        buffer = packets.pop() ?? "";
        for (const packet of packets) {
          const event = packet.split("\n").find((line) => line.startsWith("event:"))?.slice(6).trim() ?? "message";
          const dataLine = packet.split("\n").find((line) => line.startsWith("data:"));
          if (!dataLine) continue;
          const data = JSON.parse(dataLine.slice(5).trim()) as Record<string, unknown>;
          if (event === "status" && typeof data.message === "string") setStatus(data.message);
          if (event === "sources" && data.items instanceof Array) sources = data.items as Array<{ id: string; title: string }>;
          if (event === "delta" && typeof data.text === "string") {
            setStatus("");
            setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: item.content + data.text } : item));
            scrollToEnd();
          }
          if (event === "complete") {
            setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, sources } : item));
          }
          if (event === "error") throw new Error(String(data.message || t("advisor.error")));
        }
      }
    } catch (caught) {
      if ((caught as Error).name !== "AbortError") {
        setError(t("advisor.error"));
        setMessages((current) => current.filter((item) => item.id !== assistantId || item.content));
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
      setStatus("");
      scrollToEnd();
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setError("");
    setStreaming(false);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void submit();
  }

  return (
    <div className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
      {open && (
        <section className={fullscreen
          ? "fixed inset-0 z-[90] flex h-[100dvh] w-screen flex-col overflow-hidden bg-white"
          : "mb-3 flex h-[min(680px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:w-[430px]"
        } aria-label={t("advisor.title")}>
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-500"><Sparkles className="h-4 w-4" /></span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold">{t("advisor.title")}</h2>
                <p className="truncate text-xs text-slate-300">{t("advisor.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={reset} className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white" aria-label={t("advisor.reset")} title={t("advisor.reset")}><RotateCcw className="h-4 w-4" /></button>
              <button type="button" onClick={() => setFullscreen((value) => !value)} className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white" aria-label={fullscreen ? t("advisor.exitFullscreen") : t("advisor.fullscreen")} title={fullscreen ? t("advisor.exitFullscreen") : t("advisor.fullscreen")}>
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => { setOpen(false); setFullscreen(false); }} className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white" aria-label={t("advisor.close")}><X className="h-4 w-4" /></button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
            <div className={fullscreen ? "mx-auto w-full max-w-4xl" : ""}>
            {messages.length === 0 && (
              <div>
                <div className="mb-5 flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-700"><Bot className="h-4 w-4" /></span>
                  <div className="rounded-lg rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">{t("advisor.welcome")}</div>
                </div>
                <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{t("advisor.tryAsking")}</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void submit(suggestion)} className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">{suggestion}</button>)}
                </div>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((message) => message.role === "user" ? (
                <div key={message.id} className="ml-auto max-w-[88%] rounded-lg rounded-tr-sm bg-orange-50 px-4 py-3 text-sm leading-6 text-slate-800 ring-1 ring-orange-100">{message.content}</div>
              ) : (
                <div key={message.id} className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white"><Bot className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1 rounded-lg rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    {message.content ? <RichText content={message.content} /> : <span className="inline-flex items-center gap-2 text-sm text-slate-500"><span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />{status || t("advisor.status.answering")}</span>}
                    {message.sources && message.sources.length > 0 && <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400">{t("advisor.basedOn", { count: message.sources.length })}</p>}
                  </div>
                </div>
              ))}
            </div>
            {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
            <div ref={endRef} />
            </div>
          </div>

          <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className={fullscreen ? "mx-auto w-full max-w-4xl" : ""}>
            <div className="flex items-end gap-2 rounded-lg border border-slate-300 bg-white p-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void submit(); } }} rows={1} placeholder={t("advisor.placeholder")} className="max-h-28 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400" disabled={streaming} />
              <button type="submit" disabled={streaming || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400" aria-label={t("advisor.send")}><Send className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">{t("advisor.disclaimer")}</p>
            </div>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto flex h-14 items-center gap-2 rounded-lg bg-slate-950 px-4 font-semibold text-white shadow-xl transition hover:bg-slate-800" aria-expanded={open} aria-label={open ? t("advisor.close") : t("advisor.open")}>
        {open ? <X className="h-5 w-5" /> : <MessageCircleQuestion className="h-5 w-5 text-orange-300" />}
        <span className="text-sm">{open ? t("advisor.close") : t("advisor.open")}</span>
      </button>
    </div>
  );
}
