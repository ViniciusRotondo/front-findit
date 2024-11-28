package com.project.findit.services;

import com.project.findit.models.CityModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface CityService {
    public CityModel createCity(CityModel cityModel);
    public List<CityModel> getAllCities();
    public Optional<CityModel> getCityDetails(UUID id);
    public void deleteCities(UUID id);
}
