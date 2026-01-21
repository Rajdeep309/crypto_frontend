import api from "./axiosInstance";

/* ================= EXCHANGE HOLDINGS ================= */
// Page load / manual refresh
export const refreshExchangeHoldings = async () => {
  try {
    const res = await api.post(
      "/api/holding/public/refresh-exchange-holdings"
    );
    return res.data; // { message, data }
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn("No exchange holdings found");
      return {
        message: "No exchange holdings found",
        data: [],
      };
    }

    throw error; // other errors (network, auth, etc.)
  }
};

/* ================= MANUAL HOLDINGS ================= */
// Page load / after add-edit-delete
export const refreshManualHoldings = async () => {
  try {
    const res = await api.get(
      "/api/holding/public/refresh-manual-holdings"
    );
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn("No manual holdings found");
      return {
        message: "No manual holdings found",
        data: [],
      };
    }

    throw error;
  }
};

/* ================= MANUAL ADD / EDIT ================= */
// Used by ManualHoldingDrawer
export const manualAddEditHolding = async (payload) => {
  const res = await api.post(
    "/api/holding/public/manual-add-edit",
    payload
  );
  return res.data;
};

/* ================= MANUAL DELETE ================= */
// Only for MANUAL holdings
export const deleteManualHolding = async (assetSymbol) => {
  const res = await api.delete(
    "/api/holding/public/delete-manual-holding",
    {
      params: { assetSymbol },
    }
  );
  return res.data;
};
