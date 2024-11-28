package com.project.findit.services;

import com.project.findit.models.EventModel;
import com.project.findit.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventServiceImpl implements EventService{

    @Autowired
    private EventRepository eventRepository;


    @Override
    public EventModel createEvent(EventModel eventModel) {
        return eventRepository.save(eventModel);
    }

    @Override
    public List<EventModel> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Optional<EventModel> getEventsDetails(UUID id) {
        return eventRepository.findById(id);
    }

    @Override
    public EventModel updateEventDatails(UUID id, EventModel eventModel) {
        EventModel existingEvent = eventRepository.findById(id).orElse(null);

        if(existingEvent != null){
            existingEvent.setDataHora(eventModel.getDataHora());
            existingEvent.setDescricao(eventModel.getDescricao());
            existingEvent.setDuracao(eventModel.getDuracao());
            existingEvent.setIndicativoIdade(eventModel.getIndicativoIdade());
            existingEvent.setNomeDoEvento(eventModel.getNomeDoEvento());
            existingEvent.setPreco(eventModel.getPreco());
            existingEvent.setTelefone(eventModel.getTelefone());
            existingEvent.setUrlImagem(eventModel.getUrlImagem());
            existingEvent.setStatus(eventModel.getStatus());
            existingEvent.setCategory(eventModel.getCategory());
            existingEvent.setLocation(eventModel.getLocation());
            existingEvent.setOrganizer(eventModel.getOrganizer());

            return eventRepository.save(existingEvent);
        } else {
            throw new RuntimeException("Evento não encontrado com esse ID: " + id);
        }
    }

    @Override
    public void deleteEvent(UUID id) {
        eventRepository.deleteById(id);
    }
}
