package com.project.findit.repositories;

import com.project.findit.models.StateModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StateRepository extends JpaRepository<StateModel, String> {
}
