package com.project.findit.controllers;

import com.project.findit.models.OrganizerModel;
import com.project.findit.services.OrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class OrganizerController {
    @Autowired
    OrganizerService organizerService;

    @PostMapping("/organizer")
    public OrganizerModel addOrganizerDetails(@RequestBody OrganizerModel organizerModel){
        return organizerService.createOrganizer(organizerModel);
    }

    @GetMapping("/organizer")
    public List<OrganizerModel> getAllOrganizerDetails(){
        return organizerService.getAllOrganizers();
    }

    @GetMapping("/organizer/{id}")
    public ResponseEntity<OrganizerModel> getOrganizerDetails(@PathVariable UUID id){
        OrganizerModel organizer = organizerService.getOrganizerDetails(id).orElse(null);
        if(organizer != null){
            return ResponseEntity.ok().body(organizer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/organizer/{id}")
    public ResponseEntity<OrganizerModel> updateOrganizerDetails(@PathVariable UUID id, @RequestBody OrganizerModel organizerModel){
        OrganizerModel updatedOrganizer = organizerService.updateOrganizerDatails(id, organizerModel);
        if(updatedOrganizer != null){
            return ResponseEntity.ok().body(updatedOrganizer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/organizer/{id}")
    public ResponseEntity<Void> deleteOrganizer(@PathVariable UUID id){
        organizerService.deleteOrganizer(id);
        return ResponseEntity.noContent().build();
    }
}
