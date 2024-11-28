package com.project.findit.services;

import com.project.findit.models.CountryModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface CountryService {
    public CountryModel createCountry(CountryModel countryModel);
    public List<CountryModel> getAllCountries();
    public Optional<CountryModel> getCountryDetails(String id);
    public void deleteCountries(String id);
}
