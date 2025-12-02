import React, { useEffect, useState } from "react";
import { getCommandes, createCommande, deleteCommande } from "../services/commandeService";
import ReactPaginate from "react-paginate";

// --- ICONES SVG ---
const Icons = {
  Plus: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Filter: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
};

function CommandesList() {
  const [commandes, setCommandes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // États pour la Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  // Champs du formulaire corrigés pour le Backend
  const [newProductId, setNewProductId] = useState(1); // On attend un ID (nombre)
  const [newQuantite, setNewQuantite] = useState(1);
  const [newPrixTotal, setNewPrixTotal] = useState(0);

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    setLoading(true);
    try {
      const data = await getCommandes();

      // Mapping des données reçues du backend Java
      const enrichedData = (data || []).map(c => ({
        ...c,
        // Le backend renvoie 'productId', mais pas le nom du produit.
        // Pour l'affichage admin, on affiche "Produit #ID"
        produit: `Produit Ref #${c.productId}`,
        client: "Client Anonyme", // Le microservice commande ne stocke pas le nom du client dans ce TP
        statut: c.commandePayee ? "Payée" : "En attente paiement", // Basé sur le boolean commandePayee
        date: c.dateCommande ? new Date(c.dateCommande).toLocaleDateString() : "Date inconnue"
      }));
      setCommandes(enrichedData);
    } catch (err) {
      console.error(err);
      setCommandes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    // Validation simple
    if (!newProductId || newProductId <= 0) {
        alert("ID produit invalide");
        return;
    }

    setIsSubmitting(true);
    try {
      // Construction de l'objet JSON exact attendu par le Controller Java
      const newCmdPayload = {
        productId: parseInt(newProductId), // IMPORTANT : productId (Long)
        quantite: parseInt(newQuantite),
        prixTotal: parseFloat(newPrixTotal),
        dateCommande: new Date()
      };

      const created = await createCommande(newCmdPayload);

      // On ajoute la commande créée à la liste locale pour éviter de recharger
      const newCmdDisplay = {
          ...created,
          produit: `Produit Ref #${created.productId}`,
          client: "Moi (Admin)",
          statut: created.commandePayee ? "Payée" : "En attente",
          date: new Date().toLocaleDateString()
      };

      setCommandes([newCmdDisplay, ...commandes]);

      // Reset et fermeture modal
      setNewProductId(1);
      setNewQuantite(1);
      setNewPrixTotal(0);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création. Vérifiez que le microservice Commandes est lancé (Port 9002).");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) return;

    try {
      await deleteCommande(id);
      setCommandes(commandes.filter(c => c.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const filtered = commandes.filter(c =>
    (c.produit || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.statut || "").toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const displayedItems = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  // --- COMPOSANT INTERNE: BADGE STATUT ---
  const StatusBadge = ({ status }) => {
    let styles = "bg-gray-100 text-gray-800";
    if (status === "Payée") styles = "bg-green-100 text-green-800 border-green-200";
    if (status === "En attente paiement" || status === "En attente") styles = "bg-yellow-100 text-yellow-800 border-yellow-200";

    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* --- HEADER & ACTIONS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h2>
          <p className="text-sm text-gray-500">Vue Administrateur (Back-office)</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md flex items-center transition-all transform hover:scale-105"
        >
          <Icons.Plus /> Nouvelle Commande (Manuelle)
        </button>
      </div>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Barre de recherche */}
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Rechercher par ID produit ou statut..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Tableau */}
        {loading ? (
           <div className="p-10 text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit REF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedItems.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-400">Aucune commande trouvée.</td></tr>
                ) : (
                  displayedItems.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                        #{c.id}
                        <div className="text-xs text-gray-400 font-normal">{c.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900 font-medium">{c.produit}</div>
                         <div className="text-xs text-gray-500">Qté: {c.quantite}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={c.statut} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono font-bold text-gray-900">
                        {c.prixTotal ? parseFloat(c.prixTotal).toFixed(2) + " MAD" : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Supprimer"
                        >
                          <Icons.Trash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination (Identique) */}
        {pageCount > 1 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-center">
               <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName="flex gap-2"
                  pageClassName="border border-gray-300 bg-white rounded hover:bg-gray-50"
                  pageLinkClassName="block px-3 py-1 text-sm text-gray-700"
                  activeClassName="!bg-indigo-600 !border-indigo-600"
                  activeLinkClassName="!text-white"
                  previousClassName="px-3 py-1 border border-gray-300 rounded bg-white text-sm text-gray-500 hover:bg-gray-50"
                  nextClassName="px-3 py-1 border border-gray-300 rounded bg-white text-sm text-gray-500 hover:bg-gray-50"
               />
            </div>
        )}
      </div>

      {/* --- MODAL DE CRÉATION CORRIGÉE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">Créer une commande (Manuelle)</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <Icons.Close />
                    </button>
                </div>

                <form id="createForm" onSubmit={handleCreate} className="space-y-4">
                    {/* CHAMP MODIFIÉ: On demande l'ID du produit, pas le nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID du Produit (Ref)</label>
                        <input
                            type="number"
                            min="1"
                            required
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                            placeholder="Ex: 1, 2..."
                            value={newProductId}
                            onChange={e => setNewProductId(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Saisissez l'ID du produit existant en base.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                            <input
                                type="number"
                                min="1"
                                required
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                                value={newQuantite}
                                onChange={e => setNewQuantite(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix Total</label>
                            <input
                                type="number"
                                min="0"
                                required
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                                value={newPrixTotal}
                                onChange={e => setNewPrixTotal(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  form="createForm"
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-70' : ''}`}
                >
                  {isSubmitting ? 'Création...' : 'Confirmer'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommandesList;