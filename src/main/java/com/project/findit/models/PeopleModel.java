package com.project.findit.models;

import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public class PeopleModel {
    private String nome;
    private String email;
    private String senha;

    public PeopleModel(){};

    public PeopleModel(String nome, String email, String senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
