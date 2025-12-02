import React, { useState, useRef } from "react";
// 1. IMPORT DU ROUTER ET DES HOOKS NECESSAIRES
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Dashboard from "./components/Dashboard";
import ProduitsList from "./components/ProduitsList";
import AjouterProduit from "./components/AjouterProduit";
import CommandesList from "./components/CommandesList";
import PaiementsList from "./components/PaiementsList";
import { createCommande } from "./services/commandeService"; // Assure-toi d'importer la fonction correcte
import { createPaiement } from "./services/paiementService"; // Nécessaire pour la page de paiement
import "./App.css";

// 2. COMPOSANT PAGE DE PAIEMENT (Nécessaire pour la redirection depuis ProduitsList)
const PagePaiement = () => {
  const { commandeId, montant } = useParams();
  const navigate = useNavigate();

  const handlePaiement = async () => {
    try {
      await createPaiement({
        idCommande: parseInt(commandeId),
        montant: parseFloat(montant),
        numeroCarte: 1234567812345678, // Simulation
        modePaiement: "Carte Bancaire"
      });
      alert("Paiement validé avec succès !");
      // Retour à l'accueil ou aux commandes après paiement
      window.location.href = "/";
    } catch (error) {
      alert("Erreur de paiement");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white p-6 rounded shadow-md m-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Paiement de la commande #{commandeId}</h2>
      <p className="text-xl mb-6">Montant à régler : <span className="font-bold text-blue-600">{montant} MAD</span></p>
      <button
        onClick={handlePaiement}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Confirmer le paiement
      </button>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [panier, setPanier] = useState([]);
  const nodeRef = useRef(null);

  // Ajouter un produit au panier
  const ajouterAuPanier = (produit, quantite = 1) => {
    // Vérifie si le produit est déjà dans le panier
    const exists = panier.find(item => item.productId === produit.id);
    if (exists) {
      setPanier(prev =>
        prev.map(item =>
          item.productId === produit.id
            ? { ...item, quantite: item.quantite + quantite, prixTotal: (item.quantite + quantite) * item.prixTotal / item.quantite }
            : item
        )
      );
    } else {
      setPanier(prev => [
        ...prev,
        { productId: produit.id, nom: produit.nom, quantite, prixTotal: produit.prix * quantite }
      ]);
    }
    alert(`${produit.nom} ajouté au panier`);
  };

  // Vider le panier
  const viderPanier = () => setPanier([]);

  // Passer la commande et rediriger vers paiement
  // Note: ProduitsList utilise maintenant sa propre fonction, mais on garde celle-ci pour ne rien supprimer.
  const passerCommande = async () => {
    if (panier.length === 0) {
      alert("Le panier est vide !");
      return;
    }

    try {
      for (const item of panier) {
        // Crée l'objet commande attendu par le backend
        const commande = {
          produit: item.nom,
          quantite: item.quantite,
          prixTotal: item.prixTotal,
          client: "Utilisateur1", // Remplace par le vrai client si tu as login
          statut: "EN_COURS"
        };
        await createCommande(commande);
      }
      alert("Commande(s) créée(s) avec succès !");
      viderPanier();
      setActiveTab("paiements"); // Redirige vers Paiements
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création des commandes !");
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "ajouter-produit":
        return <AjouterProduit onProduitAjoute={() => setActiveTab("produits")} />;
      case "produits":
        return <ProduitsList ajouterAuPanier={ajouterAuPanier} panier={panier} />;
      case "commandes":
        return <CommandesList panier={panier} passerCommande={passerCommande} />;
      case "paiements":
        return <PaiementsList />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    // 3. WRAPPER ROUTER AJOUTÉ ICI POUR CORRIGER L'ERREUR
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold tracking-tight">
                MCommerce<span className="text-blue-300">Admin</span>
              </h1>
            </div>
            <ul className="flex space-x-1 md:space-x-4">
              {["dashboard", "produits", "ajouter-produit", "commandes", "paiements"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize font-medium ${
                      activeTab === tab
                        ? "bg-white text-blue-800 shadow-md transform scale-105"
                        : "text-blue-100 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    {tab.replace("-", " ")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Contenu principal avec animation */}
        <main className="container mx-auto px-4 py-8 flex-1 max-w-7xl">
          {/* 4. GESTION DES ROUTES : ON GÈRE LE PAIEMENT À PART ET TES ONGLETS EN DEFAUT */}
          <Routes>
            {/* Route spécifique pour la page de paiement appelée par ProduitsList */}
            <Route path="/paiement/:commandeId/:montant" element={<PagePaiement />} />

            {/* Route par défaut (*) qui affiche ton système d'onglets existant */}
            <Route path="*" element={
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={activeTab}
                  nodeRef={nodeRef}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div ref={nodeRef} className="w-full">
                    {renderTab()}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 text-gray-500 py-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MCommerce Admin. Design par Adam.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;