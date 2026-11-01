/**
 * Exchange Rate Service
 * Uses ExchangeRate-API (free tier) if key is set, otherwise falls back to static mock rates.
 * Free key: https://www.exchangerate-api.com  (1500 requests/month free)
 */

const fetch = require("node-fetch");

// Static fallback rates (USD base)
const STATIC_RATES = {
  USD: 1,       EUR: 0.9234,  GBP: 0.7891,  JPY: 149.52,
  INR: 83.12,   AUD: 1.5288,  CAD: 1.3621,  CHF: 0.8901,
  SGD: 1.3512,  AED: 3.6725,  CNY: 7.2341,  MXN: 17.12,
  BRL: 4.97,    KRW: 1325.4,  HKD: 7.8234,  NOK: 10.52,
  SEK: 10.43,   DKK: 6.88,    PLN: 3.98,    CZK: 22.94,
};

// Simple in-memory cache (5-minute TTL)
let rateCache = { data: null, fetchedAt: 0, base: null };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchLiveRates(base = "USD") {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
    const res = await fetch(url, { timeout: 5000 });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.result !== "success") return null;
    return json.conversion_rates;
  } catch {
    return null;
  }
}

async function getAllRates(base = "USD") {
  const now = Date.now();
  if (rateCache.data && rateCache.base === base && now - rateCache.fetchedAt < CACHE_TTL) {
    return rateCache.data;
  }

  const live = await fetchLiveRates(base);
  if (live) {
    rateCache = { data: live, fetchedAt: now, base };
    return live;
  }

  // Build static rates from USD base
  if (base === "USD") return STATIC_RATES;

  const baseRate = STATIC_RATES[base] || 1;
  const converted = {};
  for (const [currency, rate] of Object.entries(STATIC_RATES)) {
    converted[currency] = parseFloat((rate / baseRate).toFixed(6));
  }
  return converted;
}

async function getExchangeRate(from, to) {
  if (from === to) return 1;
  const rates = await getAllRates(from);
  return rates[to] || (STATIC_RATES[to] / STATIC_RATES[from]);
}

module.exports = { getExchangeRate, getAllRates };

