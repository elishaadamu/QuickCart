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
      GET_SELLER_ORDERS: "/orders/seller",
      UPDATE_STATUS: "/orders/status",
    },
    PROFILE: {
      UPDATE: "/profile/update",
      GET: "/profile",
      UPDATE_USER: "/user/update",
      DELETE: "/user/delete/",
    },
    SECURITY: {
      SET_PIN: "/wallet/setPin",
      UPDATE_PIN: "/wallet/changePin",
      CHANGE_PASSWORD: "/security/change-password",
      RESET_PASSWORD: "/security/reset-password",
    },
    USER: {
      DELETE: "/user/delete/",
    },
    CUSTOMER: {
      SIGNIN: "/customer/login",
    },
    VENDOR: {
      SIGNIN: "/vendor/login",
      GET_ALL: "/vendor/stats/",
    },
    PRODUCT: {
      ADD: "/product/",
      GET_SELLER_PRODUCTS: "/product/my-products/",
      GET_PRODUCT: "/product",
      UPDATE: "/product/",
      DELETE: "/product/",
    },
    CATEGORY: {
      GET_ALL: "/category",
    },
    RATING: {
      ADD: "/rating",
      GET_BY_VENDOR: "/rating/", // Append vendorId
      DELETE: "/rating/", // Append vendorId/userId
    },
  },
};

export const apiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;
