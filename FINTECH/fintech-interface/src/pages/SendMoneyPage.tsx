import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeftRight, Check, Info, Search, AlertCircle,
} from "lucide-react";
import { currencies } from "../data/mockData";
import { transactionsAPI, exchangeAPI } from "../services/api";

const SendMoneyPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(0.9234);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Update live exchange rate when currencies change
  useEffect(() => {
    exchangeAPI
      .rate(fromCurrency, toCurrency)
      .then((data) => {
        if (data?.rate) setRate(Number(data.rate));
      })
      .catch(() => {});
  }, [fromCurrency, toCurrency]);

  const fee = parseFloat(amount || "0") * 0.0035;
  const convertedAmount = (parseFloat(amount || "0") * rate).toFixed(2);
  const totalCost = (parseFloat(amount || "0") + fee).toFixed(2);

  const recentContacts = [
    { name: "Sarah Chen", email: "sarah@design.co", avatar: "SC" },
    { name: "Alex Rivera", email: "alex.r@gmail.com", avatar: "AR" },
    { name: "Priya Sharma", email: "priya@tech.io", avatar: "PS" },
    { name: "James Wilson", email: "james.w@corp.com", avatar: "JW" },
  ];

  const handleSend = async () => {
    setSendError(null);
    setIsSending(true);
    const targetEmail = recipientEmail || (recipient.includes("@") ? recipient : `${recipient.toLowerCase().replace(/\s+/g, ".")}@example.com`);

    try {
      await transactionsAPI.send({
        recipientEmail: targetEmail,
        recipientName: recipient,
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
      });

      setShowConfirm(true);
      setTimeout(() => {
        setShowConfirm(false);
        setStep(1);
        setRecipient("");
        setRecipientEmail("");
        setAmount("");
      }, 3000);
    } catch (err: any) {
      setSendError(err.response?.data?.error || "Transfer failed. Please check your wallet balance.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Send Money</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Transfer money to anyone, anywhere in the world.</p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2"
      >
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= s
                ? "bg-gradient-to-br from-brand-500 to-purple-600 text-white"
                : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600"
            }`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-0.5 rounded-full transition-all ${
                step > s ? "bg-brand-500" : "bg-gray-200 dark:bg-white/10"
              }`} />
            )}
          </React.Fragment>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Recipient */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Who are you sending to?</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name or email address"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    if (e.target.value.includes("@")) setRecipientEmail(e.target.value);
                  }}
                  className="input-field !pl-11"
                />
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Recent Contacts</p>
                <div className="space-y-2">
                  {recentContacts.map((contact) => (
                    <button
                      key={contact.email}
                      onClick={() => {
                        setRecipient(contact.name);
                        setRecipientEmail(contact.email);
                        setStep(2);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {contact.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{contact.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{contact.email}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => recipient && setStep(2)}
              disabled={!recipient}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="glass-card p-6 space-y-5">
              <div className="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-500/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {recipient.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Sending to {recipient}</p>
                  {recipientEmail && <p className="text-xs text-gray-500">{recipientEmail}</p>}
                </div>
                <button onClick={() => setStep(1)} className="ml-auto text-xs text-brand-600 dark:text-brand-400 font-medium">Change</button>
              </div>

              {/* You send */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">You send</label>
                <div className="flex bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500 transition-all">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent px-4 py-4 text-gray-900 dark:text-white text-2xl font-bold outline-none placeholder-gray-300 dark:placeholder-gray-600"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-transparent text-gray-700 dark:text-gray-300 font-medium px-4 outline-none cursor-pointer text-sm"
                  >
                    {currencies.map((c: any) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rate display */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/5 rounded-full px-4 py-2">
                  <ArrowLeftRight className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                  </span>
                </div>
              </div>

              {/* They receive */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">They receive</label>
                <div className="flex bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                  <div className="flex-1 px-4 py-4 text-green-600 dark:text-green-400 text-2xl font-bold">
                    {convertedAmount || "0.00"}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-transparent text-gray-700 dark:text-gray-300 font-medium px-4 outline-none cursor-pointer text-sm"
                  >
                    {currencies.map((c: any) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fee breakdown */}
              {amount && parseFloat(amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      Transfer fee <Info className="w-3 h-3" />
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Exchange rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-white/10 pt-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Total cost</span>
                    <span className="font-bold text-gray-900 dark:text-white">${totalCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Estimated delivery</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Instant ⚡</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button
                onClick={() => amount && parseFloat(amount) > 0 && setStep(3)}
                disabled={!amount || parseFloat(amount) <= 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Review Transfer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="glass-card p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Review Transfer</h2>

              {sendError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">You're sending</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">
                  ${parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  <span className="text-lg text-gray-400 ml-1">{fromCurrency}</span>
                </p>
                <div className="flex items-center justify-center my-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{recipient} receives</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {convertedAmount}
                  <span className="text-lg text-green-400/60 ml-1">{toCurrency}</span>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 space-y-3">
                {[
                  { label: "Recipient", value: recipient },
                  { label: "Exchange rate", value: `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}` },
                  { label: "Fee", value: `$${fee.toFixed(2)}` },
                  { label: "Total cost", value: `$${totalCost}` },
                  { label: "Delivery", value: "Instant ⚡" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm & Send
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card p-8 max-w-sm w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transfer Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                ${amount} {fromCurrency} has been transferred to {recipient}.
                They'll receive {convertedAmount} {toCurrency}.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SendMoneyPage;
