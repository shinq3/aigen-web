import { FormEvent, useMemo, useRef, useState } from "react";
import { Bot, MessageCircleQuestion, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/lib/i18n-utils";

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
  const blocks = content.split("\n");
  return (
    <div className="space-y-2 text-sm leading-6 text-slate-700">
      {blocks.map((line, index) => {
        const value = line.trim();
        if (!value) return <div key={index} className="h-1" />;
        if (value.startsWith("### ")) return <h4 key={index} className="pt-1 font-bold text-slate-950">{value.slice(4)}</h4>;
        if (value.startsWith("## ")) return <h3 key={index} className="pt-1 text-base font-bold text-slate-950">{value.slice(3)}</h3>;
        if (/^[-*] /.test(value)) return <p key={index} className="pl-4 before:-ml-3 before:mr-2 before:content-['•']">{value.slice(2)}</p>;
        const segments = value.split(/(\*\*[^*]+\*\*)/g);
        return <p key={index}>{segments.map((segment, part) => segment.startsWith("**") && segment.endsWith("**") ? <strong key={part} className="font-semibold text-slate-950">{segment.slice(2, -2)}</strong> : segment)}</p>;
      })}
    </div>
  );
}

export default function AdvisorChat() {
  const { t } = useTranslation("aigen-one");
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
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
        <section className="mb-3 flex h-[min(680px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:w-[430px]" aria-label={t("advisor.title")}>
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
              <button type="button" onClick={() => setOpen(false)} className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white" aria-label={t("advisor.close")}><X className="h-4 w-4" /></button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
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

          <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-end gap-2 rounded-lg border border-slate-300 bg-white p-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void submit(); } }} rows={1} placeholder={t("advisor.placeholder")} className="max-h-28 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400" disabled={streaming} />
              <button type="submit" disabled={streaming || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400" aria-label={t("advisor.send")}><Send className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">{t("advisor.disclaimer")}</p>
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

