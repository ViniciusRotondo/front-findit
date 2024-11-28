package com.project.findit.services;

import com.project.findit.models.CityModel;
import com.project.findit.repositories.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CityServiceImpl implements CityService{

    @Autowired
    private CityRepository cityRepository;

    @Override
    public CityModel createCity(CityModel cityModel) {
        return cityRepository.save(cityModel);
    }

    @Override
    public List<CityModel> getAllCities() {
        return cityRepository.findAll();
    }

    @Override
    public Optional<CityModel> getCityDetails(UUID id) {
        return cityRepository.findById(id);
    }

    @Override
    public void deleteCities(UUID id) {
        cityRepository.deleteById(id);
    }
}
