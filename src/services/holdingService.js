import api from "./axiosInstance";

/* ================= CACHE ================= */
let exchangeCache = null;
let manualCache = null;

/* ================= EXCHANGE HOLDINGS ================= */
export const refreshExchangeHoldings = async (force = false) => {
  if (exchangeCache && !force) return exchangeCache;

  try {
    const res = await api.post(
      "/api/holding/public/refresh-exchange-holdings"
    );

    exchangeCache = res.data; // cache
    return exchangeCache;
  } catch (error) {
    exchangeCache = { message: "No exchange holdings", data: [] };
    return exchangeCache;
  }
};

/* ================= MANUAL HOLDINGS ================= */
export const refreshManualHoldings = async (force = false) => {
  if (manualCache && !force) return manualCache;

  try {
    const res = await api.get(
      "/api/holding/public/refresh-manual-holdings"
    );

    manualCache = res.data; // cache
    return manualCache;
  } catch (error) {
    manualCache = { message: "No manual holdings", data: [] };
    return manualCache;
  }
};

/* ================= CLEAR CACHE ================= */
export const clearHoldingCache = () => {
  exchangeCache = null;
  manualCache = null;
};

/* ================= MANUAL ADD / EDIT ================= */
export const manualAddEditHolding = async (payload) => {
  const res = await api.post(
    "/api/holding/public/manual-add-edit",
    payload
  );
  clearHoldingCache(); // important
  return res.data;
};

/* ================= MANUAL DELETE ================= */
export const deleteManualHolding = async (assetSymbol) => {
  const res = await api.delete(
    "/api/holding/public/delete-manual-holding",
    {
      params: { assetSymbol },
    }
  );
  clearHoldingCache(); // important
  return res.data;
};
