package com.project.findit.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "TB_ORGANIZADOR")
public class OrganizerModel extends PeopleModel implements Serializable {
    public static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private UUID idOrganizador;

    @Column
    private String cpf;

    @Column
    private String cnpj;

    @Column
    private String nomeEmpresa;

    @Column
    private String enderecoEmpresa;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "organizer", fetch = FetchType.LAZY)
    private Set<EventModel> events = new HashSet<>();

    public OrganizerModel(){};

    public OrganizerModel(String nome, String email, String senha, UUID idOrganizador, String cpf, String cnpj, String nomeEmpresa, String enderecoEmpresa) {
        super(nome, email, senha);
        this.idOrganizador = idOrganizador;
        this.cpf = cpf;
        this.cnpj = cnpj;
        this.nomeEmpresa = nomeEmpresa;
        this.enderecoEmpresa = enderecoEmpresa;
    }

    public UUID getIdOrganizador() {
        return idOrganizador;
    }

    public void setIdOrganizador(UUID idOrganizador) {
        this.idOrganizador = idOrganizador;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public String getEnderecoEmpresa() {
        return enderecoEmpresa;
    }

    public void setEnderecoEmpresa(String enderecoEmpresa) {
        this.enderecoEmpresa = enderecoEmpresa;
    }

    public Set<EventModel> getEvents() {
        return events;
    }

    public void setEvents(Set<EventModel> events) {
        this.events = events;
    }
}
