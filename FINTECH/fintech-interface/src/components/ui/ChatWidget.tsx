import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles, Minimize2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const quickReplies = [
  "How do I send money?",
  "What are the fees?",
  "Exchange rates",
  "Reset password",
];

const botResponses: Record<string, string> = {
  "how do i send money?": "To send money, go to the **Send Money** page from the sidebar. Enter the recipient's details, choose the amount and currency, then confirm! It's that simple. 🚀",
  "what are the fees?": "GlobePay charges just **0.35%** per international transfer — one of the lowest in the industry! Domestic transfers are **completely free**. 💰",
  "exchange rates": "We use the **real mid-market rate** with no hidden markups. You can check live rates on the **Convert** page or the rate ticker on our homepage. 📊",
  "reset password": "To reset your password, go to **Profile → Settings → Security** and click 'Change Password'. You'll receive a verification code via email. 🔐",
};

const defaultResponse = "Thanks for your message! I'm GlobePay's AI assistant. I can help with transfers, fees, exchange rates, and account settings. Try asking me about any of these topics! 🤖";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! 👋 I'm **GlobeBot**, your AI financial assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const matchedResponse = botResponses[content.trim().toLowerCase()] || defaultResponse;
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: matchedResponse,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-brand-500/40 transition-shadow"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-surface-900 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden ${
              isMinimized ? "h-16" : "h-[520px]"
            } transition-[height] duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-500 to-purple-600 text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">GlobeBot AI</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white/70">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] ${
                        msg.role === "user"
                          ? "bg-brand-500 text-white rounded-2xl rounded-br-md"
                          : "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl rounded-bl-md"
                      } px-4 py-2.5`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                          }}
                        />
                        <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-white/50" : "text-gray-400 dark:text-gray-500"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2 flex gap-2 flex-wrap">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => sendMessage(reply)}
                        className="text-xs font-medium bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-full hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-white/10 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask GlobeBot anything..."
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                      />
                      <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white flex items-center justify-center hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                    AI-powered · Responses may vary
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
