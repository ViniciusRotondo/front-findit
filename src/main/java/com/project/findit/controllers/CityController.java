package com.project.findit.controllers;

import com.project.findit.models.CategoryModel;
import com.project.findit.models.CityModel;
import com.project.findit.services.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class CityController {
    @Autowired
    CityService cityService;

    @PostMapping("city")
    public CityModel addCityDetails(@RequestBody CityModel cityModel){
        return cityService.createCity(cityModel);
    }

    @GetMapping("/city")
    public List<CityModel> getAllCitiesDetails(){
        return cityService.getAllCities();
    }

    @GetMapping("/city/{id}")
    public ResponseEntity<CityModel> getCityDetails(@PathVariable UUID id){
        CityModel city = cityService.getCityDetails(id).orElse(null);
        if(city != null){
            return ResponseEntity.ok().body(city);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/city/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable UUID id){
        cityService.deleteCities(id);
        return ResponseEntity.noContent().build();
    }
}
