import React, { useEffect, useState } from "react";
import { getPaiements } from "../services/paiementService";
import ReactPaginate from "react-paginate";

// --- ICONES SVG ---
const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Download: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Filter: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Card: () => <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Cash: () => <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  PayPal: () => <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 0.867 4.498-.53 2.516-2.018 3.86-4.378 3.86h-1.3l-1.09 6.945a.64.64 0 0 1-.632.544h-2.1l.666-4.25H9.69c-1.366 0-2.327-.55-2.614-2.07z"/></svg>,
  Dots: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>,
  Unknown: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

function PaiementsList() {
  const [paiements, setPaiements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPaiements();

        // --- CORRECTION CRITIQUE : Mapping des données Backend -> Frontend ---
        const enhancedData = (data || []).map(p => ({
            ...p,
            // Backend envoie idCommande (Long), on le transforme en String pour l'affichage
            commandeRef: p.idCommande ? `CMD-${p.idCommande}` : "Inconnu",

            // Backend n'a pas de champ date, on simule la date d'aujourd'hui
            date: new Date().toLocaleDateString('fr-FR'),

            // Si numeroCarte est présent, c'est une Carte Bancaire, sinon on regarde modePaiement
            mode_paiement_display: p.numeroCarte ? "Carte Bancaire" : (p.modePaiement || "Inconnu"),

            // On considère que si le paiement existe en base, c'est qu'il est "Réussi" (flux simple du TP)
            statut: "Réussi"
        }));

        setPaiements(enhancedData);
      } catch (err) {
        console.error("Erreur fetch paiements", err);
        // Données de test si le backend est éteint
        setPaiements([
            { id: 1, commandeRef: "CMD-8832", montant: 4500, mode_paiement_display: "Carte Bancaire", statut: "Réussi", date: "01/12/2023" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTRE CORRIGÉ ---
  const filtered = paiements.filter(p => {
      const commande = (p.commandeRef || "").toLowerCase();
      const mode = (p.mode_paiement_display || "").toLowerCase();
      const searchTerm = search.toLowerCase();

      return commande.includes(searchTerm) || mode.includes(searchTerm);
  });

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const displayedItems = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  // --- ICONEselon le mode ---
  const getMethodIcon = (mode) => {
    if (!mode) return <><Icons.Unknown /> <span className="ml-2 text-gray-400">Inconnu</span></>;

    const m = mode.toString().toLowerCase();
    if (m.includes("carte") || m.includes("visa")) return <><Icons.Card /> <span className="ml-2">Carte Bancaire</span></>;
    if (m.includes("paypal")) return <><Icons.PayPal /> <span className="ml-2">PayPal</span></>;

    return <><Icons.Unknown /> <span className="ml-2">{mode}</span></>;
  };

  const getStatusBadge = (statut) => {
    // Style vert pour "Réussi" (défaut dans notre cas)
    const styles = "bg-emerald-100 text-emerald-700 ring-emerald-600/20";
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles}`}>
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-600"></span>
        {statut}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historique des Paiements</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez et suivez toutes vos transactions financières.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                <Icons.Filter /> Filtres
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                <Icons.Download /> Exporter
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Search />
                </div>
                <input
                    type="text"
                    placeholder="Rechercher une commande..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </div>

        {loading && (
             <div className="p-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
             </div>
        )}

        {!loading && (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence Commande</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {displayedItems.length > 0 ? (
                    displayedItems.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-150">
                            {/* Affichage de la référence calculée */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                #{p.commandeRef}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {p.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="flex items-center">
                                    {getMethodIcon(p.mode_paiement_display)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(p.statut)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono font-bold">
                                {(p.montant || 0).toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Icons.Dots />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">
                            Aucun paiement trouvé.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )}

        {pageCount > 1 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-between items-center">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                   <p className="text-sm text-gray-700">Page {currentPage + 1} sur {pageCount}</p>
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
                   />
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default PaiementsList;