package com.mcommerce.microservice_paiement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long idCommande;      // Lien vers la commande
    private Double montant;       // Utilisation de Double (Wrapper)
    private Long numeroCarte;

    // Le champ modePaiement n'est pas utilisé par le ClientUI du TP,
    // on peut le garder mais il sera probablement null.
    private String modePaiement;

    // Constructeur par défaut
    public Paiement() { }

    // Constructeur complet
    public Paiement(Long idCommande, Double montant, Long numeroCarte, String modePaiement) {
        this.idCommande = idCommande;
        this.montant = montant;
        this.numeroCarte = numeroCarte;
        this.modePaiement = modePaiement;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdCommande() { return idCommande; }
    public void setIdCommande(Long idCommande) { this.idCommande = idCommande; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public Long getNumeroCarte() { return numeroCarte; }
    public void setNumeroCarte(Long numeroCarte) { this.numeroCarte = numeroCarte; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    @Override
    public String toString() {
        return "Paiement{id=" + id + ", idCommande=" + idCommande + ", montant=" + montant + "}";
    }
}