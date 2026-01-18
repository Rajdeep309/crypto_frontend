import api from "./axiosInstance";


export const fetchPortfolioPnL = () => {
  return api.post("/api/pnl/public/summary");
};


export const fetchRealizedPnL = () => {
  return api.post("/api/pnl/public/realized");
};


export const fetchAssetPnL = (symbol) => {
  return api.post(`/api/pnl/public/asset/${symbol}`);
};

export const exportPnLCsv = () => {
  return api.post(
    "/api/pnl/public/export/csv",
    {},
    {
      responseType: "blob", //   file download
    }
  );
};
