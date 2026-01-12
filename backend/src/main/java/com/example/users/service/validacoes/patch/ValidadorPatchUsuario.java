package com.example.users.service.validacoes.patch;

import com.example.users.model.User;

import java.util.Map;

public interface ValidadorPatchUsuario {
    void validar(Long id, Map<String, Object> updates, User existing);
}
