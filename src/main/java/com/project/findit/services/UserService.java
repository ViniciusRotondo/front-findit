package com.project.findit.services;

import com.project.findit.models.UserModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface UserService {
    public UserModel createUser(UserModel userModel);
    public List<UserModel> getAllUsers();
    public Optional<UserModel> getUserDetails(UUID id);
    public UserModel updateUserDatails(UUID id, UserModel userModel);
    public void deleteUser(UUID id);
}
