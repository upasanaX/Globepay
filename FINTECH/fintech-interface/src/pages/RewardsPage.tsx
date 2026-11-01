import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift, Star, Trophy, Zap, Crown, Gem,
  Clock, CheckCircle, Lock, Sparkles,
  CreditCard, Send, ArrowLeftRight, Users, ShieldCheck,
  TrendingUp, Flame, Award, X,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  }),
} as any;

/* ────── Data ────── */

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  icon: any;
  gradient: string;
  redeemed: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  total: number;
  xp: number;
  unlocked: boolean;
  gradient: string;
}

interface Activity {
  id: string;
  action: string;
  points: number;
  date: string;
  type: "earned" | "redeemed";
}

const userStats = {
  totalPoints: 4850,
  level: 7,
  levelName: "Gold Member",
  nextLevel: "Platinum",
  xpCurrent: 4850,
  xpNext: 6000,
  streak: 12,
  totalRedeemed: 3200,
  rank: 156,
};

const rewards: Reward[] = [
  {
    id: "r1", title: "Zero-Fee Transfer", description: "Send money internationally with no transfer fee (up to $500)",
    pointsCost: 500, category: "transfers", icon: Send, gradient: "from-blue-500 to-cyan-500", redeemed: false,
  },
  {
    id: "r2", title: "Premium Rate Boost", description: "Get 0.5% better exchange rates for 24 hours",
    pointsCost: 750, category: "exchange", icon: ArrowLeftRight, gradient: "from-purple-500 to-violet-500", redeemed: false,
  },
  {
    id: "r3", title: "Virtual Card Skin", description: "Unlock the exclusive holographic card design",
    pointsCost: 1200, category: "cards", icon: CreditCard, gradient: "from-pink-500 to-rose-500", redeemed: false,
  },
  {
    id: "r4", title: "Cashback Boost 2x", description: "Double your cashback on all purchases for 48 hours",
    pointsCost: 1000, category: "cashback", icon: Zap, gradient: "from-amber-500 to-orange-500", redeemed: false,
  },
  {
    id: "r5", title: "$5 Account Credit", description: "Get $5 credited directly to your wallet",
    pointsCost: 2000, category: "credit", icon: Gift, gradient: "from-green-500 to-emerald-500", redeemed: false,
  },
  {
    id: "r6", title: "Priority Support", description: "Skip the queue — get 24/7 priority customer support for 30 days",
    pointsCost: 800, category: "support", icon: ShieldCheck, gradient: "from-indigo-500 to-blue-500", redeemed: false,
  },
  {
    id: "r7", title: "$25 Account Credit", description: "Get $25 credited directly to your wallet",
    pointsCost: 8000, category: "credit", icon: Crown, gradient: "from-yellow-500 to-amber-500", redeemed: false,
  },
  {
    id: "r8", title: "Refer-a-Friend Bonus", description: "Earn 500 bonus points per referral (up to 5 friends)",
    pointsCost: 300, category: "social", icon: Users, gradient: "from-teal-500 to-cyan-500", redeemed: false,
  },
];

const achievements: Achievement[] = [
  {
    id: "a1", title: "First Transfer", description: "Send your first payment",
    icon: Send, progress: 1, total: 1, xp: 100, unlocked: true, gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "a2", title: "Frequent Flyer", description: "Make 50 international transfers",
    icon: TrendingUp, progress: 34, total: 50, xp: 500, unlocked: false, gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "a3", title: "Currency Explorer", description: "Convert money in 10 different currencies",
    icon: ArrowLeftRight, progress: 6, total: 10, xp: 300, unlocked: false, gradient: "from-purple-500 to-violet-500",
  },
  {
    id: "a4", title: "Hot Streak", description: "Log in for 30 consecutive days",
    icon: Flame, progress: 12, total: 30, xp: 400, unlocked: false, gradient: "from-orange-500 to-red-500",
  },
  {
    id: "a5", title: "Big Spender", description: "Transfer over $10,000 total",
    icon: Crown, progress: 10000, total: 10000, xp: 750, unlocked: true, gradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "a6", title: "Social Butterfly", description: "Refer 5 friends to GlobePay",
    icon: Users, progress: 2, total: 5, xp: 600, unlocked: false, gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "a7", title: "Savings Star", description: "Complete 3 savings goals",
    icon: Star, progress: 1, total: 3, xp: 500, unlocked: false, gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "a8", title: "Bill Master", description: "Pay all bills on time for 6 months",
    icon: CheckCircle, progress: 4, total: 6, xp: 350, unlocked: false, gradient: "from-teal-500 to-green-500",
  },
];

