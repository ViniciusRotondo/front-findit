package com.project.findit.models;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name ="TB_EVENTO")
public class EventModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private UUID idEvento;

    @Column
    private String nomeDoEvento;

    @Column
    private String descricao;

    @Column
    private String dataHora;

    @Column
    private String urlImagem;

    @Column
    private Double preco;

    @Column
    private Double duracao;

    @Column
    private Integer indicativoIdade;

    @Column
    private String telefone;

    @Column
    private String status;

    @ManyToOne
    @JoinColumn(name = "local_id")
    private LocationModel location;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private CategoryModel category;

    @ManyToOne
    @JoinColumn(name = "organizador_id")
    private OrganizerModel organizer;

    @ManyToMany
    @JoinTable(
            name = "tb_user_event",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<UserModel> users = new HashSet<>();

    public EventModel() {}

    public EventModel(UUID idEvento, String nomeDoEvento, String descricao, String dataHora,
                      String urlImagem, Double preco, Double duracao,
                      Integer indicativoIdade, String telefone, String status,
                      LocationModel location, CategoryModel category, OrganizerModel organizer,
                      Set<UserModel> users) {
        this.idEvento = idEvento;
        this.nomeDoEvento = nomeDoEvento;
        this.descricao = descricao;
        this.dataHora = dataHora;
        this.urlImagem = urlImagem;
        this.preco = preco;
        this.duracao = duracao;
        this.indicativoIdade = indicativoIdade;
        this.telefone = telefone;
        this.status = status;
        this.location = location;
        this.category = category;
        this.organizer = organizer;
        this.users = users;
    }

    public UUID getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(UUID idEvento) {
        this.idEvento = idEvento;
    }

    public String getNomeDoEvento() {
        return nomeDoEvento;
    }

    public void setNomeDoEvento(String nomeDoEvento) {
        this.nomeDoEvento = nomeDoEvento;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getDataHora() {
        return dataHora;
    }

    public void setDataHora(String dataHora) {
        this.dataHora = dataHora;
    }

    public String getUrlImagem() {
        return urlImagem;
    }

    public void setUrlImagem(String urlImagem) {
        this.urlImagem = urlImagem;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public Double getDuracao() {
        return duracao;
    }

    public void setDuracao(Double duracao) {
        this.duracao = duracao;
    }

    public Integer getIndicativoIdade() {
        return indicativoIdade;
    }

    public void setIndicativoIdade(Integer indicativoIdade) {
        this.indicativoIdade = indicativoIdade;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocationModel getLocation() {
        return location;
    }

    public void setLocation(LocationModel location) {
        this.location = location;
    }

    public CategoryModel getCategory() {
        return category;
    }

    public void setCategory(CategoryModel category) {
        this.category = category;
    }

    public OrganizerModel getOrganizer() {
        return organizer;
    }

    public void setOrganizer(OrganizerModel organizer) {
        this.organizer = organizer;
    }

    public Set<UserModel> getUsers() {
        return users;
    }

    public void setUsers(Set<UserModel> users) {
        this.users = users;
    }

}
