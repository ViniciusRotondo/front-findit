package com.project.findit.repositories;

import com.project.findit.models.OrganizerModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrganizerRepository extends JpaRepository<OrganizerModel, UUID> {
}
