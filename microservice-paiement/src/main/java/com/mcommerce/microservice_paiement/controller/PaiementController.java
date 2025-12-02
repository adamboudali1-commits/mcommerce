package com.mcommerce.microservice_paiement.controller;

import com.mcommerce.microservice_paiement.dao.PaiementDAO;
import com.mcommerce.microservice_paiement.model.Paiement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/paiement") // Minuscule et singulier (standard)
public class PaiementController {

    private final PaiementDAO dao;

    public PaiementController(PaiementDAO dao) {
        this.dao = dao;
    }

    // POST /paiement : enregistrer un paiement
    @PostMapping
    public ResponseEntity<Paiement> createPaiement(@RequestBody Paiement paiement) {

        // Validation basique
        if (paiement.getIdCommande() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'ID de la commande est obligatoire");
        }

        // On vérifie qu'il y a bien un montant
        if (paiement.getMontant() == null || paiement.getMontant() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le montant est invalide");
        }

        // Sauvegarde
        Paiement saved = dao.save(paiement);

        // IMPORTANT : Le ClientUI attend un code 201 CREATED pour valider la suite
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // (Optionnel pour le TP mais utile pour debug)
    @GetMapping
    public List<Paiement> getAllPaiements() {
        return dao.findAll();
    }
}