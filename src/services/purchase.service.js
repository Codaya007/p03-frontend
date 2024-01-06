import axios from "axios";
const { API_BASEURL } = require("@/constants");

export const createPurchase = async (body, token) => {
  const url = `${API_BASEURL}/purchases`;

  const { data } = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getAllPurchases = async (token) => {
  const url = `${API_BASEURL}/purchases`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getAllPurchasesBySeller = async (token) => {
  const url = `${API_BASEURL}/purchases/sold-books`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};
