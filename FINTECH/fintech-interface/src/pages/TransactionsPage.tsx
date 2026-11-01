import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, ArrowUpRight, ArrowDownLeft, Download,
  Clock, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  Calendar,
} from "lucide-react";
import { transactions, Transaction } from "../data/mockData";

/* extend mock data so the list looks fuller */
const allTransactions: Transaction[] = [
  ...transactions,
  { id: "9", type: "sent", name: "Aisha Patel", avatar: "AP", amount: 430.0, currency: "USD", date: "2026-02-26", status: "completed" },
  { id: "10", type: "received", name: "Marcus Johnson", avatar: "MJ", amount: 870.0, currency: "EUR", date: "2026-02-25", status: "completed" },
  { id: "11", type: "sent", name: "Sophie Dubois", avatar: "SD", amount: 195.0, currency: "GBP", date: "2026-02-24", status: "completed" },
  { id: "12", type: "received", name: "Raj Patel", avatar: "RP", amount: 32000, currency: "INR", date: "2026-02-23", status: "completed" },
  { id: "13", type: "sent", name: "Liam O'Brien", avatar: "LO", amount: 55.0, currency: "USD", date: "2026-02-22", status: "pending" },
  { id: "14", type: "received", name: "Yuki Tanaka", avatar: "YT", amount: 28000, currency: "JPY", date: "2026-02-21", status: "completed" },
  { id: "15", type: "sent", name: "Emma Thompson", avatar: "ET", amount: 310.0, currency: "EUR", date: "2026-02-20", status: "failed" },
  { id: "16", type: "received", name: "Carlos Mendes", avatar: "CM", amount: 1450.0, currency: "USD", date: "2026-02-19", status: "completed" },
];

const PAGE_SIZE = 6;

const TransactionsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sent" | "received">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "failed">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return allTransactions
      .filter((tx) => typeFilter === "all" || tx.type === typeFilter)
      .filter((tx) => statusFilter === "all" || tx.status === statusFilter)
      .filter(
        (tx) =>
          tx.name.toLowerCase().includes(search.toLowerCase()) ||
          tx.currency.toLowerCase().includes(search.toLowerCase())
      );
  }, [search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalSent = allTransactions
    .filter((t) => t.type === "sent" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  const totalReceived = allTransactions
    .filter((t) => t.type === "received" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

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
            Transactions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage your complete transaction history.
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2 w-fit text-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Transactions</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{allTransactions.length}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Received</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              ${totalReceived.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Sent</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${totalSent.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or currency..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field !pl-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Type:</span>
            {(["all", "sent", "received"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTypeFilter(t); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === t
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status:</span>
            {(["all", "completed", "pending", "failed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card overflow-hidden"
      >
        {paginated.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No transactions found
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {paginated.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === "received"
                        ? "bg-green-100 dark:bg-green-500/10"
                        : "bg-blue-100 dark:bg-blue-500/10"
                    }`}
                  >
                    {tx.type === "received" ? (
                      <ArrowDownLeft
                        className="w-5 h-5 text-green-600 dark:text-green-400"
                      />
                    ) : (
                      <ArrowUpRight
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {tx.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <span
                        className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                          tx.status === "completed"
                            ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                            : tx.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold text-sm ${
                      tx.type === "received"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {tx.type === "received" ? "+" : "-"}$
                    {tx.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {tx.currency}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/5">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    page === p
                      ? "bg-brand-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TransactionsPage;
