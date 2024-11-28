package com.project.findit.repositories;

import com.project.findit.models.LocationModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LocationRepository extends JpaRepository<LocationModel, UUID> {
}
