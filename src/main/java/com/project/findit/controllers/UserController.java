package com.project.findit.controllers;

import com.project.findit.models.UserModel;
import com.project.findit.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/user")
    public UserModel addUserDetails(@RequestBody UserModel userModel){
        return userService.createUser(userModel);
    }

    @GetMapping("/user")
    public List<UserModel> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserModel> getUserDetails (@PathVariable UUID id){
        UserModel userModel = userService.getUserDetails(id).orElse(null);

        if (userModel != null){
            return ResponseEntity.ok().body(userModel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<UserModel> updateUserDetails(@PathVariable UUID id, @RequestBody UserModel userModel){
        UserModel upadatedUser = userService.updateUserDatails(id, userModel);

        if(upadatedUser != null){
            return ResponseEntity.ok().body(upadatedUser);
        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
