package com.project.findit.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "TB_PAIS")
public class CountryModel {
    @Id
    @Column
    private String sigla;

    @Column
    private String nome;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "countries", fetch = FetchType.LAZY)
    private Set<LocationModel> location = new HashSet<>();

    public CountryModel(){};

    public CountryModel(String sigla, String nome, Set<LocationModel> location) {
        this.sigla = sigla;
        this.nome = nome;
        this.location = location;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public Set<LocationModel> getLocation() {
        return location;
    }

    public void setLocation(Set<LocationModel> location) {
        this.location = location;
    }
}
