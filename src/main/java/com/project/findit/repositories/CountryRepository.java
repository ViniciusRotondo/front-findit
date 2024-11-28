package com.project.findit.repositories;

import com.project.findit.models.CountryModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<CountryModel, String> {
}
