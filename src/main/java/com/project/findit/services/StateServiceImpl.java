package com.project.findit.services;

import com.project.findit.models.StateModel;
import com.project.findit.repositories.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StateServiceImpl implements StateService{

    @Autowired
    private StateRepository stateRepository;

    @Override
    public StateModel createState(StateModel stateModel) {
        return stateRepository.save(stateModel);
    }

    @Override
    public List<StateModel> getAllStates() {
        return stateRepository.findAll();
    }

    @Override
    public Optional<StateModel> getStatesDetails(String id) {
        return stateRepository.findById(id);
    }

    @Override
    public void deleteStates(String id) {
        stateRepository.deleteById(id);
    }
}
