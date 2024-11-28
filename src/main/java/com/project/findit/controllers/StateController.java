package com.project.findit.controllers;

import com.project.findit.models.CityModel;
import com.project.findit.models.StateModel;
import com.project.findit.services.CityService;
import com.project.findit.services.StateService;
import jakarta.persistence.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class StateController {
    @Autowired
    StateService stateService;

    @PostMapping("state")
    public StateModel addStateDetails(@RequestBody StateModel stateModel){
        return stateService.createState(stateModel);
    }

    @GetMapping("/state")
    public List<StateModel> getAllStatesDetails(){
        return stateService.getAllStates();
    }

    @GetMapping("/state/{id}")
    public ResponseEntity<StateModel> getStateDetails(@PathVariable String id){
        StateModel state = stateService.getStatesDetails(id).orElse(null);
        if(state != null){
            return ResponseEntity.ok().body(state);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/state/{id}")
    public ResponseEntity<Void> deleteState(@PathVariable String id){
        stateService.deleteStates(id);
        return ResponseEntity.noContent().build();
    }
}
