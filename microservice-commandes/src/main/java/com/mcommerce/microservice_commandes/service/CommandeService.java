package com.mcommerce.microservice_commandes.service;

import com.mcommerce.microservice_commandes.dao.CommandeDAO;
import com.mcommerce.microservice_commandes.model.Commande;
// Si tu n'as pas créé cette classe d'exception personnalisée, remplace-la par RuntimeException
import com.mcommerce.microservice_commandes.exception.CommandeNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommandeService {

    private final CommandeDAO dao;

    public CommandeService(CommandeDAO dao) {
        this.dao = dao;
    }

    public List<Commande> getAllCommandes() {
        return dao.findAll();
    }

    public Commande getCommandeById(Long id) {
        return dao.findById(id).orElseThrow(() ->
                new CommandeNotFoundException("Commande avec id " + id + " non trouvée"));
    }

    public Commande createCommande(Commande commande) {
        return dao.save(commande);
    }

    public Commande updateCommande(Long id, Commande updated) {
        Commande existing = dao.findById(id).orElseThrow(() ->
                new CommandeNotFoundException("Commande avec id " + id + " non trouvée"));

        // --- CORRECTION ICI ---
        // Avant : existing.setProduit(updated.getProductId());
        // Après : Utilisation du bon setter défini dans ton Model
        existing.setProductId(updated.getProductId());

        existing.setQuantite(updated.getQuantite());
        existing.setPrixTotal(updated.getPrixTotal());
        return dao.save(existing);
    }

    public void deleteCommande(Long id) {
        if (!dao.existsById(id)) {
            throw new CommandeNotFoundException("Commande avec id " + id + " non trouvée");
        }
        dao.deleteById(id);
    }
}