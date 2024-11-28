package com.project.findit.services;

import com.project.findit.models.StateModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface StateService {
    public StateModel createState(StateModel stateModel);
    public List<StateModel> getAllStates();
    public Optional<StateModel> getStatesDetails(String id);
    public void deleteStates(String id);
}
