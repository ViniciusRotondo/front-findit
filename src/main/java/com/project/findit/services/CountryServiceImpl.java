package com.project.findit.services;

import com.project.findit.models.CountryModel;
import com.project.findit.repositories.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CountryServiceImpl implements CountryService{
    @Autowired
    private CountryRepository countryRepository;

    @Override
    public CountryModel createCountry(CountryModel countryModel) {
        return countryRepository.save(countryModel);
    }

    @Override
    public List<CountryModel> getAllCountries() {
        return countryRepository.findAll();
    }

    @Override
    public Optional<CountryModel> getCountryDetails(String id) {
        return countryRepository.findById(id);
    }

    @Override
    public void deleteCountries(String id) {
        countryRepository.deleteById(id);
    }
}
