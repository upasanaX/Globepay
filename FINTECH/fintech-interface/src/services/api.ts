/**
 * GlobePay API Service
 * Centralised Axios-based API client with JWT auth + auto-refresh.
 */
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Token helpers ────────────────────────────────────────────────────────
function getAccessToken()  { return localStorage.getItem("gp_access_token"); }
function getRefreshToken() { return localStorage.getItem("gp_refresh_token"); }
function setTokens(access: string, refresh?: string) {
  localStorage.setItem("gp_access_token", access);
  if (refresh) localStorage.setItem("gp_refresh_token", refresh);
}
function clearTokens() {
  localStorage.removeItem("gp_access_token");
  localStorage.removeItem("gp_refresh_token");
  localStorage.removeItem("gp_user");
}

// ─── Request interceptor: attach access token ─────────────────────────────
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor: auto-refresh on 401 ───────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      const errCode = error.response?.data?.code;
      if (errCode !== "TOKEN_EXPIRED") return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.dispatchEvent(new Event("gp:logout"));
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = res.data;
        setTokens(accessToken);
        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearTokens();
        window.dispatchEvent(new Event("gp:logout"));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post("/auth/register", data).then((r) => {
      setTokens(r.data.accessToken, r.data.refreshToken);
      localStorage.setItem("gp_user", JSON.stringify(r.data.user));
      return r.data;
    }),

  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }).then((r) => {
      setTokens(r.data.accessToken, r.data.refreshToken);
      localStorage.setItem("gp_user", JSON.stringify(r.data.user));
      return r.data;
    }),

  logout: async () => {
    try { await api.post("/auth/logout", { refreshToken: getRefreshToken() }); } catch {}
    clearTokens();
  },

  me: () => api.get("/auth/me").then((r) => r.data.user),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/change-password", { currentPassword, newPassword }).then((r) => r.data),

  getStoredUser: () => {
    const s = localStorage.getItem("gp_user");
    return s ? JSON.parse(s) : null;
  },
  isAuthenticated: () => !!getAccessToken(),
};

// ─── Wallets API ──────────────────────────────────────────────────────────
export const walletsAPI = {
  list: () => api.get("/wallets").then((r) => r.data.wallets),
  summary: () => api.get("/wallets/summary").then((r) => r.data),
  create: (currency: string) => api.post("/wallets", { currency }).then((r) => r.data.wallet),
  get: (currency: string) => api.get(`/wallets/${currency}`).then((r) => r.data.wallet),
};

// ─── Transactions API ─────────────────────────────────────────────────────
export const transactionsAPI = {
  list: (params?: { page?: number; limit?: number; type?: string; status?: string; currency?: string }) =>
    api.get("/transactions", { params }).then((r) => r.data),

  get: (id: string) => api.get(`/transactions/${id}`).then((r) => r.data.transaction),

  send: (data: {
    recipientEmail: string; recipientName?: string;
    amount: number; fromCurrency: string; toCurrency: string;
  }) => api.post("/transactions/send", data).then((r) => r.data),

  convert: (from: string, to: string, amount: number) =>
    api.post("/transactions/convert", { fromCurrency: from, toCurrency: to, amount }).then((r) => r.data),
};

// ─── Exchange API ─────────────────────────────────────────────────────────
export const exchangeAPI = {
  rate: (from: string, to: string) =>
    api.get("/exchange/rate", { params: { from, to } }).then((r) => r.data),

  rates: (base = "USD") =>
    api.get("/exchange/rates", { params: { base } }).then((r) => r.data),

  calculate: (from: string, to: string, amount: number) =>
    api.post("/exchange/calculate", { from, to, amount }).then((r) => r.data),
};

// ─── Notifications API ────────────────────────────────────────────────────
export const notificationsAPI = {
  list: (unreadOnly = false) =>
    api.get("/notifications", { params: { unread_only: unreadOnly } }).then((r) => r.data),

  markRead: (id: string) => api.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.put("/notifications/read-all").then((r) => r.data),
  delete: (id: string) => api.delete(`/notifications/${id}`).then((r) => r.data),
};

// ─── Cards API ────────────────────────────────────────────────────────────
export const cardsAPI = {
  list: () => api.get("/cards").then((r) => r.data.cards),
  toggleFreeze: (id: string) => api.put(`/cards/${id}/freeze`).then((r) => r.data),
  updateLimit: (id: string, dailyLimit: number) =>
    api.put(`/cards/${id}/limit`, { dailyLimit }).then((r) => r.data),
};

// ─── Savings API ──────────────────────────────────────────────────────────
export const savingsAPI = {
  list: () => api.get("/savings").then((r) => r.data.goals),
  create: (data: { name: string; targetAmount: number; currency?: string; deadline?: string; icon?: string }) =>
    api.post("/savings", data).then((r) => r.data.goal),
  deposit: (id: string, amount: number) =>
    api.put(`/savings/${id}/deposit`, { amount }).then((r) => r.data.goal),
  delete: (id: string) => api.delete(`/savings/${id}`).then((r) => r.data),
};

// ─── Users API ────────────────────────────────────────────────────────────
export const usersAPI = {
  profile: () => api.get("/users/profile").then((r) => r.data.user),
  updateProfile: (data: { name?: string; phone?: string; location?: string }) =>
    api.put("/users/profile", data).then((r) => r.data.user),
  stats: () => api.get("/users/stats").then((r) => r.data),
};

export default api;

