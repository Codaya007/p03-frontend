import axios from "axios";
const { API_BASEURL } = require("@/constants");

export const uploadFile = async (file, token) => {
  const url = `${API_BASEURL}/media/upload`;

  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(url, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.data;
};
