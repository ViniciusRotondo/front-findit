package com.project.findit.controllers;

import com.project.findit.models.EventModel;
import com.project.findit.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class EventController {
    @Autowired
    EventService eventService;

    @PostMapping("/event")
    public EventModel addEventDetails(@RequestBody EventModel eventModel){
        return eventService.createEvent(eventModel);
    }

    @GetMapping("/event")
    public List<EventModel> getAllEventsDetails(){
        return eventService.getAllEvents();
    }

    @GetMapping("/event/{id}")
    public ResponseEntity<EventModel> getEventDetails(@PathVariable UUID id){
        EventModel event = eventService.getEventsDetails(id).orElse(null);
        if(event != null){
            return ResponseEntity.ok().body(event);
        } else{
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/event/{id}")
    public ResponseEntity<EventModel> updateEventDetails(@PathVariable UUID id, @RequestBody EventModel eventModel){
        EventModel updateEvent = eventService.updateEventDatails(id, eventModel);
        if(updateEvent != null){
            return ResponseEntity.ok().body(updateEvent);
        } else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/event/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id){
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
