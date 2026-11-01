import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Plus, TrendingUp, Calendar, CheckCircle, Pencil,
  Trash2, PiggyBank, Plane, GraduationCap, Home, Car, Gift, X,
  Sparkles, MapPin, ArrowRightLeft, Wallet, Landmark, Globe,
} from "lucide-react";
import { currencies, exchangeRates } from "../data/mockData";

const homeCurrency = "INR";

const countryFlags: Record<string, string> = {
  Canada: "🇨🇦",
  "United Kingdom": "🇬🇧",
  Australia: "🇦🇺",
  Japan: "🇯🇵",
  Singapore: "🇸🇬",
  "United States": "🇺🇸",
  "United Arab Emirates": "🇦🇪",
  India: "🇮🇳",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  }),
} as any;

interface GoalContribution {
  currency: string;
  amount: number;
}

interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  autoSave: number;
  category: string;
  destinationCountry: string;
  goalCurrency: string;
  bufferPercent: number;
  tags: string[];
  contributions: GoalContribution[];
}

interface GoalPreset {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  autoSave: number;
  category: string;
  destinationCountry: string;
  goalCurrency: string;
  bufferPercent: number;
  tags: string[];
  description: string;
}

const goalIcons: Record<string, any> = {
  travel: Plane,
  education: GraduationCap,
  home: Home,
  car: Car,
  gift: Gift,
  emergency: PiggyBank,
  investment: Landmark,
  remittance: Wallet,
  visa: Globe,
  buffer: ArrowRightLeft,
  default: Target,
};

const currencyNameMap = new Map(currencies.map((currency) => [currency.code, currency]));
const exchangeRateMap = new Map(exchangeRates.map((rate) => [`${rate.from}-${rate.to}`, rate.rate]));

const destinationOptions = [
  { country: "Canada", currency: "CAD", label: "Study / settle in Canada" },
  { country: "United Kingdom", currency: "GBP", label: "Work or relocate to the UK" },
  { country: "Australia", currency: "AUD", label: "Visa + arrival costs in Australia" },
  { country: "Japan", currency: "JPY", label: "International travel to Japan" },
  { country: "Singapore", currency: "SGD", label: "Overseas investing in Singapore" },
  { country: "United States", currency: "USD", label: "US travel or emergency cover" },
  { country: "United Arab Emirates", currency: "AED", label: "Family support or moving to UAE" },
  { country: "India", currency: "INR", label: "Remittances to India" },
];

const smartSuggestions: GoalPreset[] = [
  {
    id: "travel-japan",
    name: "International Travel — Japan",
    icon: "travel",
    targetAmount: 1200000,
    currentAmount: 684000,
    deadline: "2026-11-15",
    color: "from-blue-500 to-cyan-500",
    autoSave: 80000,
    category: "Travel",
    destinationCountry: "Japan",
    goalCurrency: "JPY",
    bufferPercent: 7,
    tags: ["International", "Forex-related"],
    description: "Planning a trip to Japan? Build a JPY goal and protect it with a forex buffer.",
  },
  {
    id: "education-canada",
    name: "Foreign Education — Canada",
    icon: "education",
    targetAmount: 42000,
    currentAmount: 16800,
    deadline: "2027-06-30",
    color: "from-purple-500 to-violet-500",
    autoSave: 1500,
    category: "Education",
    destinationCountry: "Canada",
    goalCurrency: "CAD",
    bufferPercent: 8,
    tags: ["International", "Forex-related"],
    description: "Studying in Canada? Start a CAD goal for tuition, living, and transfer costs.",
  },
  {
    id: "visa-australia",
    name: "Visa & Immigration — Australia",
    icon: "visa",
    targetAmount: 12500,
    currentAmount: 6200,
    deadline: "2026-10-01",
    color: "from-emerald-500 to-teal-500",
    autoSave: 500,
    category: "Migration",
    destinationCountry: "Australia",
    goalCurrency: "AUD",
    bufferPercent: 6,
    tags: ["International", "Forex-related"],
    description: "Visa fees move with FX rates—track your AUD goal with a buffer.",
  },
  {
    id: "emergency-uk",
    name: "Emergency Fund — Abroad Use",
    icon: "emergency",
    targetAmount: 18000,
    currentAmount: 9250,
    deadline: "2026-12-31",
    color: "from-green-500 to-emerald-500",
    autoSave: 900,
    category: "Safety",
    destinationCountry: "United Kingdom",
    goalCurrency: "GBP",
    bufferPercent: 10,
    tags: ["International", "Forex-related"],
    description: "Keep a GBP emergency cushion ready for travel, work, or relocation.",
  },
  {
    id: "investment-singapore",
    name: "Overseas Investment — Singapore",
    icon: "investment",
    targetAmount: 25000,
    currentAmount: 9750,
    deadline: "2027-03-31",
    color: "from-orange-500 to-amber-500",
    autoSave: 1200,
    category: "Wealth",
    destinationCountry: "Singapore",
    goalCurrency: "SGD",
    bufferPercent: 5,
    tags: ["International", "Forex-related"],
    description: "Build an SGD goal for cross-border diversification and investing.",
  },
  {
    id: "remittance-india",
    name: "Family Support / Remittances",
    icon: "remittance",
    targetAmount: 1500000,
    currentAmount: 820000,
    deadline: "2026-09-30",
    color: "from-pink-500 to-rose-500",
    autoSave: 85000,
    category: "Remittance",
    destinationCountry: "India",
    goalCurrency: "INR",
    bufferPercent: 4,
    tags: ["International", "Forex-related"],
    description: "Plan regular remittances with a stable INR target and rate buffer.",
  },
  {
    id: "buffer-usd",
    name: "Currency Exchange Buffer",
    icon: "buffer",
    targetAmount: 30000,
    currentAmount: 11800,
    deadline: "2026-08-31",
    color: "from-indigo-500 to-purple-500",
    autoSave: 1800,
    category: "Protection",
    destinationCountry: "United States",
    goalCurrency: "USD",
    bufferPercent: 12,
    tags: ["International", "Forex-related"],
    description: "Hold a USD buffer so exchange-rate swings do not delay other goals.",
  },
];

