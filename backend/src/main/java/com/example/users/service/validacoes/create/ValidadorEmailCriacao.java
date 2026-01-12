
package com.example.users.service.validacoes.create;

import com.example.users.dto.UserDto;
import com.example.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidadorEmailCriacao implements ValidadorCriacaoUsuario {

    @Autowired
    private UserRepository repo;

    @Override
    public void validar(UserDto dto) {
        var email = dto.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email é obrigatório.");
        }
        if (repo.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
    }
}
