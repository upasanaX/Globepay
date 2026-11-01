import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send, ArrowDownLeft, QrCode, ArrowLeftRight,
  TrendingUp, TrendingDown, ArrowUpRight, Clock, ChevronRight, BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { wallets as initialWallets, transactions as initialTxns, exchangeRates as initialRates, spendingData, spendingCategories } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { walletsAPI, transactionsAPI, exchangeAPI } from "../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  }),
} as any;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<any[]>(initialWallets);
  const [transactions, setTransactions] = useState<any[]>(initialTxns);
  const [exchangeRates, setExchangeRates] = useState<any[]>(initialRates);

  useEffect(() => {
    // Load live wallets from API
    walletsAPI
      .list()
      .then((data) => {
        if (data && data.length) setWallets(data);
      })
      .catch(() => { });

    // Load live transactions from API
    transactionsAPI
      .list({ limit: 8 })
      .then((data) => {
        if (data?.transactions && data.transactions.length) {
          const mapped = data.transactions.map((tx: any) => ({
            id: tx.id,
            type: tx.type,
            name: tx.counterpart_name || "Transfer",
            avatar: (tx.counterpart_name || "GP").slice(0, 2).toUpperCase(),
            amount: tx.amount,
            currency: tx.from_currency,
            date: tx.created_at,
            status: tx.status,
          }));
          setTransactions(mapped);
        }
      })
      .catch(() => { });

    // Load live exchange rates
    exchangeAPI
      .rates("USD")
      .then((data) => {
        if (data?.rates) {
          const pairs = [
            { from: "USD", to: "EUR", rate: data.rates.EUR || 0.9234, change: 0.12 },
            { from: "USD", to: "GBP", rate: data.rates.GBP || 0.7891, change: -0.08 },
            { from: "USD", to: "JPY", rate: data.rates.JPY || 149.52, change: 0.45 },
            { from: "USD", to: "INR", rate: data.rates.INR || 83.12, change: -0.22 },
          ];
          setExchangeRates(pairs);
        }
      })
      .catch(() => { });
  }, []);

  const totalBalance = wallets.reduce((acc, w) => {
    const usdRates: Record<string, number> = { USD: 1, EUR: 1.083, GBP: 1.267, JPY: 0.00669, INR: 0.01203 };
    return acc + (Number(w.balance) || 0) * (usdRates[w.currency] || 1);
  }, 0);

  const firstName = user?.name ? user.name.split(" ")[0] : "Upasana";

  return (
    <div className="space-y-6">
      {/* === GREETING === */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your money today.</p>
        </div>
        <Link to="/send" className="btn-primary flex items-center gap-2 w-fit">
          <Send className="w-4 h-4" />
          Send Money
        </Link>
      </motion.div>

      {/* === TOTAL BALANCE CARD === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-purple-600 to-violet-600 p-6 sm:p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium">Total Balance</p>
          <p className="text-4xl sm:text-5xl font-bold mt-2">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5 text-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              +2.4%
            </div>
            <span className="text-white/60 text-sm">vs last month</span>
          </div>
        </div>
      </motion.div>

      {/* === QUICK ACTIONS === */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Send", icon: Send, color: "from-blue-500 to-blue-600", path: "/send" },
          { label: "Receive", icon: ArrowDownLeft, color: "from-green-500 to-emerald-600", path: "/dashboard" },
          { label: "Scan QR", icon: QrCode, color: "from-purple-500 to-violet-600", path: "/scanner" },
          { label: "Convert", icon: ArrowLeftRight, color: "from-orange-500 to-amber-600", path: "/convert" },
        ].map((action, i) => (
          <motion.div key={action.label} variants={fadeUp} custom={i + 2}>
            <Link
              to={action.path}
              className="glass-card p-4 flex flex-col items-center gap-3 group hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* === WALLETS & TRANSACTIONS === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallets */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Wallets</h2>
            <Link to="/convert" className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">Manage</Link>
          </div>
          {wallets.map((wallet, i) => (
            <motion.div
              key={wallet.currency}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 4}
              className="glass-card p-4 flex items-center justify-between group hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-lg">
                  {wallet.flag}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{wallet.currency}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Currency wallet</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {wallet.symbol}{(Number(wallet.balance) || 0).toLocaleString()}
                </p>
                <p className={`text-xs font-medium flex items-center gap-0.5 justify-end ${Number(wallet.change || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {Number(wallet.change || 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Number(wallet.change || 0) >= 0 ? "+" : ""}{wallet.change || "1.2"}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass-card divide-y divide-gray-100 dark:divide-white/5 overflow-hidden">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 4}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${tx.type === "received"
                      ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}>
                    {tx.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{tx.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${tx.status === "completed" ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400" :
                          tx.status === "pending" ? "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" :
                            "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}>
                        {tx.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${tx.type === "received" ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                    {tx.type === "received" ? "+" : "-"}
                    {tx.currency === "JPY" || tx.currency === "INR" ? "" : "$"}{Number(tx.amount).toLocaleString()}
                    {tx.currency === "JPY" ? " ¥" : tx.currency === "INR" ? " ₹" : ""}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{tx.currency}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* === SPENDING ANALYTICS === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-500" />
              Spending Overview
            </h2>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">Last 7 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30,30,40,0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="spending" stroke="#6366f1" strokeWidth={2} fill="url(#spendGrad)" name="Spending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-3 h-3 rounded-full bg-green-500" /> Income
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-3 h-3 rounded-full bg-brand-500" /> Spending
            </div>
          </div>
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5 space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Breakdown</h2>
          <div className="space-y-3">
            {spendingCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${cat.amount.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link to="/transactions" className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1 pt-1">
            View all transactions <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* === EXCHANGE RATES === */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Exchange Rates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {exchangeRates.slice(0, 4).map((rate, i) => (
            <motion.div
              key={`${rate.from}-${rate.to}`}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 8}
              className="glass-card p-4 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {rate.from}/{rate.to}
                </span>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${rate.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {rate.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {rate.change >= 0 ? "+" : ""}{rate.change}%
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{Number(rate.rate).toFixed(4)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
