// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://www.alphavantage.co/query',
  API_KEY: 'H29NMO7UCHL21JKP',
  ENDPOINTS: {
    TOP_GAINERS_LOSERS: 'TOP_GAINERS_LOSERS',
  },
  TIMEOUT: 10000, // 10 seconds
};

// API Response status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
