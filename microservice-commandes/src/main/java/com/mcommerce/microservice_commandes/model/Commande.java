package com.mcommerce.microservice_commandes.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "commande")
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private Integer quantite; // Utilisation de Integer (Wrapper) au lieu de int pour gérer le null
    private Double prixTotal; // Peut être null si le ClientUI ne l'envoie pas

    private Boolean commandePayee;  // true/false

    @Temporal(TemporalType.TIMESTAMP) // Bonnes pratiques pour les dates
    private Date dateCommande;

    // Constructeur par défaut (Obligatoire pour JPA/Hibernate)
    public Commande() {
        this.dateCommande = new Date(); // Date par défaut si aucune fournie
        this.commandePayee = false;
    }

    // Constructeur avec paramètres
    public Commande(Long productId, Integer quantite, Double prixTotal, Date dateCommande) {
        this.productId = productId;
        this.quantite = quantite;
        this.prixTotal = prixTotal;
        this.dateCommande = (dateCommande != null) ? dateCommande : new Date();
        this.commandePayee = false;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public Double getPrixTotal() { return prixTotal; }
    public void setPrixTotal(Double prixTotal) { this.prixTotal = prixTotal; }

    public Boolean isCommandePayee() { return commandePayee; }
    public void setCommandePayee(Boolean commandePayee) { this.commandePayee = commandePayee; }

    public Date getDateCommande() { return dateCommande; }
    public void setDateCommande(Date dateCommande) { this.dateCommande = dateCommande; }

    @Override
    public String toString() {
        return "Commande{" +
                "id=" + id +
                ", productId=" + productId +
                ", quantite=" + quantite +
                ", commandePayee=" + commandePayee +
                '}';
    }
}