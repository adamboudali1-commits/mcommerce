package com.mcommerce.microservice_commandes.controller;

import com.mcommerce.microservice_commandes.dao.CommandeDAO;
import com.mcommerce.microservice_commandes.model.Commande;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/commandes") // L'URL est bien en minuscules
@CrossOrigin(origins = "*") // INDISPENSABLE : Autorise React (Port 3000) à appeler ce code
public class CommandeController {

    private final CommandeDAO dao;

    public CommandeController(CommandeDAO dao) {
        this.dao = dao;
    }

    // GET /commandes : liste complète
    @GetMapping
    public List<Commande> getAllCommandes() {
        return dao.findAll();
    }

    // GET /commandes/{id} : commande spécifique
    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
        return dao.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée"));
    }

    // POST /commandes : créer une commande
    @PostMapping
    public ResponseEntity<Commande> createCommande(@RequestBody Commande commande) {
        // Validation basique
        if (commande.getProductId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le productId est obligatoire");
        }

        // 1. Initialiser la date si elle est absente (Évite l'erreur 500)
        if (commande.getDateCommande() == null) {
            commande.setDateCommande(new Date());
        }

        // 2. Forcer le statut à "Non payée" à la création
        commande.setCommandePayee(false);

        // 3. Sauvegarder
        Commande saved = dao.save(commande);

        // 4. Retourner l'objet créé (avec son ID généré)
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // PUT /commandes/{id} : mettre à jour le statut (Appelé après paiement)
    @PutMapping("/{id}")
    public ResponseEntity<Commande> updateCommandePayee(@PathVariable Long id) {
        return dao.findById(id)
                .map(existing -> {
                    existing.setCommandePayee(true);
                    return ResponseEntity.ok(dao.save(existing));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée"));
    }
}