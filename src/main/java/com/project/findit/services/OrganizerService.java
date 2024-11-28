package com.project.findit.services;

import com.project.findit.models.CategoryModel;
import com.project.findit.models.OrganizerModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface OrganizerService {
    public OrganizerModel createOrganizer(OrganizerModel organizerModel);
    public List<OrganizerModel> getAllOrganizers();
    public Optional<OrganizerModel> getOrganizerDetails(UUID id);
    public OrganizerModel updateOrganizerDatails(UUID id, OrganizerModel organizerModel);
    public void deleteOrganizer(UUID id);
}
