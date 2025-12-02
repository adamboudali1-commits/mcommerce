package com.mcommerce.microservice_produits.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "produit")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;       // "nom" changé en "titre" pour le ClientUI
    private String description; // Ajouté pour les détails
    private String image;       // URL de l'image
    private Double prix;

    // Constructeur par défaut
    public Produit() { }

    // Constructeur complet
    public Produit(Long id, String titre, String description, String image, Double prix) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.image = image;
        this.prix = prix;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }

    @Override
    public String toString() {
        return "Produit{id=" + id + ", titre='" + titre + "', prix=" + prix + "}";
    }
}