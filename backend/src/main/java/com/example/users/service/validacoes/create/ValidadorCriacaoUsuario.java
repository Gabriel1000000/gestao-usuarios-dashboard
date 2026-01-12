package com.example.users.service.validacoes.create;

import com.example.users.dto.UserDto;

public interface ValidadorCriacaoUsuario {
    void validar(UserDto dto);
}
