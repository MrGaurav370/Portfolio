import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Mic, MicOff, Send, Settings, Volume2, VolumeX } from "lucide-react";
import DemoHeader from "../components/DemoHeader";
import { parseCommand } from "../lib/jarvisEngine";
import useLocalStorage from "../hooks/useLocalStorage";

const SpeechRecognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
const SUGGESTIONS = ["What time is it?", "Tell me a joke", "Calculate 12 times 8", "Open projects", "Open the shop", "Who is Gaurav?", "Help"];

const Jarvis = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "J.A.R.V.I.S. online. Type a command or tap the microphone and speak." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [voiceOn, setVoiceOn] = useLocalStorage("jarvis.voice", true);
  const [showSettings, setShowSettings] = useState(false);
  const [ollama, setOllama] = useLocalStorage("jarvis.ollama", { enabled: false, url: "http://localhost:11434", model: "llama3.2" });
  const recRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, thinking]);
  useEffect(() => () => { recRef.current?.abort?.(); if (canSpeak) window.speechSynthesis.cancel(); }, []);

  const speak = useCallback((text) => {
    if (!voiceOn || !canSpeak) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [voiceOn]);

  const runAction = useCallback((action) => {
    if (!action) return;
    setTimeout(() => {
      if (action.type === "navigate") navigate(action.to);
      if (action.type === "scroll") {
        navigate("/");
        setTimeout(() => document.getElementById(action.id)?.scrollIntoView({ behavior: "smooth" }), 400);
      }
    }, 900);
  }, [navigate]);

  const askOllama = async (history) => {
    const res = await fetch(`${ollama.url.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollama.model, stream: false,
        messages: [{ role: "system", content: "You are J.A.R.V.I.S., a concise, witty voice assistant. Answer in one or two short sentences." },
          ...history.slice(-8).map((m) => ({ role: m.role, content: m.text }))],
      }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}`);
    const data = await res.json();
    return data.message?.content?.trim() || "…";
  };

  const send = async (raw) => {
    const text = (raw ?? input).trim();
    if (!text || thinking) return;
    setInput("");
    const userMsg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    const result = parseCommand(text);
    let reply = result.reply;
    if (result.intent === "unknown" && ollama.enabled) {
      setThinking(true);
      try { reply = await askOllama([...messages, userMsg]); }
      catch { reply = "I couldn't reach your local Ollama server. Check that it's running and that CORS is allowed (see settings)."; }
      setThinking(false);
    }
    setMessages((m) => [...m, { role: "assistant", text: reply }]);
    speak(reply);
    runAction(result.action);
  };

  const toggleListen = () => {
    if (!SpeechRecognition) return;
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed") setMessages((m) => [...m, { role: "assistant", text: "Microphone access was blocked. Allow it in your browser, or just type." }]);
    };
    rec.onresult = (e) => send(e.results[0][0].transcript);
    recRef.current = rec;
    if (canSpeak) window.speechSynthesis.cancel();
    rec.start();
  };

  const active = listening ? "listening" : speaking ? "speaking" : thinking ? "thinking" : "idle";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <DemoHeader icon={Bot} title="J.A.R.V.I.S." subtitle="Voice assistant demo">
        {canSpeak && (
          <button onClick={() => { setVoiceOn(!voiceOn); if (voiceOn) window.speechSynthesis.cancel(); }}
            aria-label={voiceOn ? "Mute voice replies" : "Unmute voice replies"} aria-pressed={voiceOn}
            className="p-2 border border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]">
            {voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        )}
        <button onClick={() => setShowSettings(!showSettings)} aria-label="Settings" aria-expanded={showSettings}
          className="p-2 border border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]">
          <Settings size={18} />
        </button>
      </DemoHeader>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 max-w-3xl w-full flex flex-col">
        {showSettings && (
          <section className="mb-6 bg-[#1a1a1a] border border-[#2a2a2a] p-4 sm:p-5 space-y-3" aria-label="Local LLM settings">
            <label className="flex items-center gap-3 font-semibold">
              <input type="checkbox" checked={ollama.enabled} onChange={(e) => setOllama({ ...ollama, enabled: e.target.checked })} className="accent-[#00d9ff] w-4 h-4" />
              Use a local Ollama model for anything I can't answer
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-sm text-gray-400">Server URL
                <input value={ollama.url} onChange={(e) => setOllama({ ...ollama, url: e.target.value })} className="mt-1 w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-white" />
              </label>
              <label className="text-sm text-gray-400">Model
                <input value={ollama.model} onChange={(e) => setOllama({ ...ollama, model: e.target.value })} className="mt-1 w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-white" />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Runs entirely in your browser against your own machine. Start Ollama with <code className="text-[#00d9ff]">OLLAMA_ORIGINS=*</code> so this page is allowed to call it.
              Nothing is sent anywhere else.
            </p>
          </section>
        )}

        <div className="flex flex-col items-center mb-6" aria-live="polite">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
            {active !== "idle" && <span className="absolute inset-0 rounded-full bg-[#00d9ff]/20 animate-ping" />}
            <span className={`absolute inset-2 rounded-full border-2 border-[#00d9ff]/40 ${active === "idle" ? "" : "animate-pulse"}`} />
            <span className="absolute inset-6 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#0077aa] shadow-[0_0_40px_#00d9ff66]" />
            <Bot className="relative text-black" size={36} />
          </div>
          <p className="mt-3 text-sm uppercase tracking-widest text-[#00d9ff]">
            {{ idle: "Standing by", listening: "Listening…", speaking: "Speaking…", thinking: "Thinking…" }[active]}
          </p>
        </div>

        <div className="flex-1 min-h-[220px] max-h-[45vh] overflow-y-auto space-y-3 pr-1" role="log" aria-label="Conversation">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 text-sm sm:text-base leading-relaxed ${
                m.role === "user" ? "bg-[#00d9ff] text-black" : "bg-[#1a1a1a] border border-[#2a2a2a] text-gray-200"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {thinking && <div className="text-gray-500 text-sm animate-pulse">J.A.R.V.I.S. is thinking…</div>}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2 my-4">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)}
              className="text-xs sm:text-sm px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]">
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
          {SpeechRecognition && (
            <button type="button" onClick={toggleListen} aria-label={listening ? "Stop listening" : "Start voice input"} aria-pressed={listening}
              className={`px-4 border ${listening ? "bg-red-500 border-red-500 text-white" : "border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff]/10"}`}>
              {listening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a command…" aria-label="Command"
            className="flex-1 min-w-0 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d9ff]" />
          <button type="submit" disabled={!input.trim() || thinking} aria-label="Send"
            className="px-4 bg-[#00d9ff] text-black font-semibold disabled:opacity-40 hover:bg-[#00b8e6]">
            <Send size={20} />
          </button>
        </form>
        {!SpeechRecognition && (
          <p className="mt-3 text-xs text-gray-500">Voice input isn't supported in this browser (try Chrome or Edge). Typing works everywhere.</p>
        )}
      </main>
    </div>
  );
};

export default Jarvis;
