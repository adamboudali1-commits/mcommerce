import React from "react";

function Panier({ panier, passerCommande, createCommandeFunc }) {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-bold mb-2">Panier</h2>
      {panier.length === 0 ? (
        <p>Le panier est vide</p>
      ) : (
        <ul>
          {panier.map((item, index) => (
            <li key={index} className="flex justify-between mb-1">
              <span>{item.nom} x {item.quantite}</span>
              <span>{item.prixTotal} MAD</span>
            </li>
          ))}
        </ul>
      )}
      {panier.length > 0 && (
        <button
          onClick={() => passerCommande(createCommandeFunc)}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Passer la commande
        </button>
      )}
    </div>
  );
}

export default Panier;
