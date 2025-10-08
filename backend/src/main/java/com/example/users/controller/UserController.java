package com.example.users.controller;

import com.example.users.dto.UserDto;
import com.example.users.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @Operation(summary = "Lista todos os usuários", description = "Retorna uma lista de todos os usuários cadastrados no sistema.")
    @GetMapping
    public List<UserDto> getAll() {
        return service.findAll();
    }

    @Operation(summary = "Detalhes do usuário", description = "Retorna os detalhes de um usuário específico com base no ID fornecido.")
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @Operation(summary = "Cria um novo usuário", description = "Adiciona um novo usuário ao sistema com os dados fornecidos.")
    @PostMapping
    public ResponseEntity<UserDto> create(@Valid @RequestBody UserDto dto) {
        UserDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);

    }

    @Operation(summary = "Atualiza um usuário", description = "Atualiza os dados do usuário com base no ID fornecido.")
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @Valid @RequestBody UserDto dto) {
        UserDto updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Deleta um usuário", description = "Remove o usuário do sistema com base no ID fornecido.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Atualiza parcialmente os dados do usuário", description = "Realiza a atualização parcial dos dados do usuário, ou seja, pode enviar apenas os campos que deseja atualizar.")
    @PatchMapping("/{id}")
    public ResponseEntity<UserDto> patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        UserDto updated = service.patch(id, updates);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Estatísticas dos usuários", description = "Retorna estatísticas sobre os usuários cadastrados, como total de usuários, ativos, inativos e distribuição por função.")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getStats());
    }

    
    // --- Filtros independentes (não combinados) ---
    @Operation(summary = "Buscar usuários pelo nome (não combinado)")
    @GetMapping("/by-name")
    public ResponseEntity<List<UserDto>> findByName(@RequestParam String name) {
        return ResponseEntity.ok(service.findByName(name));
    }

    @Operation(summary = "Buscar usuários pelo e-mail (não combinado)")
    @GetMapping("/by-email")
    public ResponseEntity<List<UserDto>> findByEmail(@RequestParam String email) {
        return ResponseEntity.ok(service.findByEmailLike(email));
    }

    @Operation(summary = "Buscar usuários pela função (não combinado)")
    @GetMapping("/by-role")
    public ResponseEntity<List<UserDto>> findByRole(@RequestParam String role) {
        return ResponseEntity.ok(service.findByRoleExactly(role));
    }

    @Operation(summary = "Buscar usuários por status ativo/inativo (não combinado)")
    @GetMapping("/by-active")
    public ResponseEntity<List<UserDto>> findByActive(@RequestParam Boolean active) {
        return ResponseEntity.ok(service.findByActive(active));
    }
}
