package com.project.findit.repositories;

import com.project.findit.models.CityModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CityRepository extends JpaRepository<CityModel, UUID> {
}
