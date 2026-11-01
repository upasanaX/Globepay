import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe, Home, GraduationCap, HeartHandshake, ShieldCheck,
  Plane, Tv, Calendar, Clock, CheckCircle, AlertCircle,
  Search, Plus, CreditCard, Receipt, ArrowRightLeft, Sparkles,
} from "lucide-react";
import { currencies, exchangeRates } from "../data/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  }),
} as any;

const homeCurrency = "INR";

interface GlobalBill {
  id: string;
  name: string;
  provider: string;
  category: string;
  icon: any;
  amount: number;
  dueDate: string;
  status: "paid" | "due" | "overdue" | "upcoming";
  autopay: boolean;
  scheduled: boolean;
  destinationCountry: string;
  destinationFlag: string;
  targetCurrency: string;
  payFromCurrency: string;
  color: string;
  lastPaid?: string;
}

const countryCurrencyMap: Record<string, { currency: string; flag: string; category: string }> = {
  "United States": { currency: "USD", flag: "🇺🇸", category: "International Rent Payments" },
  "United Kingdom": { currency: "GBP", flag: "🇬🇧", category: "International Rent Payments" },
  Canada: { currency: "CAD", flag: "🇨🇦", category: "Foreign Education Fees" },
  Australia: { currency: "AUD", flag: "🇦🇺", category: "Travel-related Bookings" },
  Germany: { currency: "EUR", flag: "🇩🇪", category: "International Subscriptions" },
  Japan: { currency: "JPY", flag: "🇯🇵", category: "Overseas Insurance / Medical Payments" },
  Singapore: { currency: "SGD", flag: "🇸🇬", category: "International Subscriptions" },
  "United Arab Emirates": { currency: "AED", flag: "🇦🇪", category: "Family Support Bills" },
};

