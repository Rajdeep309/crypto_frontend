import api from "./axiosInstance";

export const fetchAllTrades = () => {
  return api.post("/api/trade/public/fetch-all-trades");
};

export const fetchIncrementalTrades = () => {
  return api.post("/api/trade/public/fetch-incremental-trades");
};
