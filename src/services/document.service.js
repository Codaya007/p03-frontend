import axios from "axios";
const { API_BASEURL } = require("@/constants");

export const createDocument = async (body, token) => {
  const url = `${API_BASEURL}/documents`;

  const { data } = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateDocument = async (id, body, token) => {
  const url = `${API_BASEURL}/documents/${id}`;

  const { data } = await axios.patch(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const deleteDocument = async (id, token) => {
  const url = `${API_BASEURL}/documents/${id}`;

  const { data } = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getAllDocuments = async (token, owner) => {
  const url = `${API_BASEURL}/documents?owner=${owner}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getDocumentById = async (id, token) => {
  const url = `${API_BASEURL}/documents/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};
