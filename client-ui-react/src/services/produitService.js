import axios from "axios";

// Port 9001. Garde la Majuscule si ton Controller Java a @RequestMapping("/Produits")
const API_URL = "http://localhost:9001/Produits";

export const getProduits = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createProduit = async (produit) => {
  const response = await axios.post(API_URL, produit);
  return response.data;
};