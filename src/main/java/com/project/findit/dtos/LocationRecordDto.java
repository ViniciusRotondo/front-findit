package com.project.findit.dtos;

import java.util.UUID;

public record LocationRecordDto(Integer capacidade_de_pessoas, String endereco, String nome, String telefone, String url_mapa,
                                UUID cidade_id, String estado_id, String pais_id) {
}
