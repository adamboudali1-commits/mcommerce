package com.mcommerce.microservice_paiement.dao;

import com.mcommerce.microservice_paiement.model.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaiementDAO extends JpaRepository<Paiement, Long> { }