const globalBillsSeed: GlobalBill[] = [
  {
    id: "gb1",
    name: "International Rent",
    provider: "Manhattan Housing Group",
    category: "International Rent Payments",
    icon: Home,
    amount: 1850,
    dueDate: "2026-04-01",
    status: "due",
    autopay: true,
    scheduled: true,
    destinationCountry: "United States",
    destinationFlag: "🇺🇸",
    targetCurrency: "USD",
    payFromCurrency: "INR",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "gb2",
    name: "Tuition Installment",
    provider: "University of Toronto",
    category: "Foreign Education Fees",
    icon: GraduationCap,
    amount: 4200,
    dueDate: "2026-03-14",
    status: "upcoming",
    autopay: false,
    scheduled: true,
    destinationCountry: "Canada",
    destinationFlag: "🇨🇦",
    targetCurrency: "CAD",
    payFromCurrency: "INR",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "gb3",
    name: "Family Utility Support",
    provider: "Dubai Family Utility Board",
    category: "Family Support Bills",
    icon: HeartHandshake,
    amount: 620,
    dueDate: "2026-03-09",
    status: "overdue",
    autopay: false,
    scheduled: false,
    destinationCountry: "United Arab Emirates",
    destinationFlag: "🇦🇪",
    targetCurrency: "AED",
    payFromCurrency: "INR",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "gb4",
    name: "International SaaS Stack",
    provider: "US Streaming + SaaS Bundle",
    category: "International Subscriptions",
    icon: Tv,
    amount: 89,
    dueDate: "2026-03-06",
    status: "paid",
    autopay: true,
    scheduled: true,
    destinationCountry: "United States",
    destinationFlag: "🇺🇸",
    targetCurrency: "USD",
    payFromCurrency: "INR",
    color: "from-pink-500 to-rose-500",
    lastPaid: "2026-03-03",
  },
  {
    id: "gb5",
    name: "Travel Stay Deposit",
    provider: "Sydney Long Stay Suites",
    category: "Travel-related Bookings",
    icon: Plane,
    amount: 1350,
    dueDate: "2026-03-18",
    status: "upcoming",
    autopay: false,
    scheduled: true,
    destinationCountry: "Australia",
    destinationFlag: "🇦🇺",
    targetCurrency: "AUD",
    payFromCurrency: "INR",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "gb6",
    name: "Overseas Health Insurance",
    provider: "Tokyo Care International",
    category: "Overseas Insurance / Medical Payments",
    icon: ShieldCheck,
    amount: 110000,
    dueDate: "2026-03-22",
    status: "due",
    autopay: true,
    scheduled: false,
    destinationCountry: "Japan",
    destinationFlag: "🇯🇵",
    targetCurrency: "JPY",
    payFromCurrency: "INR",
    color: "from-indigo-500 to-purple-500",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  paid: { label: "Paid", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-500/10", icon: CheckCircle },
  due: { label: "Due Now", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-500/10", icon: Clock },
  overdue: { label: "Overdue", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-500/10", icon: AlertCircle },
  upcoming: { label: "Upcoming", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10", icon: Calendar },
};

const exchangeRateMap = new Map(exchangeRates.map((rate) => [`${rate.from}-${rate.to}`, { rate: rate.rate, change: rate.change }]));

const getExchangeRate = (from: string, to: string) => {
  if (from === to) return { rate: 1, change: 0 };
  const direct = exchangeRateMap.get(`${from}-${to}`);
  if (direct) return direct;
  const inverse = exchangeRateMap.get(`${to}-${from}`);
  if (inverse) return { rate: 1 / inverse.rate, change: -inverse.change };
  return { rate: 1, change: 0 };
};

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const inferCategory = (country: string, currentCategory: string) => countryCurrencyMap[country]?.category || currentCategory;

const BillPaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [billList, setBillList] = useState(globalBillsSeed);

  const dueOrOverdue = billList.filter((bill) => bill.status === "due" || bill.status === "overdue");

  const fxQuote = (bill: GlobalBill) => {
    const quote = getExchangeRate(bill.payFromCurrency, bill.targetCurrency);
    const convertedAmount = bill.amount / quote.rate;
    const fxChargePercent = 0.35 + Math.min(Math.abs(quote.change), 1.5);
    const fxCharge = convertedAmount * (fxChargePercent / 100);
    const totalPayable = convertedAmount + fxCharge;
    return { quote, convertedAmount, fxChargePercent, fxCharge, totalPayable };
  };

  const totalDue = dueOrOverdue.reduce((acc, bill) => acc + fxQuote(bill).totalPayable, 0);
  const totalUpcoming = billList
    .filter((bill) => bill.status === "upcoming")
    .reduce((acc, bill) => acc + fxQuote(bill).totalPayable, 0);
  const totalPaid = billList
    .filter((bill) => bill.status === "paid")
    .reduce((acc, bill) => acc + fxQuote(bill).totalPayable, 0);
  const autopayCount = billList.filter((bill) => bill.autopay).length;

  const filteredBills = billList.filter((bill) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      bill.name.toLowerCase().includes(q) ||
      bill.provider.toLowerCase().includes(q) ||
      bill.destinationCountry.toLowerCase().includes(q) ||
      bill.category.toLowerCase().includes(q);
    const matchesFilter = filterStatus === "all" || bill.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const rateAlerts = useMemo(() => {
    return dueOrOverdue
      .map((bill) => {
        const quote = getExchangeRate(bill.payFromCurrency, bill.targetCurrency);
        const improved = quote.change < 0;
        const label = improved
          ? `${bill.targetCurrency} rate dropped - good time to pay ${bill.name}`
          : `${bill.targetCurrency} rate rising - consider scheduling ${bill.name} early`;
        return { id: bill.id, improved, label };
      })
      .slice(0, 3);
  }, [dueOrOverdue]);

  const monthlyInternationalSpending = [
    { month: "Jan", amount: 221500, currency: homeCurrency },
    { month: "Feb", amount: 207300, currency: homeCurrency },
    { month: "Mar", amount: 184900, currency: homeCurrency },
  ];

  const handlePayBill = (id: string) => {
    setBillList(
      billList.map((bill) =>
        bill.id === id
          ? { ...bill, status: "paid" as const, lastPaid: new Date().toISOString().split("T")[0] }
          : bill
      )
    );
  };

  const toggleAutopay = (id: string) => {
    setBillList(billList.map((bill) => (bill.id === id ? { ...bill, autopay: !bill.autopay } : bill)));
  };

  const toggleSchedule = (id: string) => {
    setBillList(billList.map((bill) => (bill.id === id ? { ...bill, scheduled: !bill.scheduled } : bill)));
  };

  const handleDestinationChange = (id: string, destinationCountry: string) => {
    const mapped = countryCurrencyMap[destinationCountry];
    setBillList(
      billList.map((bill) => {
        if (bill.id !== id || !mapped) return bill;
        return {
          ...bill,
          destinationCountry,
          destinationFlag: mapped.flag,
          targetCurrency: mapped.currency,
          category: inferCategory(destinationCountry, bill.category),
        };
      })
    );
  };

  const handlePayFromCurrencyChange = (id: string, payFromCurrency: string) => {
    setBillList(billList.map((bill) => (bill.id === id ? { ...bill, payFromCurrency } : bill)));
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return "Due today";
    return `Due in ${days} days`;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Global Bills</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Pay international rent, education, subscriptions, travel, insurance, and family support bills.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">International payments only</span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">Real-time FX preview</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300">Home currency: {homeCurrency}</span>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-sm w-fit">
          <Plus className="w-4 h-4" /> Add Global Bill
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRightLeft className="w-4 h-4 text-brand-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Live FX radar</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {billList.slice(0, 4).map((bill) => {
            const quote = getExchangeRate(bill.payFromCurrency, bill.targetCurrency);
            return (
              <div key={`${bill.id}-fx`} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <p className="text-xs text-gray-500 dark:text-gray-400">{bill.destinationFlag} {bill.destinationCountry}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  1 {bill.payFromCurrency} = {quote.rate.toLocaleString(undefined, { maximumFractionDigits: quote.rate > 10 ? 2 : 4 })} {bill.targetCurrency}
                </p>
                <p className={`text-xs mt-1 ${quote.change < 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {quote.change < 0 ? "Favorable" : "Volatile"} move: {quote.change.toFixed(2)}%
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: `Due Now (${homeCurrency})`, value: formatCurrency(totalDue, homeCurrency), icon: AlertCircle, color: "from-red-500 to-rose-500", sub: "includes FX charges" },
          { label: `Upcoming (${homeCurrency})`, value: formatCurrency(totalUpcoming, homeCurrency), icon: Calendar, color: "from-blue-500 to-cyan-500", sub: "scheduled international bills" },
          { label: `Paid (${homeCurrency})`, value: formatCurrency(totalPaid, homeCurrency), icon: CheckCircle, color: "from-green-500 to-emerald-500", sub: "cross-border paid this cycle" },
          { label: "Auto-Pay Foreign", value: `${autopayCount}/${billList.length}`, icon: CreditCard, color: "from-purple-500 to-violet-500", sub: "active in target currency" },
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

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Smart FX alerts</h3>
        </div>
        <div className="space-y-2">
          {rateAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl px-3 py-2 text-sm border ${alert.improved ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"}`}
            >
              {alert.label}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search global bills, provider, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field !pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {["all", "overdue", "due", "upcoming", "paid"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filterStatus === status
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredBills.map((bill, i) => {
          const statusInfo = statusConfig[bill.status];
          const StatusIcon = statusInfo.icon;
          const quote = fxQuote(bill);
          const localRate = getExchangeRate(bill.payFromCurrency, bill.targetCurrency);

          return (
            <motion.div
              key={bill.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              className="glass-card p-4 group hover:shadow-glow/30 transition-all"
            >
              <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bill.color} flex items-center justify-center text-white flex-shrink-0`}>
                  <bill.icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{bill.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">{bill.destinationFlag} {bill.targetCurrency}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">{bill.category}</span>
                    {bill.autopay && <span className="text-[10px] font-medium bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full">Auto-pay on</span>}
                    {bill.scheduled && <span className="text-[10px] font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">Scheduled</span>}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{bill.provider}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{getDaysUntilDue(bill.dueDate)}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                    <div>
                      <label className="text-[11px] text-gray-500 dark:text-gray-400">Destination Country</label>
                      <select
                        value={bill.destinationCountry}
                        onChange={(e) => handleDestinationChange(bill.id, e.target.value)}
                        className="input-field !py-2 !min-h-0 !text-xs"
                      >
                        {Object.keys(countryCurrencyMap).map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-500 dark:text-gray-400">Pay From Currency</label>
                      <select
                        value={bill.payFromCurrency}
                        onChange={(e) => handlePayFromCurrencyChange(bill.id, e.target.value)}
                        className="input-field !py-2 !min-h-0 !text-xs"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">FX rate</p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        1 {bill.payFromCurrency} = {localRate.rate.toLocaleString(undefined, { maximumFractionDigits: localRate.rate > 10 ? 2 : 4 })} {bill.targetCurrency}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-gray-50 dark:bg-white/5 px-3 py-2 border border-gray-200 dark:border-white/10">
                      <p className="text-gray-500 dark:text-gray-400">Converted amount</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(quote.convertedAmount, bill.payFromCurrency)}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 dark:bg-white/5 px-3 py-2 border border-gray-200 dark:border-white/10">
                      <p className="text-gray-500 dark:text-gray-400">FX charges ({quote.fxChargePercent.toFixed(2)}%)</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(quote.fxCharge, bill.payFromCurrency)}</p>
                    </div>
                    <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 px-3 py-2 border border-brand-200 dark:border-brand-500/20">
                      <p className="text-brand-700 dark:text-brand-300">Total payable</p>
                      <p className="font-semibold text-brand-800 dark:text-brand-200">{formatCurrency(quote.totalPayable, bill.payFromCurrency)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex xl:flex-col items-start xl:items-end gap-2 xl:min-w-[180px]">
                  <div className={`flex items-center gap-1 ${statusInfo.color} ${statusInfo.bg} text-xs font-medium px-2 py-1 rounded-full`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </div>

                  {(bill.status === "due" || bill.status === "overdue") && (
                    <button onClick={() => handlePayBill(bill.id)} className="btn-primary text-xs !px-4 !py-2 flex-shrink-0">
                      Pay Internationally
                    </button>
                  )}

                  {bill.status === "upcoming" && (
                    <button onClick={() => toggleSchedule(bill.id)} className="btn-secondary text-xs !px-4 !py-2 flex-shrink-0">
                      {bill.scheduled ? "Unschedule" : "Schedule Payment"}
                    </button>
                  )}

                  <button
                    onClick={() => toggleAutopay(bill.id)}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                  >
                    {bill.autopay ? "Disable auto-pay" : "Enable auto-pay"}
                  </button>

                  {bill.status === "paid" && (
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0">
                      <Receipt className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredBills.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No global bills found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-brand-500" /> Monthly International Spending Summary
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {monthlyInternationalSpending.map((month) => (
            <div key={month.month} className="text-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{month.month}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(month.amount, month.currency)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Auto-categorized by country</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BillPaymentsPage;
