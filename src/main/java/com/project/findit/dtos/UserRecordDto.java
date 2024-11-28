package com.project.findit.dtos;

import java.util.Date;

public record UserRecordDto(Date dataNascimento, String email, String nome, String senha, String telefone) {
}
