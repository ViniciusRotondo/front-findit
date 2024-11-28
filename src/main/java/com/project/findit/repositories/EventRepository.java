package com.project.findit.repositories;

import com.project.findit.models.EventModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EventRepository extends JpaRepository<EventModel, UUID> {
}
