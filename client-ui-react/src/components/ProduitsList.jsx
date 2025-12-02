import React, { useEffect, useState } from "react";
// 1. IMPORT DU HOOK DE NAVIGATION
import { useNavigate } from "react-router-dom";
import { getProduits } from "../services/produitService";
import { createCommande } from "../services/commandeService";
import ReactPaginate from "react-paginate";

// Icônes SVG
const SearchIcon = () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const StarIcon = () => <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>;
const CartIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;

// Composant Panier
const Panier = ({ panier, passerCommande }) => (
  <div className="bg-white p-4 rounded shadow mt-6">
    <h2 className="text-lg font-bold mb-2">Panier</h2>
    {panier.length === 0 ? (
      <p>Le panier est vide</p>
    ) : (
      <ul>
        {panier.map((item, idx) => (
          <li key={idx} className="flex justify-between mb-1">
            {/* Affichage sécurisé titre ou nom */}
            <span>{item.titre || item.nom} x {item.quantite}</span>
            <span>{item.prixTotal} MAD</span>
          </li>
        ))}
      </ul>
    )}
    {panier.length > 0 && (
      <button
        onClick={passerCommande}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Passer la commande
      </button>
    )}
  </div>
);

function ProduitsList() {
  const [produits, setProduits] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [panier, setPanier] = useState([]);

  // 2. INITIALISATION DU HOOK DE NAVIGATION
  const navigate = useNavigate();

  const itemsPerPage = 8;

  const loadProduits = async () => {
    setLoading(true);
    try {
      const data = await getProduits();
      setProduits(data);
    } catch (err) {
      console.error(err);
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduits();
  }, []);

  const filtered = produits.filter(p =>
    (p.titre || p.nom || "").toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const displayedItems = filtered.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const getImage = (prod) => prod.image || `https://placehold.co/300x300/png?text=${encodeURIComponent(prod.titre || prod.nom)}`;

  // Ajouter au panier
  const handleAddToCart = (produit) => {
    const existing = panier.find(p => p.id === produit.id);
    if (existing) {
      setPanier(panier.map(p => p.id === produit.id ? { ...p, quantite: p.quantite + 1, prixTotal: (p.quantite + 1) * p.prix } : p));
    } else {
      setPanier([...panier, { ...produit, quantite: 1, prixTotal: produit.prix }]);
    }
  };

  // 3. FONCTION PASSER COMMANDE CORRIGÉE
  const passerCommande = async () => {
    try {
      let derniereCommande = null;

      for (const item of panier) {
        // Construction de l'objet EXACT attendu par Spring Boot
        const commandeData = {
          productId: parseInt(item.id),      // IMPORTANT: L'ID numérique
          quantite: parseInt(item.quantite),
          prixTotal: parseFloat(item.prixTotal)
          // Pas de date, le backend la mettra
        };

        const result = await createCommande(commandeData);
        derniereCommande = result; // Le backend renvoie l'objet créé avec l'ID
      }

      alert("Commande créée ! Redirection vers le paiement...");
      setPanier([]);

      // 4. REDIRECTION VERS L'INTERFACE DE PAIEMENT
      if (derniereCommande && derniereCommande.id) {
        navigate(`/paiement/${derniereCommande.id}/${derniereCommande.prixTotal}`);
      }

    } catch (err) {
      console.error("Erreur lors de la commande:", err);
      alert("Erreur technique (Vérifiez que le Microservice Commandes tourne sur le port 9002)");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm mb-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">MaBoutique<span className="text-blue-600">.com</span></h2>
          <div className="flex flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
            <button className="absolute right-2 top-2.5">
              <SearchIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Filtres</h3>
            {/* ... Filtres (inchangés) ... */}
            <div className="space-y-2 mb-6">
               <p className="text-sm text-gray-500">Catégories (Démo)</p>
            </div>
          </div>
        </aside>

        {/* Produits + Panier */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">{filtered.length} résultats trouvés</p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">Aucun produit ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedItems.map(p => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img src={getImage(p)} alt={p.titre || p.nom} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!p.disponibilite ? "opacity-50 grayscale" : ""}`} />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex-1">
                      {/* Affichage Titre ou Nom */}
                      <h3 className="text-gray-800 font-medium text-lg leading-tight mb-1 line-clamp-2 h-12">{p.titre || p.nom}</h3>
                      <div className="flex items-center mb-2">{[...Array(4)].map((_, i) => <StarIcon key={i} />)}<span className="text-xs text-gray-400 ml-1">(42 avis)</span></div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-900">{p.prix} MAD</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className={`mt-4 w-full py-2 px-4 rounded-md font-medium flex justify-center items-center transition-colors bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm`}
                    >
                      <CartIcon /> Commander
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Panier */}
          <Panier panier={panier} passerCommande={passerCommande} />

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="mt-10 flex justify-center">
              <ReactPaginate
                previousLabel={"Précédent"}
                nextLabel={"Suivant"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName="flex items-center space-x-1"
                pageClassName="rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                pageLinkClassName="block px-4 py-2 text-sm font-medium"
                activeClassName="!bg-blue-600 !text-white !border-blue-600 hover:!bg-blue-700"
                previousClassName="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 text-sm font-medium mr-2"
                nextClassName="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 text-sm font-medium ml-2"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProduitsList;