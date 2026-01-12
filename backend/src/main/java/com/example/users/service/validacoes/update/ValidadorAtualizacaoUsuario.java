package com.example.users.service.validacoes.update;

import com.example.users.dto.UserDto;
import com.example.users.model.User;

public interface ValidadorAtualizacaoUsuario {
    void validar(Long id, UserDto dto, User existing);
}
