import axios from "axios";

// CORRECTION : Utiliser "/commandes" (minuscule)
const API_URL = "http://localhost:9002/commandes";

export const getCommandes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createCommande = async (commandeData) => {
  const response = await axios.post(API_URL, commandeData);
  return response.data;
};

export const deleteCommande = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const payeCommande = async (id) => {
  const response = await axios.put(`${API_URL}/${id}`);
  return response.data;
};