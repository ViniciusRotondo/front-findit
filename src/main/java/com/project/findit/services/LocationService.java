package com.project.findit.services;

import com.project.findit.models.CategoryModel;
import com.project.findit.models.LocationModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface LocationService {
    public LocationModel createLocation(LocationModel locationModel);
    public List<LocationModel> getAllLocations();
    public Optional<LocationModel> getLocationDetails(UUID id);
    public LocationModel updateLocationDatails(UUID id, LocationModel locationModel);
    public void deleteLocation(UUID id);
}
