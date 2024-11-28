package com.project.findit.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "TB_LOCAL")
public class LocationModel implements Serializable {
    public static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private UUID idLocal;

    @Column
    private String nome;

    @Column
    private String endereco;

    @Column
    private Integer capacidadeDePessoas;

    @Column
    private String urlMapa;

    @Column
    private String telefone;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY)
    private Set<EventModel> events = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "cidade_id")
    private CityModel cities;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private StateModel states;

    @ManyToOne
    @JoinColumn(name = "pais_id")
    private CountryModel countries;

    public  LocationModel(){};

    public LocationModel(UUID idLocal, String nome, String endereco, Integer capacidadeDePessoas, String urlMapa, String telefone, Set<EventModel> events, CityModel cities, StateModel states, CountryModel countries) {
        this.idLocal = idLocal;
        this.nome = nome;
        this.endereco = endereco;
        this.capacidadeDePessoas = capacidadeDePessoas;
        this.urlMapa = urlMapa;
        this.telefone = telefone;
        this.events = events;
        this.cities = cities;
        this.states = states;
        this.countries = countries;
    }

    public UUID getIdLocal() {
        return idLocal;
    }

    public void setIdLocal(UUID idLocal) {
        this.idLocal = idLocal;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Integer getCapacidadeDePessoas() {
        return capacidadeDePessoas;
    }

    public void setCapacidadeDePessoas(Integer capacidadeDePessoas) {
        this.capacidadeDePessoas = capacidadeDePessoas;
    }

    public String getUrlMapa() {
        return urlMapa;
    }

    public void setUrlMapa(String urlMapa) {
        this.urlMapa = urlMapa;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Set<EventModel> getEvents() {
        return events;
    }

    public void setEvents(Set<EventModel> events) {
        this.events = events;
    }

    public CityModel getCities() {
        return cities;
    }

    public void setCities(CityModel cities) {
        this.cities = cities;
    }

    public StateModel getStates() {
        return states;
    }

    public void setStates(StateModel states) {
        this.states = states;
    }

    public CountryModel getCountries() {
        return countries;
    }

    public void setCountries(CountryModel countries) {
        this.countries = countries;
    }
}
