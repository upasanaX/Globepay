import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, TrendingDown, ArrowUpRight, RefreshCw } from "lucide-react";
import { currencies, exchangeRates } from "../data/mockData";

const ConvertPage: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");

  const rate = 0.9234;
  const converted = (parseFloat(amount || "0") * rate).toFixed(2);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Currency Converter</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time exchange rates with zero hidden fees.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 sm:p-8 space-y-6"
      >
        {/* From */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">From</label>
          <div className="flex bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-brand-500/50 transition-all">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent px-4 py-4 text-gray-900 dark:text-white text-2xl font-bold outline-none"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-transparent text-gray-700 dark:text-gray-300 font-medium px-4 outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center">
          <motion.button
            whileTap={{ rotate: 180 }}
            onClick={handleSwap}
            className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </motion.button>
        </div>

        {/* To */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">To</label>
          <div className="flex bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
            <div className="flex-1 px-4 py-4 text-green-600 dark:text-green-400 text-2xl font-bold">
              {converted}
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-transparent text-gray-700 dark:text-gray-300 font-medium px-4 outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rate Info */}
        <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Mid-market rate</span>
            <span className="font-medium text-gray-900 dark:text-white">1 {fromCurrency} = {rate} {toCurrency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Conversion fee</span>
            <span className="font-medium text-green-600">$0.00 (Free)</span>
          </div>
        </div>

        <button className="btn-primary w-full flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Convert Now
        </button>
      </motion.div>

      {/* Live Rates Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Rates</h2>
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {exchangeRates.map((rate) => (
              <div key={`${rate.from}-${rate.to}`} className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {rate.from}/{rate.to}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900 dark:text-white">{rate.rate.toFixed(4)}</span>
                  <span className={`text-xs font-medium flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
                    rate.change >= 0
                      ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}>
                    {rate.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {rate.change >= 0 ? "+" : ""}{rate.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConvertPage;
