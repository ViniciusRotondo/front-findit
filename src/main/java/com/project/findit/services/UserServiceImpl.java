package com.project.findit.services;

import com.project.findit.models.UserModel;
import com.project.findit.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserModel createUser(UserModel userModel) {
        return userRepository.save(userModel);
    }

    @Override
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<UserModel> getUserDetails(UUID id) {
        return userRepository.findById(id);
    }

    @Override
    public UserModel updateUserDatails(UUID id, UserModel userModel) {
        UserModel updatedUser = userRepository.findById(id).orElse(null);

        if (updatedUser != null){
            updatedUser.setNome(userModel.getNome());
            updatedUser.setEmail(userModel.getEmail());
            updatedUser.setSenha(userModel.getSenha());
            updatedUser.setDataNascimento(userModel.getDataNascimento());
            updatedUser.setTelefone(userModel.getTelefone());

            return userRepository.save(updatedUser);
        } else {
            throw new RuntimeException("Usuário não encontrado com esse Id: " + id);
        }
    }

    @Override
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
