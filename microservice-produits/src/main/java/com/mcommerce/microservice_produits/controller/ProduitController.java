package com.mcommerce.microservice_produits.controller;

import com.mcommerce.microservice_produits.dao.ProduitDAO;
import com.mcommerce.microservice_produits.model.Produit;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/Produits") // Respecte la casse du Proxy Feign du PDF
public class ProduitController {

    private final ProduitDAO produitDAO; // Utilisation du bon nom de l'interface

    public ProduitController(ProduitDAO produitDAO) {
        this.produitDAO = produitDAO;
    }

    // GET /Produits : liste complète (appelé par le ClientUI Accueil)
    @GetMapping
    public List<Produit> getAllProduits() {
        return produitDAO.findAll();
    }

    // GET /Produits/{id} : détail produit (appelé par FicheProduit)
    @GetMapping("/{id}")
    public Produit getProduitById(@PathVariable Long id) {
        return produitDAO.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit non trouvé"));
    }

    // POST /Produits : ajout (Admin ou test)
    @PostMapping
    public ResponseEntity<Produit> createProduit(@RequestBody Produit produit) {
        // Validation basique
        if (produit.getPrix() == null || produit.getPrix() <= 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prix invalide");

        Produit savedProduit = produitDAO.save(produit);
        return new ResponseEntity<>(savedProduit, HttpStatus.CREATED);
    }

    // PUT /Produits/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable Long id, @RequestBody Produit produit) {
        return produitDAO.findById(id)
                .map(existing -> {
                    if(produit.getTitre() != null) existing.setTitre(produit.getTitre());
                    if(produit.getDescription() != null) existing.setDescription(produit.getDescription());
                    if(produit.getImage() != null) existing.setImage(produit.getImage());
                    if(produit.getPrix() != null) existing.setPrix(produit.getPrix());
                    return ResponseEntity.ok(produitDAO.save(existing));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit non trouvé"));
    }

    // DELETE /Produits/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        if (!produitDAO.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit non trouvé");
        }
        produitDAO.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}