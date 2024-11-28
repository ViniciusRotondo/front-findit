package com.project.findit.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "TB_CIDADE")
public class CityModel implements Serializable {
    public static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private UUID id;

    @Column
    private String nome;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "cities", fetch = FetchType.LAZY)
    private Set<LocationModel> location = new HashSet<>();

    public CityModel(){};

    public CityModel(UUID id, String nome, Set<LocationModel> location) {
        this.id = id;
        this.nome = nome;
        this.location = location;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<LocationModel> getLocation() {
        return location;
    }

    public void setLocation(Set<LocationModel> location) {
        this.location = location;
    }
}
