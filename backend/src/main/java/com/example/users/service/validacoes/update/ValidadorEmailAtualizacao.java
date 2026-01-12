package com.example.users.service.validacoes.update;

import com.example.users.dto.UserDto;
import com.example.users.exception.ValidacaoException;
import com.example.users.model.User;
import com.example.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidadorEmailAtualizacao implements ValidadorAtualizacaoUsuario {

    @Autowired
    private UserRepository repo;

    @Override
    public void validar(Long id, UserDto dto, User existing) {
        String newEmail = dto.getEmail();

        // se não mudou (ignorando maiúsc/minúsc), não valida unicidade
        if (existing.getEmail() != null && newEmail != null
                && existing.getEmail().equalsIgnoreCase(newEmail)) {
            return;
        }

        if (newEmail == null || newEmail.isBlank()) {
            throw new ValidacaoException("Email é obrigatório.");
        }

        if (repo.existsByEmailIgnoreCase(newEmail)) {
            throw new ValidacaoException("Email já cadastrado.");
        }
    }
}
