import React, { useEffect, useState } from "react";
import { getProduits } from "../services/produitService";
import { getCommandes } from "../services/commandeService";
import { getPaiements } from "../services/paiementService";
import { Bar, Doughnut } from "react-chartjs-2"; // J'ai changé Pie en Doughnut pour un look plus moderne
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- ICONES SVG PRO (Inline pour éviter les dépendances) ---
const Icons = {
  TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Box: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Cart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  CreditCard: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Money: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
};

// --- COMPOSANTS UI ---

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  // Mapping des couleurs pour Tailwind (backgrounds et textes)
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-emerald-500 flex items-center font-medium">
          <Icons.TrendingUp />
          <span className="ml-1">{trend}</span>
        </span>
        <span className="text-gray-400 ml-2">vs mois dernier</span>
      </div>
    </div>
  );
};

const ListItem = ({ title, subtitle, value, status, statusColor }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
    <div className="flex flex-col">
      <span className="font-semibold text-gray-800 text-sm">{title}</span>
      {subtitle && <span className="text-xs text-gray-500 mt-0.5">{subtitle}</span>}
    </div>
    <div className="text-right">
      <div className="font-bold text-gray-800 text-sm">{value}</div>
      {status && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      )}
    </div>
  </div>
);

// --- DASHBOARD PRINCIPAL ---

function Dashboard({ setActiveTab }) {
  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données factices améliorées
  const dummyProduits = [
    { nom: "MacBook Pro M2", prix: 14000, stock: 8 },
    { nom: "Sony WH-1000XM5", prix: 3500, stock: 15 },
    { nom: "Samsung Odyssey G9", prix: 11000, stock: 3 }
  ];
  const dummyCommandes = [
    { id: "CMD-2490", client: "Sophie Martin", montant: 14000, statut: "Livrée" },
    { id: "CMD-2491", client: "Karim Benali", montant: 3500, statut: "En cours" },
    { id: "CMD-2492", client: "Julie Dupont", montant: 250, statut: "Annulée" }
  ];
  const dummyPaiements = [
    { id: "TX-9981", montant: 14000, mode: "Visa", statut: "Réussi" },
    { id: "TX-9982", montant: 3500, mode: "PayPal", statut: "En attente" },
    { id: "TX-9983", montant: 120, mode: "MasterCard", statut: "Réussi" }
  ];

  useEffect(() => {
    // Simulation d'appel API
    setTimeout(() => {
        // Remplacer par vos vrais appels API
        setProduits(dummyProduits);
        setCommandes(dummyCommandes);
        setPaiements(dummyPaiements);
        setLoading(false);
    }, 800);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 text-sm font-medium">Chargement du tableau de bord...</p>
      </div>
    </div>
  );

  // Calculs & Config Charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { size: 11 } } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { border: { dash: [4, 4] }, ticks: { font: { size: 11 } }, grid: { color: '#f3f4f6' } }
    },
    elements: {
      bar: { borderRadius: 4 },
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Donne l'effet "Doughnut" fin
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, font: { size: 11 } } }
    }
  };

  const barData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [{
      label: 'Ventes (MAD)',
      data: [12000, 19000, 3000, 5000, 20000, 35000, 15000],
      backgroundColor: '#6366f1', // Indigo-500
      hoverBackgroundColor: '#4f46e5',
    }]
  };

  const pieData = {
    labels: ['Carte Bancaire', 'PayPal', 'Virement'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans text-gray-900">

      {/* Header avec Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-sm text-gray-500 mt-1">Aperçu de vos performances e-commerce.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50">
            Exporter
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 transition">
            + Nouvelle Commande
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Revenu Total" value="245,000 MAD" icon={Icons.Money} color="green" trend="+12%" />
        <StatCard title="Commandes" value={commandes.length} icon={Icons.Cart} color="blue" trend="+5%" />
        <StatCard title="Produits Actifs" value={produits.length} icon={Icons.Box} color="purple" trend="+2%" />
        <StatCard title="Panier Moyen" value="1,240 MAD" icon={Icons.CreditCard} color="orange" trend="-1.5%" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Analyse des Ventes</h3>
            <select className="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>7 derniers jours</option>
              <option>Ce mois</option>
            </select>
          </div>
          <div className="h-72">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Répartition Paiements</h3>
          <div className="h-64 relative">
             <Doughnut data={pieData} options={doughnutOptions} />
             {/* Center Text Trick */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-24">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-gray-800">100%</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Recent Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Dernières Commandes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Commandes Récentes</h3>
            <button onClick={() => setActiveTab('commandes')} className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center">
              Tout voir <Icons.ArrowRight />
            </button>
          </div>
          <div className="flex-1">
            {commandes.map((c, i) => (
              <ListItem
                key={i}
                title={c.id}
                subtitle={c.client}
                value={`${c.montant} MAD`}
                status={c.statut}
                statusColor={
                  c.statut === 'Livrée' ? 'bg-emerald-100 text-emerald-700' :
                  c.statut === 'En cours' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }
              />
            ))}
          </div>
        </div>

        {/* Top Produits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Top Produits</h3>
            <button onClick={() => setActiveTab('produits')} className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center">
              Tout voir <Icons.ArrowRight />
            </button>
          </div>
          <div className="flex-1">
            {produits.map((p, i) => (
              <ListItem
                key={i}
                title={p.nom}
                subtitle={`${p.stock} en stock`}
                value={`${p.prix} MAD`}
              />
            ))}
          </div>
        </div>

        {/* Derniers Paiements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Transactions</h3>
            <button onClick={() => setActiveTab('paiements')} className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center">
              Tout voir <Icons.ArrowRight />
            </button>
          </div>
          <div className="flex-1">
            {paiements.map((p, i) => (
              <ListItem
                key={i}
                title={p.id}
                subtitle={p.mode}
                value={`${p.montant} MAD`}
                status={p.statut}
                statusColor={p.statut === 'Réussi' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;