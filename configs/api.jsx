export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  ENDPOINTS: {
    AUTH: {
      SIGNUP: "/auth/register",
      SIGNIN: "/auth/login",
    },
    ACCOUNT: {
      CREATE: "/account/create/",
      GET: "/account/",
      walletBalance: "/wallet/",
      allWalletTransactions: "/wallet/",
    },
    ORDER: {
      GET_ALL: "/orders",
    },
    PROFILE: {
      UPDATE: "/profile/update",
      GET: "/profile",
    },
  },
};

export const apiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;
