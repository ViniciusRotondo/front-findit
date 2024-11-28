package com.project.findit.controllers;

import com.project.findit.models.LocationModel;
import com.project.findit.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class LocationController {
    @Autowired
    LocationService locationService;

    @PostMapping("/location")
    public LocationModel addLocationDetails(@RequestBody LocationModel locationModel){
        return locationService.createLocation(locationModel);
    }

    @GetMapping("/location")
    public List<LocationModel> getAllLocationsDetails(){
        return locationService.getAllLocations();
    }

    @GetMapping("/location/{id}")
    public ResponseEntity<LocationModel> getLocationDetails(@PathVariable UUID id){
        LocationModel location = locationService.getLocationDetails(id).orElse(null);
        if(location != null){
            return ResponseEntity.ok().body(location);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/location/{id}")
    public ResponseEntity<LocationModel> updateLocationDatails(@PathVariable UUID id, @RequestBody LocationModel locationModel){
        LocationModel updateLocation = locationService.updateLocationDatails(id, locationModel);
        if(updateLocation != null){
            return ResponseEntity.ok(updateLocation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/location/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable UUID id){
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }

}
