export interface Transaction {
  id: string;
  type: "sent" | "received";
  name: string;
  avatar: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface Wallet {
  currency: string;
  symbol: string;
  balance: number;
  change: number;
  flag: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change: number;
}

export const wallets: Wallet[] = [
  { currency: "USD", symbol: "$", balance: 12450.80, change: 2.4, flag: "🇺🇸" },
  { currency: "EUR", symbol: "€", balance: 8320.50, change: -0.8, flag: "🇪🇺" },
  { currency: "GBP", symbol: "£", balance: 5640.20, change: 1.2, flag: "🇬🇧" },
  { currency: "JPY", symbol: "¥", balance: 420000, change: 0.5, flag: "🇯🇵" },
  { currency: "INR", symbol: "₹", balance: 245000, change: -1.1, flag: "🇮🇳" },
];

export const transactions: Transaction[] = [
  { id: "1", type: "sent", name: "Sarah Chen", avatar: "SC", amount: 250.00, currency: "USD", date: "2026-03-03", status: "completed" },
  { id: "2", type: "received", name: "Alex Rivera", avatar: "AR", amount: 1200.00, currency: "EUR", date: "2026-03-02", status: "completed" },
  { id: "3", type: "sent", name: "James Wilson", avatar: "JW", amount: 89.50, currency: "GBP", date: "2026-03-02", status: "pending" },
  { id: "4", type: "received", name: "Priya Sharma", avatar: "PS", amount: 45000, currency: "INR", date: "2026-03-01", status: "completed" },
  { id: "5", type: "sent", name: "Yuki Tanaka", avatar: "YT", amount: 15000, currency: "JPY", date: "2026-02-28", status: "completed" },
  { id: "6", type: "received", name: "Emma Thompson", avatar: "ET", amount: 350.00, currency: "USD", date: "2026-02-28", status: "completed" },
  { id: "7", type: "sent", name: "Carlos Mendes", avatar: "CM", amount: 620.00, currency: "EUR", date: "2026-02-27", status: "failed" },
  { id: "8", type: "received", name: "Liam O'Brien", avatar: "LO", amount: 175.00, currency: "GBP", date: "2026-02-27", status: "completed" },
];

export const exchangeRates: ExchangeRate[] = [
  { from: "USD", to: "EUR", rate: 0.9234, change: -0.12 },
  { from: "USD", to: "GBP", rate: 0.7891, change: 0.08 },
  { from: "USD", to: "JPY", rate: 149.52, change: 0.45 },
  { from: "USD", to: "INR", rate: 83.12, change: -0.22 },
  { from: "EUR", to: "GBP", rate: 0.8546, change: 0.15 },
  { from: "EUR", to: "JPY", rate: 161.89, change: 0.33 },
  { from: "GBP", to: "USD", rate: 1.2673, change: -0.08 },
  { from: "GBP", to: "EUR", rate: 1.1701, change: -0.15 },
];

export const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
];

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "SC",
    text: "GlobePay has completely changed how I receive payments from international clients. The rates are incredible and transfers are almost instant.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Digital Nomad",
    avatar: "MJ",
    text: "I travel between 6 countries a year. GlobePay's multi-currency wallet saves me hundreds in conversion fees every month.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "Remote Engineer",
    avatar: "AP",
    text: "The QR code payments are a game-changer. I can pay in local currency anywhere without worrying about exchange rates.",
    rating: 5,
  },
];

export const features = [
  {
    title: "Multi-Currency Wallets",
    description: "Hold and manage money in 50+ currencies. Instant conversion at the real exchange rate.",
    icon: "wallet",
  },
  {
    title: "Lightning-Fast Transfers",
    description: "Send money globally in seconds, not days. Available in 180+ countries worldwide.",
    icon: "zap",
  },
  {
    title: "QR Code Payments",
    description: "Scan and pay internationally with a single tap. No more fumbling with bank details.",
    icon: "qrcode",
  },
  {
    title: "Real-Time Rates",
    description: "Get the real mid-market exchange rate. No hidden markups, no surprises.",
    icon: "trending",
  },
  {
    title: "Bank-Level Security",
    description: "256-bit encryption, biometric auth, and real-time fraud monitoring keep your money safe.",
    icon: "shield",
  },
  {
    title: "Smart Analytics",
    description: "Track spending patterns, set budgets, and get insights across all your currencies.",
    icon: "chart",
  },
];

/* ── Spending chart data (monthly) ── */
export interface SpendingData {
  month: string;
  income: number;
  spending: number;
  savings: number;
}

