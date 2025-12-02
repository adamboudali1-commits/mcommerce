package com.mcommerce.microservice_commandes.dto;

import java.util.Date;

public class CommandeDTO {

    private Long id;
    private Long productId;       // correspond à la référence produit
    private int quantite;
    private double prixTotal;
    private boolean commandePayee; // statut de paiement
    private Date dateCommande;

    public CommandeDTO() {}

    public CommandeDTO(Long id, Long productId, int quantite, double prixTotal, boolean commandePayee, Date dateCommande) {
        this.id = id;
        this.productId = productId;
        this.quantite = quantite;
        this.prixTotal = prixTotal;
        this.commandePayee = commandePayee;
        this.dateCommande = dateCommande;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }

    public double getPrixTotal() { return prixTotal; }
    public void setPrixTotal(double prixTotal) { this.prixTotal = prixTotal; }

    public boolean isCommandePayee() { return commandePayee; }
    public void setCommandePayee(boolean commandePayee) { this.commandePayee = commandePayee; }

    public Date getDateCommande() { return dateCommande; }
    public void setDateCommande(Date dateCommande) { this.dateCommande = dateCommande; }
}
