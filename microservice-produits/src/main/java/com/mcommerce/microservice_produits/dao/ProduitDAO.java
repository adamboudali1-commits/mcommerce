package com.mcommerce.microservice_produits.dao;

import com.mcommerce.microservice_produits.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitDAO extends JpaRepository<Produit, Long> {
}