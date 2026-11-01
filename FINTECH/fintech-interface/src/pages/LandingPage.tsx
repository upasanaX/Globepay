import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, ArrowRight, Star, Wallet, Zap, Shield, QrCode,
  CreditCard, CheckCircle, ArrowLeftRight, Lock,
  ChevronDown, Sun, Moon, Sparkles, Building2,
  Users, Check, ExternalLink, HelpCircle
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { currencies } from "../data/mockData";
import GlobePayLogo, { GlobePayMark } from "../components/common/GlobePayLogo";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, login } = useAuth();

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // FX Calculation
  const rates: Record<string, number> = {
    USD_EUR: 0.9234,
    USD_GBP: 0.7891,
    USD_JPY: 149.52,
    USD_INR: 83.12,
    EUR_USD: 1.0829,
    EUR_GBP: 0.8546,
    GBP_USD: 1.2673,
    GBP_EUR: 1.1701,
  };
  const key = `${fromCurrency}_${toCurrency}`;
  const rate = rates[key] || 0.9234;
  const parsedAmount = parseFloat(amount) || 0;
  const convertedAmount = (parsedAmount * rate).toFixed(2);
  const gpFee = (parsedAmount * 0.0035).toFixed(2);
  const bankFee = (parsedAmount * 0.038).toFixed(2); // Typical bank 3.8% markup
  const savings = Math.max(0, parseFloat(bankFee) - parseFloat(gpFee)).toFixed(2);

  const handleInstantDemo = async () => {
    setIsDemoLoading(true);
    try {
      await login("upasana.roy@email.com", "GlobePay@123");
      navigate("/dashboard");
    } catch {
      navigate("/login");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-brand-500 selection:text-white">
      {/* ─── 1. TOP ANNOUNCEMENT & TRUST BAR ───────────────────────── */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs font-medium border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Production API
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            Regulated & Bank-Grade 256-bit TLS Security
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden md:inline">Over $2.4 Billion Processed Across 180+ Countries</span>
        </div>
      </div>

      {/* ─── 2. MAIN NAVIGATION ───────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center">
              <GlobePayLogo size="md" showTagline={true} />
            </Link>

            {/* Navigation links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Capabilities</a>
              <a href="#calculator" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Exchange Rates</a>
              <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">How It Works</a>
              <a href="#security" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Security</a>
            </div>

            {/* Right side authentication & theme controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-brand-600/25 transition-all"
                  >
                    Open Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── 3. HERO SECTION WITH DIRECT ONBOARDING ─────────────────── */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Col: Prominent Value & Clear Login Access */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Like Google Pay — Everywhere on Earth
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
                Scan & Pay Anywhere in the World,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400">
                  in 1 Tap.
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                Travel or pay international merchants with complete ease. Scan any foreign QR code abroad: we auto-convert from your native currency at live mid-market exchange rates and deposit directly into their local account in seconds.
              </p>

              {/* FIRST-TIME USER ACCESS CARD (PROMINENT, NO HASSLE) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 max-w-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Instant Access Portal
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      New to GlobePay? Sign up free or test the full app in one click.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Port 5000 Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all text-center"
                  >
                    Open Free Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm text-slate-800 dark:text-slate-200 transition-colors text-center"
                  >
                    Sign In to Portal
                  </Link>
                </div>

                {/* 1-Click Demo Shortcut */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Want to see it in action without signing up?
                  </span>
                  <button
                    onClick={handleInstantDemo}
                    disabled={isDemoLoading}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    {isDemoLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        ⚡ 1-Click Demo Login (Upasana Roy) →
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" /> No setup or monthly fees
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" /> Instant verification
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" /> FCA Regulated Rails
                </span>
              </div>
            </div>

            {/* Right Col: Live Currency Calculator & Fee Comparison Card */}
            <div id="calculator" className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Real-Time FX Calculator</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Live mid-market rate with zero markup</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Rate
                  </div>
                </div>

                {/* You Send */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">You send</label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-transparent text-xl font-bold text-slate-900 dark:text-white outline-none"
                      placeholder="1000"
                    />
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 outline-none cursor-pointer"
                    >
                      {currencies.map((c: any) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rates breakdown indicator */}
                <div className="py-1 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      Exchange Rate:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>GlobePay Transparent Fee (0.35%):</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">${gpFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Average Bank Fee (~3.8%):</span>
                    <span className="line-through">${bankFee}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Estimated Total Savings:</span>
                    <span>~${savings} USD</span>
                  </div>
                </div>

                {/* Recipient Receives */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recipient receives</label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                    <div className="w-full text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {convertedAmount}
                    </div>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 outline-none cursor-pointer"
                    >
                      {currencies.map((c: any) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Link
                  to="/send"
                  className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2"
                >
                  Transfer at This Rate
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 4. INSTITUTIONAL METRICS BANNER ─────────────────────────── */}
      <section className="py-10 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">$2.4B+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Total Cross-Border Volume</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">180+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Countries Supported</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">&lt; 3 Sec</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Average Transfer Settlement</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">99.99%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">API & Rail Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CORE CAPABILITIES (PRO GRID, NO EXTRA CLUTTER) ────────── */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              Core Financial Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
              Built for speed, global reach, and absolute compliance.
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-400">
              A single unified portal giving you full autonomy over multiple global balances, cross-border remittances, and corporate cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: QrCode,
                title: "Universal Global QR",
                desc: "Scan any international merchant QR code across 180+ countries. Like Google Pay, but universally accepted abroad.",
              },
              {
                icon: ArrowLeftRight,
                title: "Instant Auto-Exchange",
                desc: "Never worry about manual conversions. We automatically convert from your home currency into theirs at live mid-market rates.",
              },
              {
                icon: Wallet,
                title: "Multi-Currency Wallets",
                desc: "Hold and manage money in USD, EUR, GBP, JPY, INR, AED and 50+ currencies with transparent real-time balances.",
              },
              {
                icon: Zap,
                title: "1-Tap Account Settlement",
                desc: "With a single tap, funds settle directly into the foreign merchant or recipient's bank account in their local currency.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:shadow-lg transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <f.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-400">Simple 3-Step Setup</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Get started in under 3 minutes</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">No complex paperwork. No branches. Fully automated digital onboarding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Register & Authenticate",
                desc: "Create your account with email and secure password, or sign in directly with 2FA protection.",
              },
              {
                step: "02",
                title: "Fund or Receive",
                desc: "Add funds via domestic bank transfer, card, or receive money directly from international clients.",
              },
              {
                step: "03",
                title: "Transfer & Spend",
                desc: "Send money to 180+ countries at live mid-market rates or spend instantly using your virtual cards.",
              },
            ].map((s) => (
              <div key={s.step} className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
                <span className="text-4xl font-extrabold text-slate-200 dark:text-slate-800 absolute top-6 right-6">
                  {s.step}
                </span>
                <div className="space-y-3 relative z-10">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. ENTERPRISE SECURITY & COMPLIANCE ───────────────────── */}
      <section id="security" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                Institutional Security Standard
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Bank-grade protection for every cent you transfer.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                All client funds are safeguarded in segregated Tier-1 accounts. GlobePay employs SHA-256 password encryption, JWT session management, biometric two-factor authentication, and automated suspicious activity detection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Segregated Client Accounts",
                  "256-Bit End-to-End Encryption",
                  "Automated Fraud Screening",
                  "Two-Factor Authentication (2FA)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm font-semibold text-slate-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. FINAL PROMINENT CALL TO ACTION ─────────────────────── */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 text-white text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ready to modernize your global payments?
            </h2>
            <p className="text-slate-200 text-base max-w-xl mx-auto">
              Join over 2 million accounts moving money across borders with full transparency and zero hidden spreads.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-brand-700 hover:bg-slate-100 font-bold text-sm shadow-lg transition-all"
              >
                Open Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 text-white font-bold text-sm transition-all"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. CLEAN PROFESSIONAL FOOTER ─────────────────────────── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <GlobePayLogo size="sm" showTagline={false} />
            </div>

            <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-brand-600">Client Login</Link>
              <Link to="/register" className="hover:text-brand-600">Open Account</Link>
              <a href="#calculator" className="hover:text-brand-600">FX Rates</a>
              <a href="#security" className="hover:text-brand-600">Security & Compliance</a>
            </div>
          </div>

          <p className="text-slate-400 dark:text-slate-600 leading-relaxed">
            GlobePay is a global financial technology platform. Banking and payment services are provided by authorized banking partners in respective jurisdictions. All trademarks and brand names are property of their respective owners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-6 gap-2">
            <span>© 2026 GlobePay. All rights reserved.</span>
            <span>Local Instance Running on Port 5000 • Backend Connected on Port 4000</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
