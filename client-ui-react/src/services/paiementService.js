import axios from "axios";
// On importe la fonction pour mettre à jour la commande après paiement
import { payeCommande } from "./commandeService";

// Attention : Doit correspondre à @RequestMapping("/paiement") du Backend (Port 9003)
const API_URL = "http://localhost:9003/paiement";

export const getPaiements = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// CORRECTION : On attend un objet 'paiementData'
export const createPaiement = async (paiementData) => {
  // Etape 1 : Enregistrer le paiement
  const response = await axios.post(API_URL, paiementData);

  // Etape 2 : Si le paiement est réussi (201 Created), on met à jour la commande
  // Le backend Java retourne l'objet sauvegardé, on récupère l'idCommande
  if (response.status === 201 || response.data) {
      try {
          await payeCommande(paiementData.idCommande);
      } catch (error) {
          console.error("Erreur lors de la validation de la commande", error);
      }
  }

  return response.data;
};