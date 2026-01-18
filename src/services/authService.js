import api from "./axiosInstance";

/* ================= SIGN UP ================= */
export const signUp = async (name, email, password) => {
  const res = await api.post(
    "/api/account/auth/public/sign-up",
    null,
    {
      params: { name, email, password },
    }
  );

  // backend may or may not return token
  const token = res?.data?.data?.token;
  if (token) {
    localStorage.setItem("token", token);
  }

  return res.data;
};

/* ================= LOGIN ================= */
export const login = async (email, password) => {
  const res = await api.post(
    "/api/account/auth/public/log-in",
    null,
    {
      params: { email, password },
    }
  );

  // ✅ Store token safely
  const token = res?.data?.data?.token;
  if (token) {
    localStorage.setItem("token", token);
  }

  return res.data;
};

/* ================= LOGOUT ================= */
export const logout = () => {
  localStorage.removeItem("token");
};

/* ================= FORGET PASSWORD ================= */
export const forgetPassword = async (email) => {
  const res = await api.post(
    "/api/account/auth/public/forget-password",
    null,
    { params: { email } }
  );

  return res.data;
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (email, newPassword) => {
  const res = await api.patch(
    "/api/account/auth/public/reset-password",
    null,
    { params: { email, newPassword } }
  );

  return res.data;
};

/* ================= AUTH HELPERS ================= */
export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
