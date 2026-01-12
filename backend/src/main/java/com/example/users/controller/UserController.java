package com.example.users.controller;

import com.example.users.dto.UserDto;
import com.example.users.model.SystemRole;
import com.example.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @Operation(
            summary = "Lista usuários (com filtros opcionais e combináveis)",
            description = "Retorna todos os usuários ou aplica filtros combinados via query params."
    )
    @GetMapping
    public ResponseEntity<List<UserDto>> getAll(
            @Parameter(description = "Filtro por nome (contém, case-insensitive). Ex: gab")
            @RequestParam(required = false) String name,

            @Parameter(description = "Filtro por e-mail (contém, case-insensitive). Ex: @gmail")
            @RequestParam(required = false) String email,

            @Parameter(description = "Filtro por cargo/profissão (igual, case-insensitive). Ex: DESENVOLVEDOR")
            @RequestParam(required = false) String jobTitle,

            @Parameter(description = "Filtro por perfil de acesso (ADMIN, MANAGER, USER)")
            @RequestParam(required = false) SystemRole systemRole,

            @Parameter(description = "Filtro por status ativo/inativo")
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(service.search(name, email, jobTitle, systemRole, active));
    }

    @Operation(summary = "Detalhes do usuário", description = "Retorna os detalhes de um usuário específico com base no ID.")
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @Operation(summary = "Cria um novo usuário", description = "Adiciona um novo usuário ao sistema.")
    @PostMapping
    public ResponseEntity<UserDto> create(@Valid @RequestBody UserDto dto) {
        UserDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Atualiza um usuário", description = "Atualiza os dados do usuário com base no ID.")
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @Valid @RequestBody UserDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @Operation(summary = "Deleta um usuário", description = "Remove o usuário do sistema com base no ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Atualiza parcialmente um usuário", description = "Atualiza apenas os campos enviados no body.")
    @PatchMapping("/{id}")
    public ResponseEntity<UserDto> patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(service.patch(id, updates));
    }

    @Operation(summary = "Estatísticas dos usuários", description = "Distribuição por jobTitle, systemRole e status ativo/inativo.")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getStats());
    }
}
