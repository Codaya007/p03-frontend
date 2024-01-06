import axios from "axios";
const { API_BASEURL } = require("@/constants");

export const updateUser = async (id, body, token) => {
  const url = `${API_BASEURL}/users/${id}`;

  const { data } = await axios.patch(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getAllUsers = async (token) => {
  const url = `${API_BASEURL}/users`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};
