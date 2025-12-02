package com.mcommerce.microservice_commandes.dao;

import com.mcommerce.microservice_commandes.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandeDAO extends JpaRepository<Commande, Long> {
    // Méthodes de recherche personnalisées si besoin
    List<Commande> findByProductId(Long productId);
}