const recentActivity: Activity[] = [
  { id: "h1", action: "International transfer to UK", points: 50, date: "Today, 2:30 PM", type: "earned" },
  { id: "h2", action: "Redeemed Zero-Fee Transfer", points: -500, date: "Yesterday, 10:15 AM", type: "redeemed" },
  { id: "h3", action: "Daily login streak (Day 12)", points: 25, date: "Today, 9:00 AM", type: "earned" },
  { id: "h4", action: "Currency conversion EUR → JPY", points: 30, date: "Mar 3, 4:45 PM", type: "earned" },
  { id: "h5", action: "Referred a friend (Alex)", points: 200, date: "Mar 2, 1:20 PM", type: "earned" },
  { id: "h6", action: "Redeemed Cashback Boost", points: -1000, date: "Mar 1, 11:00 AM", type: "redeemed" },
  { id: "h7", action: "Paid electricity bill on time", points: 15, date: "Feb 28, 3:00 PM", type: "earned" },
  { id: "h8", action: "Weekly savings auto-deposit", points: 40, date: "Feb 27, 12:00 PM", type: "earned" },
];

/* ────── Helpers ────── */

const tierInfo = [
  { name: "Bronze", min: 0, color: "text-amber-700", bg: "bg-amber-100 dark:bg-amber-900/30" },
  { name: "Silver", min: 1000, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700/40" },
  { name: "Gold", min: 3000, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Platinum", min: 6000, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  { name: "Diamond", min: 10000, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
];

/* ────── Component ────── */

const RewardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"rewards" | "achievements" | "history">("rewards");
  const [rewardFilter, setRewardFilter] = useState("all");
  const [rewardsList, setRewardsList] = useState(rewards);
  const [showRedeemModal, setShowRedeemModal] = useState<Reward | null>(null);
  const [points, setPoints] = useState(userStats.totalPoints);

  const rewardCategories = ["all", "transfers", "exchange", "cashback", "credit", "cards", "social", "support"];

  const filteredRewards = rewardFilter === "all"
    ? rewardsList
    : rewardsList.filter((r) => r.category === rewardFilter);

  const handleRedeem = (reward: Reward) => {
    if (points >= reward.pointsCost) {
      setPoints((p) => p - reward.pointsCost);
      setRewardsList((prev) =>
        prev.map((r) => (r.id === reward.id ? { ...r, redeemed: true } : r))
      );
      setShowRedeemModal(null);
    }
  };

  const levelProgress = ((points - 3000) / (6000 - 3000)) * 100;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
            Rewards Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Earn points on every action. Redeem for exclusive perks.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-700/30 rounded-xl">
          <Flame className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {userStats.streak}-day streak
          </span>
        </div>
      </motion.div>

      {/* ── Points & Level Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-purple-600 to-violet-600 p-6 sm:p-8 text-white"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-4 right-4 opacity-[0.08]">
          <Crown className="w-36 h-36 text-yellow-300" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left — Points */}
          <div>
            <p className="text-sm opacity-80 font-medium">Total Reward Points</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {points.toLocaleString()}
              </span>
              <Gem className="w-6 h-6 text-yellow-300" />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-semibold flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-300" />
                Level {userStats.level} — {userStats.levelName}
              </span>
            </div>
          </div>

          {/* Right — Level Progress */}
          <div className="lg:w-80">
            <div className="flex justify-between text-sm mb-2">
              <span className="opacity-80">Progress to {userStats.nextLevel}</span>
              <span className="font-semibold">{points.toLocaleString()} / 6,000</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(levelProgress, 100)}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs opacity-70 mt-2">
              {(6000 - points).toLocaleString()} points to reach {userStats.nextLevel}
            </p>
          </div>
        </div>

        {/* Tier indicators */}
        <div className="relative z-10 flex items-center gap-3 mt-6 pt-6 border-t border-white/10 overflow-x-auto pb-1">
          {tierInfo.map((tier, i) => {
            const isActive = points >= tier.min;
            const isCurrent = i < tierInfo.length - 1
              ? points >= tier.min && points < tierInfo[i + 1].min
              : points >= tier.min;
            return (
              <div
                key={tier.name}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? "bg-white text-purple-700 shadow-lg scale-105"
                    : isActive
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {isActive && <CheckCircle className="w-3.5 h-3.5" />}
                {!isActive && <Lock className="w-3.5 h-3.5" />}
                {tier.name}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Quick Stats ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Points Earned", value: `${(points + userStats.totalRedeemed).toLocaleString()}`, icon: Sparkles, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
          { label: "Points Redeemed", value: userStats.totalRedeemed.toLocaleString(), icon: Gift, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
          { label: "Login Streak", value: `${userStats.streak} days`, icon: Flame, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Global Rank", value: `#${userStats.rank}`, icon: Trophy, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-gray-100 dark:border-white/5"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 dark:bg-surface-800 p-1 rounded-xl w-fit">
        {(["rewards", "achievements", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
              activeTab === tab
                ? "bg-white dark:bg-surface-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── TAB: Rewards Store ── */}
      {activeTab === "rewards" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {rewardCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setRewardFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize ${
                  rewardFilter === cat
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                    : "bg-gray-100 dark:bg-surface-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-surface-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Rewards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRewards.map((reward, i) => {
                const canAfford = points >= reward.pointsCost;
                return (
                  <motion.div
                    key={reward.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-lg transition-all ${
                      reward.redeemed ? "opacity-60" : ""
                    }`}
                  >
                    {/* Icon header */}
                    <div className={`bg-gradient-to-br ${reward.gradient} p-5 flex items-center justify-center`}>
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                        <reward.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white">{reward.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {reward.description}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1.5">
                          <Gem className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {reward.pointsCost.toLocaleString()}
                          </span>
                        </div>

                        {reward.redeemed ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <CheckCircle className="w-4 h-4" /> Redeemed
                          </span>
                        ) : (
                          <button
                            onClick={() => canAfford && setShowRedeemModal(reward)}
                            disabled={!canAfford}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              canAfford
                                ? "bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/25"
                                : "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {canAfford ? "Redeem" : "Not enough"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ── TAB: Achievements ── */}
      {activeTab === "achievements" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border border-yellow-200 dark:border-yellow-700/25 rounded-2xl p-4">
            <Award className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {achievements.filter((a) => a.unlocked).length} of {achievements.length} Achievements Unlocked
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Earn {achievements.filter((a) => !a.unlocked).reduce((s, a) => s + a.xp, 0).toLocaleString()} more XP by completing all achievements
              </p>
            </div>
          </div>

          {/* Achievements grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((ach, i) => {
              const pct = Math.min((ach.progress / ach.total) * 100, 100);
              return (
                <motion.div
                  key={ach.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className={`bg-white dark:bg-surface-800 rounded-2xl border p-5 transition-all hover:shadow-md ${
                    ach.unlocked ? "border-yellow-300 dark:border-yellow-600/30 ring-2 ring-yellow-400/20" : "border-gray-100 dark:border-white/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ach.gradient} flex items-center justify-center flex-shrink-0 ${
                      !ach.unlocked ? "opacity-40 grayscale" : ""
                    }`}>
                      <ach.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{ach.title}</h3>
                        {ach.unlocked && (
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/25 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold rounded-full uppercase">
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ach.description}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">
                            {ach.progress >= ach.total
                              ? "Completed!"
                              : `${ach.progress} / ${ach.total}`}
                          </span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">+{ach.xp} XP</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${ach.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── TAB: History ── */}
      {activeTab === "history" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {/* How You Earn box */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 p-5 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Ways to Earn Points
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { action: "Send money", pts: "+50 pts", icon: Send },
                { action: "Convert currency", pts: "+30 pts", icon: ArrowLeftRight },
                { action: "Daily login", pts: "+10 pts", icon: Flame },
                { action: "Pay bills on time", pts: "+15 pts", icon: CheckCircle },
                { action: "Refer a friend", pts: "+200 pts", icon: Users },
                { action: "Complete profile", pts: "+100 pts", icon: ShieldCheck },
                { action: "Savings deposit", pts: "+40 pts", icon: TrendingUp },
                { action: "Streak bonus (7d)", pts: "+75 pts", icon: Zap },
              ].map((item) => (
                <div
                  key={item.action}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl"
                >
                  <item.icon className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.action}</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.pts}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity list */}
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Recent Activity
          </h3>
          {recentActivity.map((item, i) => (
            <motion.div
              key={item.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center gap-4 bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-white/5 p-4"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.type === "earned"
                    ? "bg-emerald-50 dark:bg-emerald-900/15"
                    : "bg-rose-50 dark:bg-rose-900/15"
                }`}
              >
                {item.type === "earned" ? (
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Gift className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
              </div>
              <span
                className={`text-sm font-bold ${
                  item.type === "earned"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {item.points > 0 ? "+" : ""}
                {item.points.toLocaleString()} pts
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Redeem Modal ── */}
      <AnimatePresence>
        {showRedeemModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRedeemModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal header */}
              <div className={`bg-gradient-to-br ${showRedeemModal.gradient} p-8 flex flex-col items-center text-white relative`}>
                <button
                  onClick={() => setShowRedeemModal(null)}
                  className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                  <showRedeemModal.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">{showRedeemModal.title}</h3>
                <p className="text-sm opacity-80 text-center mt-2">{showRedeemModal.description}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cost</span>
                  <div className="flex items-center gap-1.5">
                    <Gem className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      {showRedeemModal.pointsCost.toLocaleString()} points
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Your Balance</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {points.toLocaleString()} points
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">After Redemption</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {(points - showRedeemModal.pointsCost).toLocaleString()} points
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowRedeemModal(null)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRedeem(showRedeemModal)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Redeem
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsPage;
