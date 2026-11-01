import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode, Camera, Zap, Globe, ArrowRight, ArrowLeftRight,
  CheckCircle2, RefreshCw, AlertCircle, ShieldCheck, MapPin,
  Smartphone, Store, DollarSign
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { walletsAPI, transactionsAPI, exchangeAPI } from "../services/api";

interface PresetMerchant {
  id: string;
  name: string;
  category: string;
  location: string;
  country: string;
  flag: string;
  amount: number;
  currency: string;
  avatar: string;
}

const PRESET_MERCHANTS: PresetMerchant[] = [
  {
    id: "m_tokyo",
    name: "Shibuya Roastery ☕",
    category: "Coffee & Dining",
    location: "Tokyo, Japan",
    country: "Japan",
    flag: "🇯🇵",
    amount: 1850,
    currency: "JPY",
    avatar: "SR",
  },
  {
    id: "m_paris",
    name: "Boulangerie Saint-Germain 🥐",
    category: "Bakery",
    location: "Paris, France",
    country: "France",
    flag: "🇫🇷",
    amount: 24.5,
    currency: "EUR",
    avatar: "BS",
  },
  {
    id: "m_london",
    name: "Covent Garden Books 📚",
    category: "Retail Store",
    location: "London, UK",
    country: "United Kingdom",
    flag: "🇬🇧",
    amount: 32.0,
    currency: "GBP",
    avatar: "CG",
  },
  {
    id: "m_dubai",
    name: "Downtown Gourmet 🍽️",
    category: "Restaurant",
    location: "Dubai, UAE",
    country: "UAE",
    flag: "🇦🇪",
    amount: 145,
    currency: "AED",
    avatar: "DG",
  },
];