const initialGoals: SavingsGoal[] = smartSuggestions.map((goal) => ({
  ...goal,
  contributions: [{ currency: goal.goalCurrency, amount: goal.currentAmount }],
}));

const CircularProgress: React.FC<{ percentage: number; size?: number; strokeWidth?: number }> = ({
  percentage, size = 80, strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="none"
        className="text-gray-200 dark:text-white/10"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke="url(#progressGrad)"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        strokeDasharray={circumference}
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const getExchangeRate = (from: string, to: string) => {
  if (from === to) return 1;
  const direct = exchangeRateMap.get(`${from}-${to}`);
  if (direct) return direct;
  const inverse = exchangeRateMap.get(`${to}-${from}`);
  if (inverse) return 1 / inverse;
  return 1;
};

const convertAmount = (amount: number, from: string, to: string) => amount * getExchangeRate(from, to);

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  } catch {
    const symbol = currencyNameMap.get(currency)?.symbol ?? currency;
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
};

const SavingsGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState(initialGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState(homeCurrency);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [newGoalAutoSave, setNewGoalAutoSave] = useState("");
  const [newGoalIcon, setNewGoalIcon] = useState("travel");
  const [newGoalCurrency, setNewGoalCurrency] = useState("CAD");
  const [newGoalDestination, setNewGoalDestination] = useState("Canada");
  const [newGoalBufferPercent, setNewGoalBufferPercent] = useState("8");
  const [newGoalCategory, setNewGoalCategory] = useState("Education");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpCurrency, setTopUpCurrency] = useState(homeCurrency);

  const totalSavedHome = goals.reduce((acc, goal) => acc + convertAmount(goal.currentAmount, goal.goalCurrency, homeCurrency), 0);
  const totalTargetHome = goals.reduce((acc, goal) => acc + convertAmount(goal.targetAmount, goal.goalCurrency, homeCurrency), 0);
  const bufferReserveHome = goals.reduce((acc, goal) => acc + convertAmount(goal.targetAmount * (goal.bufferPercent / 100), goal.goalCurrency, homeCurrency), 0);
  const overallProgress = totalTargetHome > 0 ? Math.round((totalSavedHome / totalTargetHome) * 100) : 0;
  const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length;
  const monthlySavingHome = goals.reduce((acc, goal) => acc + convertAmount(goal.autoSave, goal.goalCurrency, homeCurrency), 0);
  const activeGoal = goals.find((goal) => goal.id === activeGoalId) || null;
  const totalSavedDisplay = convertAmount(totalSavedHome, homeCurrency, displayCurrency);
  const totalTargetDisplay = convertAmount(totalTargetHome, homeCurrency, displayCurrency);
  const bufferReserveDisplay = convertAmount(bufferReserveHome, homeCurrency, displayCurrency);
  const monthlySavingDisplay = convertAmount(monthlySavingHome, homeCurrency, displayCurrency);

  const applySuggestion = (preset: GoalPreset) => {
    setNewGoalName(preset.name);
    setNewGoalTarget(String(preset.targetAmount));
    setNewGoalDeadline(preset.deadline);
    setNewGoalAutoSave(String(preset.autoSave));
    setNewGoalIcon(preset.icon);
    setNewGoalCurrency(preset.goalCurrency);
    setNewGoalDestination(preset.destinationCountry);
    setNewGoalBufferPercent(String(preset.bufferPercent));
    setNewGoalCategory(preset.category);
    setShowAddModal(true);
  };

  const handleDestinationChange = (country: string) => {
    setNewGoalDestination(country);
    const match = destinationOptions.find((option) => option.country === country);
    if (match) {
      setNewGoalCurrency(match.currency);
    }
  };

  const handleAddGoal = () => {
    if (!newGoalName || !newGoalTarget || !newGoalDestination || !newGoalCurrency) return;

    const target = parseFloat(newGoalTarget);
    if (Number.isNaN(target) || target <= 0) return;

    const autoSave = parseFloat(newGoalAutoSave) || 0;
    const bufferPercent = parseFloat(newGoalBufferPercent) || 0;

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoalName,
      icon: newGoalIcon,
      targetAmount: target,
      currentAmount: 0,
      deadline: newGoalDeadline || "2027-01-01",
      color: ["from-blue-500 to-cyan-500", "from-green-500 to-emerald-500", "from-purple-500 to-violet-500", "from-orange-500 to-amber-500", "from-pink-500 to-rose-500", "from-indigo-500 to-purple-500"][Math.floor(Math.random() * 6)],
      autoSave,
      category: newGoalCategory || "International",
      destinationCountry: newGoalDestination,
      goalCurrency: newGoalCurrency,
      bufferPercent,
      tags: ["International", "Forex-related"],
      contributions: [],
    };

    setGoals([...goals, newGoal]);
    setShowAddModal(false);
    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalDeadline("");
    setNewGoalAutoSave("");
    setNewGoalIcon("travel");
    setNewGoalCurrency("CAD");
    setNewGoalDestination("Canada");
    setNewGoalBufferPercent("8");
    setNewGoalCategory("Education");
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const openTopUpModal = (goal: SavingsGoal) => {
    setActiveGoalId(goal.id);
    setTopUpAmount("");
    setTopUpCurrency(goal.goalCurrency);
    setShowTopUpModal(true);
  };

  const handleTopUp = () => {
    if (!activeGoal || !topUpAmount) return;

    const amount = parseFloat(topUpAmount);
    if (Number.isNaN(amount) || amount <= 0) return;

    setGoals(goals.map((goal) => {
      if (goal.id !== activeGoal.id) return goal;

      const converted = convertAmount(amount, topUpCurrency, goal.goalCurrency);
      return {
        ...goal,
        currentAmount: goal.currentAmount + converted,
        contributions: [...goal.contributions, { currency: topUpCurrency, amount }],
      };
    }));

    setShowTopUpModal(false);
    setActiveGoalId(null);
    setTopUpAmount("");
    setTopUpCurrency(homeCurrency);
  };

  const formatRateLabel = (from: string, to: string) => {
    const rate = getExchangeRate(from, to);
    if (from === to) return `${from} ↔ ${to}`;
    return `1 ${from} = ${rate.toLocaleString(undefined, { maximumFractionDigits: rate > 10 ? 2 : 4 })} ${to}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Cross-Border Savings Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Save in multiple currencies for travel, relocation, study, remittances, and global investing.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">International</span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">Forex-related</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300">Home currency: {homeCurrency}</span>
          </div>
        </div>
        <div className="flex flex-col sm:items-end gap-3">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5" /> Display currency
            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value)}
              className="ml-2 input-field !py-2 !min-h-0 !text-sm"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-sm w-fit"
          >
            <Plus className="w-4 h-4" /> New Cross-Border Goal
          </button>
        </div>
      </motion.div>

      {/* Smart suggestions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Smart cross-border suggestions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {smartSuggestions.slice(0, 3).map((suggestion) => {
            const IconComp = goalIcons[suggestion.icon] || goalIcons.default;
            return (
              <button
                key={suggestion.name}
                onClick={() => applySuggestion(suggestion)}
                className="glass-card p-4 text-left hover:shadow-glow/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${suggestion.color} flex items-center justify-center text-white`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{suggestion.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {suggestion.destinationCountry} · {suggestion.goalCurrency}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300">
                    {suggestion.tags[0]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{suggestion.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatCurrency(suggestion.targetAmount, suggestion.goalCurrency)}</span>
                  <span>Buffer {suggestion.bufferPercent}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: `Total Saved (${displayCurrency})`,
            value: formatCurrency(totalSavedDisplay, displayCurrency),
            icon: PiggyBank,
            color: "from-brand-500 to-purple-500",
            sub: `normalized from ${homeCurrency}`,
          },
          {
            label: "Forex Buffer Reserve",
            value: formatCurrency(bufferReserveDisplay, displayCurrency),
            icon: ArrowRightLeft,
            color: "from-green-500 to-emerald-500",
            sub: "safety margin for rate swings",
          },
          {
            label: "Goals Completed",
            value: `${completedGoals}/${goals.length}`,
            icon: CheckCircle,
            color: "from-blue-500 to-cyan-500",
            sub: "cross-border goals achieved",
          },
          {
            label: "Monthly Auto-Save",
            value: formatCurrency(monthlySavingDisplay, displayCurrency),
            icon: Calendar,
            color: "from-orange-500 to-amber-500",
            sub: `displayed in ${displayCurrency}`,
          },
        ].map((card, i) => (
          <motion.div key={card.label} variants={fadeUp} custom={i} className="glass-card p-5 group hover:shadow-glow/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Overall progress bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" /> Overall Savings Progress
          </h3>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{overallProgress}%</span>
        </div>
        <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-violet-500 rounded-full relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse-slow rounded-full" />
          </motion.div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatCurrency(totalSavedDisplay, displayCurrency)} saved</span>
          <span>{formatCurrency(Math.max(totalTargetDisplay - totalSavedDisplay, 0), displayCurrency)} remaining</span>
        </div>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal, i) => {
          const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          const isComplete = goal.currentAmount >= goal.targetAmount;
          const IconComp = goalIcons[goal.icon] || goalIcons.default;
          const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const displayEquivalent = convertAmount(goal.currentAmount, goal.goalCurrency, displayCurrency);
          const targetDisplayEquivalent = convertAmount(goal.targetAmount, goal.goalCurrency, displayCurrency);
          const bufferAmount = goal.targetAmount * (goal.bufferPercent / 100);
          const bufferTarget = goal.targetAmount + bufferAmount;
          const bufferProgress = Math.min(Math.round((goal.currentAmount / bufferTarget) * 100), 100);
          const topContributions = goal.contributions.slice(-3);
          const flag = countryFlags[goal.destinationCountry] || "🌍";

          return (
            <motion.div
              key={goal.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              className={`glass-card p-5 relative overflow-hidden group ${isComplete ? "ring-2 ring-green-500/30" : ""}`}
            >
              {isComplete && (
                <div className="absolute top-3 right-3 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Complete!
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="relative">
                  <CircularProgress percentage={percentage} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{percentage}%</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center text-white`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{goal.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span>{flag}</span>
                        <span>{goal.destinationCountry}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {goal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                      {goal.goalCurrency}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Destination: {goal.destinationCountry}
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3" /> {formatRateLabel(homeCurrency, goal.goalCurrency)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span>Target: {formatCurrency(goal.targetAmount, goal.goalCurrency)}</span>
                      <span>{displayCurrency} equivalent: {formatCurrency(targetDisplayEquivalent, displayCurrency)}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.currentAmount, goal.goalCurrency)}</span>
                      <span className="text-gray-500 dark:text-gray-400">{formatCurrency(goal.targetAmount, goal.goalCurrency)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                        className={`h-full bg-gradient-to-r ${goal.color} rounded-full`}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <span>Buffer: +{goal.bufferPercent}% ({formatCurrency(bufferAmount, goal.goalCurrency)})</span>
                      <span>{bufferProgress}% of buffer-safe target</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                    {topContributions.map((contribution, index) => (
                      <span key={`${contribution.currency}-${index}`} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5">
                        {formatCurrency(contribution.amount, contribution.currency)} saved in {contribution.currency}
                      </span>
                    ))}
                    {goal.contributions.length > topContributions.length && (
                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5">
                        +{goal.contributions.length - topContributions.length} more currency entries
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {isComplete ? "Achieved!" : `${daysLeft} days left`}
                    </span>
                    {goal.autoSave > 0 && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {formatCurrency(goal.autoSave, goal.goalCurrency)}/mo auto
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      ≈ {formatCurrency(displayEquivalent, displayCurrency)} in {displayCurrency}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => openTopUpModal(goal)}
                      className="btn-primary text-xs !px-3 !py-1.5 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add funds
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">New Cross-Border Savings Goal</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="rounded-2xl border border-brand-500/20 bg-brand-50/60 dark:bg-brand-500/5 p-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-brand-500" /> Cross-border setup
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Pick a destination country, choose the target currency, and track exchange-rate impact from your home currency.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Goal Name</label>
                <input
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Foreign Education — Canada"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Destination Country</label>
                  <select value={newGoalDestination} onChange={(e) => handleDestinationChange(e.target.value)} className="input-field">
                    {destinationOptions.map((option) => (
                      <option key={option.country} value={option.country}>{option.country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Goal Currency</label>
                  <select value={newGoalCurrency} onChange={(e) => setNewGoalCurrency(e.target.value)} className="input-field">
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} — {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Target Amount ({newGoalCurrency})</label>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="input-field"
                  placeholder="5000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Deadline</label>
                  <input type="date" value={newGoalDeadline} onChange={(e) => setNewGoalDeadline(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Auto-Save / mo</label>
                  <input type="number" value={newGoalAutoSave} onChange={(e) => setNewGoalAutoSave(e.target.value)} className="input-field" placeholder="100" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Forex Buffer %</label>
                  <input type="number" value={newGoalBufferPercent} onChange={(e) => setNewGoalBufferPercent(e.target.value)} className="input-field" placeholder="8" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Category</label>
                  <select value={newGoalCategory} onChange={(e) => setNewGoalCategory(e.target.value)} className="input-field">
                    <option value="Travel">International Travel</option>
                    <option value="Safety">Emergency Fund</option>
                    <option value="Education">Foreign Education</option>
                    <option value="Migration">Visa & Immigration Expenses</option>
                    <option value="Wealth">Overseas Investment</option>
                    <option value="Remittance">Family Support / Remittances</option>
                    <option value="Protection">Currency Exchange Buffer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(goalIcons).map(([key, Icon]) => (
                      <button
                        key={key}
                        onClick={() => setNewGoalIcon(key)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          newGoalIcon === key
                            ? "bg-brand-500 text-white scale-110"
                            : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5 text-sm">
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-brand-500" /> Conversion preview
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {formatRateLabel(homeCurrency, newGoalCurrency)} ·
                  {newGoalTarget ? ` ${formatCurrency(parseFloat(newGoalTarget) || 0, newGoalCurrency)} ≈ ${formatCurrency(convertAmount(parseFloat(newGoalTarget) || 0, newGoalCurrency, homeCurrency), homeCurrency)}` : " enter a target to preview conversion"}
                </p>
              </div>

              <button onClick={handleAddGoal} className="btn-primary w-full flex items-center justify-center gap-2">
                <Target className="w-4 h-4" /> Create Cross-Border Goal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top up modal */}
      <AnimatePresence>
        {showTopUpModal && activeGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowTopUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add funds to {activeGoal.name}</h3>
                <button onClick={() => setShowTopUpModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">{activeGoal.destinationCountry} · {activeGoal.goalCurrency}</p>
                <p className="mt-1 text-xs">Current progress: {formatCurrency(activeGoal.currentAmount, activeGoal.goalCurrency)} / {formatCurrency(activeGoal.targetAmount, activeGoal.goalCurrency)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Top-up Amount</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="input-field"
                  placeholder="250"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Saved In Currency</label>
                <select value={topUpCurrency} onChange={(e) => setTopUpCurrency(e.target.value)} className="input-field">
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} — {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-brand-500/20 bg-brand-50/60 dark:bg-brand-500/5 p-4 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-brand-500" /> Conversion impact
                </p>
                <p className="mt-1 text-xs">
                  {topUpAmount
                    ? `${formatCurrency(parseFloat(topUpAmount) || 0, topUpCurrency)} ≈ ${formatCurrency(convertAmount(parseFloat(topUpAmount) || 0, topUpCurrency, activeGoal.goalCurrency), activeGoal.goalCurrency)} added to the goal.`
                    : `Enter an amount to see how it converts into ${activeGoal.goalCurrency}.`}
                </p>
              </div>

              <button onClick={handleTopUp} className="btn-primary w-full flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Apply top-up
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavingsGoalsPage;
