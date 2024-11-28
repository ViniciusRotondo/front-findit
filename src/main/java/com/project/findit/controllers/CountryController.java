package com.project.findit.controllers;

import com.project.findit.models.CountryModel;
import com.project.findit.models.StateModel;
import com.project.findit.services.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CountryController {
    @Autowired
    CountryService countryService;

    @PostMapping("country")
    public CountryModel addCountryDetails(@RequestBody CountryModel countryModel){
        return countryService.createCountry(countryModel);
    }

    @GetMapping("/country")
    public List<CountryModel> getAllCountriesDetails(){
        return countryService.getAllCountries();
    }

    @GetMapping("/country/{id}")
    public ResponseEntity<CountryModel> getCountryDetails(@PathVariable String id){
        CountryModel country = countryService.getCountryDetails(id).orElse(null);
        if(country != null){
            return ResponseEntity.ok().body(country);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/country/{id}")
    public ResponseEntity<Void> deleteCountry(@PathVariable String id){
        countryService.deleteCountries(id);
        return ResponseEntity.noContent().build();
    }
}
