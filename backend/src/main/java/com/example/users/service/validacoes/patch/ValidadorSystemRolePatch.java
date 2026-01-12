package com.example.users.service.validacoes.patch;

import com.example.users.exception.ValidacaoException;
import com.example.users.model.SystemRole;
import com.example.users.model.User;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ValidadorSystemRolePatch implements ValidadorPatchUsuario {

    @Override
    public void validar(Long id, Map<String, Object> updates, User existing) {
        if (!updates.containsKey("systemRole") || updates.get("systemRole") == null) return;

        try {
            String value = updates.get("systemRole").toString().trim().toUpperCase();
            SystemRole.valueOf(value);
        } catch (Exception e) {
            throw new ValidacaoException("systemRole inválido. Use: ADMIN, MANAGER ou USER.");
        }
    }
}
