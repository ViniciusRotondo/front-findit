package com.project.findit.services;

import com.project.findit.models.OrganizerModel;
import com.project.findit.repositories.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrganizerServiceImpl implements OrganizerService {
    @Autowired
    private OrganizerRepository organizerRepository;

    @Override
    public OrganizerModel createOrganizer(OrganizerModel organizerModel) {
        return organizerRepository.save(organizerModel);
    }

    @Override
    public List<OrganizerModel> getAllOrganizers() {
        return organizerRepository.findAll();
    }

    @Override
    public Optional<OrganizerModel> getOrganizerDetails(UUID id) {
        return organizerRepository.findById(id);
    }

    @Override
    public OrganizerModel updateOrganizerDatails(UUID id, OrganizerModel organizerModel) {
        OrganizerModel updatedOrganizer = organizerRepository.findById(id).orElse(null);

        if(updatedOrganizer != null){
            updatedOrganizer.setNome(organizerModel.getNome());
            updatedOrganizer.setEmail(organizerModel.getEmail());
            updatedOrganizer.setSenha(organizerModel.getSenha());
            updatedOrganizer.setCnpj(organizerModel.getCnpj());
            updatedOrganizer.setCpf(organizerModel.getCpf());
            updatedOrganizer.setEnderecoEmpresa(organizerModel.getEnderecoEmpresa());
            updatedOrganizer.setNomeEmpresa(organizerModel.getNomeEmpresa());

            return organizerRepository.save(updatedOrganizer);
        } else {
            throw new RuntimeException("Organizador não encontrado com esse ID: " + id);
        }
    }

    @Override
    public void deleteOrganizer(UUID id) {
        organizerRepository.deleteById(id);
    }
}
