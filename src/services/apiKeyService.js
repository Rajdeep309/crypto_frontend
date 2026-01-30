import axios from "axios";

const API_URL = "https://cryptoportfoliotrackerbackend1-production.up.railway.app/api/apiKey/public";

export const addExchange = async (exchangeData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/addExchange`,
    exchangeData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