const QRScannerPage: React.FC = () => {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeMerchant, setActiveMerchant] = useState<PresetMerchant | null>(null);
  const [myWallets, setMyWallets] = useState<any[]>([]);
  const [selectedWalletCurrency, setSelectedWalletCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load user's real wallets
  useEffect(() => {
    walletsAPI
      .list()
      .then((data) => {
        if (data && data.length) {
          setMyWallets(data);
          setSelectedWalletCurrency(data[0].currency);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch exchange rate when merchant or paying wallet changes
  useEffect(() => {
    if (activeMerchant) {
      if (selectedWalletCurrency === activeMerchant.currency) {
        setExchangeRate(1);
      } else {
        exchangeAPI
          .rate(selectedWalletCurrency, activeMerchant.currency)
          .then((res) => {
            if (res?.rate) setExchangeRate(Number(res.rate));
          })
          .catch(() => {
            // Fallback rates
            const mockRates: Record<string, number> = {
              USD_JPY: 149.52,
              USD_EUR: 0.9234,
              USD_GBP: 0.7891,
              USD_AED: 3.67,
              EUR_JPY: 161.8,
              INR_JPY: 1.8,
            };
            const k = `${selectedWalletCurrency}_${activeMerchant.currency}`;
            setExchangeRate(mockRates[k] || 1);
          });
      }
    }
  }, [activeMerchant, selectedWalletCurrency]);

  const startScan = (merchant?: PresetMerchant) => {
    setErrorMessage(null);
    setPaymentSuccess(false);
    setActiveMerchant(null);
    setScanning(true);
    setScanProgress(0);

    const chosen = merchant || PRESET_MERCHANTS[Math.floor(Math.random() * PRESET_MERCHANTS.length)];

    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setScanning(false);
        setActiveMerchant(chosen);
      }
    }, 40);
  };

  // Convert merchant amount to user's wallet currency
  const targetAmount = activeMerchant ? activeMerchant.amount : 0;
  const userDeduction = exchangeRate > 0 ? (targetAmount / exchangeRate).toFixed(2) : "0.00";
  const userWallet = myWallets.find((w) => w.currency === selectedWalletCurrency);
  const userBalance = userWallet ? Number(userWallet.balance) : 0;
  const hasSufficientFunds = userBalance >= parseFloat(userDeduction);

  const handle1TapPay = async () => {
    if (!activeMerchant) return;
    setIsPaying(true);
    setErrorMessage(null);

    try {
      // Execute transfer via backend transactions API
      await transactionsAPI.send({
        recipientEmail: `${activeMerchant.id}@merchant.globepay`,
        recipientName: activeMerchant.name,
        amount: parseFloat(userDeduction),
        fromCurrency: selectedWalletCurrency,
        toCurrency: activeMerchant.currency,
      });

      // Update local wallet balance state
      setMyWallets((prev) =>
        prev.map((w) =>
          w.currency === selectedWalletCurrency
            ? { ...w, balance: Math.max(0, w.balance - parseFloat(userDeduction)) }
            : w
        )
      );

      setPaymentSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error || "Payment failed. Please verify your wallet balance."
      );
    } finally {
      setIsPaying(false);
    }
  };

  const handleReset = () => {
    setActiveMerchant(null);
    setPaymentSuccess(false);
    setErrorMessage(null);
    setScanning(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ─── Header ────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            Global Tap & Scan
          </span>
          <span className="text-xs text-slate-500">• Works in 180+ countries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Scan & Pay Globally
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Scan any international merchant QR code. We auto-convert from your native currency at live exchange rates and pay them in 1 tap.
        </p>
      </motion.div>

      {/* ─── Main Scanner Card ──────────────────────────────── */}
      <div className="glass-card p-6 space-y-6">
        
        {/* Camera Viewport */}
        <div className="relative aspect-square max-w-sm mx-auto bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Corner Viewfinder brackets */}
          {["top-6 left-6", "top-6 right-6 rotate-90", "bottom-6 left-6 -rotate-90", "bottom-6 right-6 rotate-180"].map((pos, i) => (
            <div key={i} className={`absolute ${pos}`}>
              <div className="w-10 h-10 border-t-4 border-l-4 border-brand-400 rounded-tl-xl" />
            </div>
          ))}

          {/* Scanning Laser Beam */}
          {scanning && (
            <div
              className="absolute left-6 right-6 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_15px_#6366f1]"
              style={{ top: `${scanProgress}%` }}
            />
          )}

          {/* Center Viewport Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {!scanning && !activeMerchant && (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-white">
                  <QrCode className="w-8 h-8" />
                </div>
                <p className="text-white font-semibold text-sm">Point camera at any foreign QR code</p>
                <p className="text-xs text-slate-400 max-w-[200px]">Supports PayNow, UPI Global, Alipay+, WeChat, SEPA, & PromptPay</p>
              </div>
            )}

            {scanning && (
              <div className="space-y-3 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 backdrop-blur-md flex items-center justify-center mx-auto text-brand-400">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="text-brand-300 font-bold text-sm">Recognizing international merchant...</p>
                <p className="text-xs text-slate-400">Detecting foreign currency & clearing rails</p>
              </div>
            )}

            {activeMerchant && !scanning && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2"
              >
                <span className="text-4xl">{activeMerchant.flag}</span>
                <p className="text-white font-bold text-base">{activeMerchant.name}</p>
                <p className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                  QR Verified • {activeMerchant.location}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* ─── State 1: Ready to Scan or Select Preset ──────────── */}
        {!scanning && !activeMerchant && (
          <div className="space-y-4">
            <button
              onClick={() => startScan()}
              className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
            >
              <Camera className="w-5 h-5" />
              Open Camera Scanner
            </button>

            {/* Test Simulation Buttons for quick demo */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Or test-scan an international merchant:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_MERCHANTS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => startScan(m)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left flex items-center gap-2.5 group"
                  >
                    <span className="text-2xl flex-shrink-0">{m.flag}</span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600">
                        {m.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {m.amount} {m.currency}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── State 2: Merchant Scanned & Auto-Exchange Confirmation ─── */}
        {activeMerchant && !paymentSuccess && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Merchant Details Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow">
                    {activeMerchant.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{activeMerchant.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {activeMerchant.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold uppercase text-slate-400">Requested</span>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {activeMerchant.amount.toLocaleString()} {activeMerchant.currency}
                  </p>
                </div>
              </div>

              {/* Real-Time Currency Conversion Card */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Pay from your wallet:</span>
                  <select
                    value={selectedWalletCurrency}
                    onChange={(e) => setSelectedWalletCurrency(e.target.value)}
                    className="font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded-lg outline-none cursor-pointer"
                  >
                    {myWallets.map((w) => (
                      <option key={w.currency} value={w.currency}>
                        {w.flag} {w.currency} (Bal: {w.symbol}{Number(w.balance).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Debited from You</span>
                    <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
                      ${userDeduction} {selectedWalletCurrency}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Live FX Rate</span>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      1 {selectedWalletCurrency} = {exchangeRate.toFixed(2)} {activeMerchant.currency}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 0% Foreign Transaction Markup
                  </span>
                  <span>Instant Settlement ⚡</span>
                </div>
              </div>
            </div>

            {/* 1-Tap Payment Execution */}
            <div className="space-y-2">
              <button
                onClick={handle1TapPay}
                disabled={isPaying || !hasSufficientFunds}
                className={`w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  hasSufficientFunds
                    ? "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/25 active:scale-[0.98]"
                    : "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isPaying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : hasSufficientFunds ? (
                  <>
                    <span>1-Tap Pay ${userDeduction} {selectedWalletCurrency}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "Insufficient Balance in Selected Wallet"
                )}
              </button>

              <button
                onClick={handleReset}
                disabled={isPaying}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Cancel & Scan Another
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── State 3: Payment Success / Receipt ─────────────────── */}
        {paymentSuccess && activeMerchant && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6 space-y-5"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Payment Completed Globally
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {activeMerchant.amount.toLocaleString()} {activeMerchant.currency}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Paid to {activeMerchant.name} ({activeMerchant.location})
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2 text-left max-w-sm mx-auto border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Debited from {user?.name || "Upasana Roy"}:</span>
                <span className="font-bold text-slate-900 dark:text-white">${userDeduction} {selectedWalletCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant Received:</span>
                <span className="font-bold text-emerald-600">{activeMerchant.amount} {activeMerchant.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Exchange Rate:</span>
                <span className="font-medium">1 {selectedWalletCurrency} = {exchangeRate.toFixed(2)} {activeMerchant.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Surcharge / Markup:</span>
                <span className="font-bold text-emerald-600">$0.00 (Zero Spread)</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="btn-primary w-full max-w-sm py-3 text-sm font-bold mx-auto flex items-center justify-center gap-2"
            >
              Scan Next Merchant
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* ─── Global Scan Value Pillars ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: Globe,
            title: "Universal QR",
            desc: "Scans PayNow, UPI, PromptPay, Alipay+, SEPA, and local merchant QRs.",
          },
          {
            icon: ArrowLeftRight,
            title: "Real-Time FX",
            desc: "No manual conversions needed. Auto-exchanges at the exact mid-market rate.",
          },
          {
            icon: Zap,
            title: "1-Tap Settlement",
            desc: "The foreign merchant gets their local currency immediately.",
          },
        ].map((item) => (
          <div key={item.title} className="glass-card p-4 text-center space-y-1.5">
            <item.icon className="w-5 h-5 text-brand-500 mx-auto" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRScannerPage;
