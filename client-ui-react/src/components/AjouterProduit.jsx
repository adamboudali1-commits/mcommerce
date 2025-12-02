import React, { useState } from "react";
import { createProduit } from "../services/produitService";

function AjouterProduit({ onSuccess }) {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [disponibilite, setDisponibilite] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation front
    if (!nom.trim()) {
      setError("Le nom du produit est obligatoire");
      return;
    }
    const prixNumber = parseFloat(prix);
    if (isNaN(prixNumber) || prixNumber <= 0) {
      setError("Le prix doit être supérieur à 0");
      return;
    }

    try {
      await createProduit({ nom, prix: prixNumber, disponibilite });
      setError("");
      setNom("");
      setPrix("");
      setDisponibilite(true);
      if (onSuccess) onSuccess(); // pour rafraîchir la liste
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Erreur lors de l'ajout du produit.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Ajouter un produit</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Prix (MAD)</label>
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="w-full p-2 border rounded"
            step="0.01"
            min="0"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={disponibilite}
            onChange={(e) => setDisponibilite(e.target.checked)}
          />
          <span>Disponible</span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Ajouter le produit
        </button>
      </form>
    </div>
  );
}

export default AjouterProduit;
