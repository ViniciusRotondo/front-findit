package com.project.findit.dtos;

import java.util.UUID;

public record EventRecordDto(String nome_do_evento,
                             String descricao,
                             String data_hora,
                             String url_imagem,
                             Double preco,
                             Double duracao,
                             Integer indicativo_idade,
                             String telefone,
                             String status,
                             UUID organizer,
                             UUID location,
                             UUID category) {
}