export const spendingData: SpendingData[] = [
  { month: "Sep", income: 6200, spending: 3800, savings: 2400 },
  { month: "Oct", income: 7100, spending: 4200, savings: 2900 },
  { month: "Nov", income: 5800, spending: 3400, savings: 2400 },
  { month: "Dec", income: 8500, spending: 5900, savings: 2600 },
  { month: "Jan", income: 7400, spending: 4100, savings: 3300 },
  { month: "Feb", income: 6900, spending: 3700, savings: 3200 },
  { month: "Mar", income: 7800, spending: 4400, savings: 3400 },
];

/* ── Virtual cards ── */
export interface VirtualCard {
  id: string;
  type: "visa" | "mastercard";
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  balance: number;
  currency: string;
  color: string;
  frozen: boolean;
  dailyLimit: number;
  spent: number;
}

export const virtualCards: VirtualCard[] = [
  {
    id: "1",
    type: "visa",
    name: "Upasana Roy",
    number: "4532 •••• •••• 7842",
    expiry: "09/28",
    cvv: "•••",
    balance: 8450.0,
    currency: "USD",
    color: "from-brand-600 via-purple-600 to-violet-600",
    frozen: false,
    dailyLimit: 5000,
    spent: 1240,
  },
  {
    id: "2",
    type: "mastercard",
    name: "Upasana Roy",
    number: "5412 •••• •••• 3156",
    expiry: "03/27",
    cvv: "•••",
    balance: 3200.5,
    currency: "EUR",
    color: "from-orange-500 via-pink-500 to-rose-500",
    frozen: false,
    dailyLimit: 3000,
    spent: 780,
  },
  {
    id: "3",
    type: "visa",
    name: "Upasana Roy",
    number: "4916 •••• •••• 9021",
    expiry: "12/27",
    cvv: "•••",
    balance: 15640.2,
    currency: "GBP",
    color: "from-emerald-500 via-teal-500 to-cyan-500",
    frozen: true,
    dailyLimit: 10000,
    spent: 0,
  },
];

/* ── Notifications ── */
export interface Notification {
  id: string;
  type: "transfer" | "security" | "promo" | "alert" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "transfer",
    title: "Money Received",
    message: "You received $1,200.00 from Alex Rivera",
    time: "2 min ago",
    read: false,
    icon: "💰",
  },
  {
    id: "n2",
    type: "security",
    title: "Login from new device",
    message: "A new login was detected from Chrome on Windows. Was this you?",
    time: "15 min ago",
    read: false,
    icon: "🔐",
  },
  {
    id: "n3",
    type: "promo",
    title: "Zero-fee weekend!",
    message: "Send money to Europe with 0% fees this weekend. Limited time offer.",
    time: "1 hour ago",
    read: false,
    icon: "🎉",
  },
  {
    id: "n4",
    type: "alert",
    title: "Rate Alert: USD/EUR",
    message: "USD/EUR reached your target rate of 0.92. Tap to convert now.",
    time: "3 hours ago",
    read: true,
    icon: "📈",
  },
  {
    id: "n5",
    type: "transfer",
    title: "Transfer Complete",
    message: "Your transfer of £89.50 to James Wilson is complete.",
    time: "5 hours ago",
    read: true,
    icon: "✅",
  },
  {
    id: "n6",
    type: "system",
    title: "Card Statement Ready",
    message: "Your February 2026 statement is ready to download.",
    time: "1 day ago",
    read: true,
    icon: "📄",
  },
  {
    id: "n7",
    type: "security",
    title: "Password changed",
    message: "Your account password was changed successfully.",
    time: "2 days ago",
    read: true,
    icon: "🔑",
  },
  {
    id: "n8",
    type: "transfer",
    title: "Money Sent",
    message: "You sent ¥15,000 to Yuki Tanaka successfully.",
    time: "3 days ago",
    read: true,
    icon: "🚀",
  },
];

/* ── Spending categories (for analytics) ── */
export interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export const spendingCategories: SpendingCategory[] = [
  { name: "Transfers", amount: 1850, color: "#6366f1", percentage: 42 },
  { name: "Shopping", amount: 920, color: "#8b5cf6", percentage: 21 },
  { name: "Food & Dining", amount: 640, color: "#a855f7", percentage: 15 },
  { name: "Subscriptions", amount: 480, color: "#c084fc", percentage: 11 },
  { name: "Others", amount: 510, color: "#d8b4fe", percentage: 11 },
];
