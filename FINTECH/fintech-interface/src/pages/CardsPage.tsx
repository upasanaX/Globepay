import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Plus, Snowflake, Eye, EyeOff, Copy, Check,
  ShieldCheck, Settings, TrendingUp, Lock, Unlock, Wifi,
} from "lucide-react";
import { virtualCards, VirtualCard } from "../data/mockData";
import { cardsAPI } from "../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  }),
} as any;

const CardsPage: React.FC = () => {
  const [cards, setCards] = useState<VirtualCard[]>(virtualCards);
  const [selectedCard, setSelectedCard] = useState<string>(cards[0].id);
  const [showCVV, setShowCVV] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    cardsAPI.list().then((liveCards) => {
      if (liveCards && liveCards.length) {
        const mapped = liveCards.map((c: any) => ({
          id: c.id,
          type: c.type,
          name: c.card_name || "Upasana Roy",
          number: c.number,
          expiry: c.expiry,
          cvv: c.cvv || "•••",
          balance: Number(c.balance) || 0,
          currency: c.currency || "USD",
          color: c.color || "from-brand-600 via-purple-600 to-violet-600",
          frozen: !!c.frozen,
          dailyLimit: Number(c.daily_limit) || 5000,
          spent: Number(c.spent_today) || 0,
        }));
        setCards(mapped);
      }
    }).catch(() => {});
  }, []);

  const active = cards.find((c) => c.id === selectedCard) || cards[0];

  const toggleFreeze = async (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, frozen: !c.frozen } : c))
    );
    try { await cardsAPI.toggleFreeze(id); } catch {}
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const spentPercent = Math.round((active.spent / active.dailyLimit) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            My Cards
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your virtual and physical cards.
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit text-sm">
          <Plus className="w-4 h-4" />
          New Card
        </button>
      </motion.div>

      {/* Card Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i}
            onClick={() => setSelectedCard(card.id)}
            className={`snap-center flex-shrink-0 w-80 sm:w-96 cursor-pointer transition-all duration-300 ${
              selectedCard === card.id ? "scale-100" : "scale-95 opacity-70"
            }`}
          >
            <div
              className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-6 h-52 text-white overflow-hidden ${
                card.frozen ? "grayscale" : ""
              }`}
            >
              {/* Background patterns */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl" />

              {/* Contactless icon */}
              <div className="absolute top-6 right-6">
                <Wifi className="w-6 h-6 text-white/60 rotate-90" />
              </div>

              {/* Frozen overlay */}
              {card.frozen && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
                  <div className="text-center">
                    <Snowflake className="w-10 h-10 text-blue-200 mx-auto animate-pulse" />
                    <p className="text-blue-200 text-sm font-semibold mt-2">
                      Card Frozen
                    </p>
                  </div>
                </div>
              )}

              <div className="relative z-[5] flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/80">
                    {card.type === "visa" ? "VISA" : "Mastercard"}
                  </p>
                  <p className="text-sm font-bold text-white/90">
                    {card.currency}
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold tracking-widest mb-1">
                    {card.number}
                  </p>
                  <p className="text-xs text-white/60">Expires {card.expiry}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{card.name}</p>
                  <p className="text-lg font-bold">
                    ${card.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Card Actions & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 space-y-3"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: active.frozen ? "Unfreeze" : "Freeze",
                icon: active.frozen ? Unlock : Snowflake,
                color: active.frozen
                  ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
                action: () => toggleFreeze(active.id),
              },
              {
                label: showCVV ? "Hide CVV" : "Show CVV",
                icon: showCVV ? EyeOff : Eye,
                color:
                  "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
                action: () => setShowCVV(!showCVV),
              },
              {
                label: "Copy Number",
                icon: copied ? Check : Copy,
                color: copied
                  ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
                action: handleCopy,
              },
              {
                label: "Settings",
                icon: Settings,
                color:
                  "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400",
                action: () => {},
              },
            ].map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl ${action.color} hover:opacity-80 transition-all`}
              >
                <action.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>

          {showCVV && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-center"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">CVV</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-widest">
                  847
                </p>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Spending Limit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 space-y-4"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Daily Spending
          </h3>

          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-200 dark:text-white/10"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2.5"
                  strokeDasharray={`${spentPercent}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {spentPercent}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">used</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Spent</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${active.spent.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Daily Limit
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${active.dailyLimit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Remaining</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${(active.dailyLimit - active.spent).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 space-y-3"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Security
          </h3>
          {[
            {
              icon: ShieldCheck,
              label: "3D Secure",
              desc: "Enabled",
              ok: true,
            },
            {
              icon: Lock,
              label: "Online Payments",
              desc: active.frozen ? "Blocked" : "Allowed",
              ok: !active.frozen,
            },
            {
              icon: TrendingUp,
              label: "Contactless",
              desc: active.frozen ? "Disabled" : "Up to $100",
              ok: !active.frozen,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.03] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    item.ok
                      ? "bg-green-100 dark:bg-green-500/10"
                      : "bg-red-100 dark:bg-red-500/10"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      item.ok
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  item.ok ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          ))}

          <div className="pt-2">
            <button className="btn-secondary text-sm w-full flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              Report Card Issue
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Card Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5 space-y-3"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Recent Card Activity
        </h3>
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {[
            { merchant: "Spotify Premium", amount: -9.99, date: "Today", category: "🎵" },
            { merchant: "Amazon.co.uk", amount: -42.50, date: "Yesterday", category: "📦" },
            { merchant: "Uber Eats", amount: -18.75, date: "Mar 2", category: "🍕" },
            { merchant: "Netflix", amount: -15.49, date: "Mar 1", category: "🎬" },
            { merchant: "Apple Store", amount: -299.00, date: "Feb 28", category: "🍎" },
          ].map((tx) => (
            <div
              key={tx.merchant}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-lg">
                  {tx.category}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {tx.merchant}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {tx.date}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                ${Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CardsPage;
