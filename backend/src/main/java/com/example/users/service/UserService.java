package com.example.users.service;

import com.example.users.dto.UserDto;
import com.example.users.model.SystemRole;
import com.example.users.exception.UserNotFoundException;
import com.example.users.model.User;
import com.example.users.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    private UserDto toDto(User u) {
        return new UserDto(
            u.getId(), 
            u.getName(), 
            u.getEmail(), 
            u.getJobTitle(),
            u.getSystemRole(),
            u.getActive());
    }

    private User toEntity(UserDto d) {
        User u = new User();
        u.setId(d.getId());
        u.setName(d.getName());
        u.setEmail(d.getEmail());
        u.setJobTitle(d.getJobTitle());
        u.setSystemRole(d.getSystemRole());
        u.setActive(d.getActive() == null ? true : d.getActive());
        return u;
    }

    public List<UserDto> findAll() {
        return repo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public UserDto findById(Long id) {
        return repo.findById(id).map(this::toDto)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    public UserDto create(UserDto dto) {
        // repo.findByEmail(dto.getEmail()).ifPresent(u -> {
        //     throw new IllegalArgumentException("Email já cadastrado");
        // });
        String email = dto.getEmail();
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email é obrigatório.");

        if (repo.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        User u = toEntity(dto);
        u.setId(null);
        return toDto(repo.save(u));
    }

    public UserDto update(Long id, UserDto dto) {
        User existing = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        String newEmail = dto.getEmail();

        if (!existing.getEmail().equals(dto.getEmail())) {
            if (newEmail == null || newEmail.isBlank()) {
                throw new IllegalArgumentException("Email é obrigatório.");
            }
            boolean duplicado = repo.findByEmail(newEmail).stream().anyMatch(u -> !u.getId().equals(id));
            if (duplicado) {
                throw new IllegalArgumentException("Email já cadastrado");
            }
        existing.setEmail(newEmail);
        }

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setJobTitle(dto.getJobTitle());
        existing.setSystemRole(dto.getSystemRole());
        existing.setActive(dto.getActive());
        return toDto(repo.save(existing));
    }

    public void delete(Long id) {
        User existing = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        repo.delete(existing);
    }

    public UserDto patch(Long id, Map<String, Object> updates) {
        User existing = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));

        if (updates.containsKey("name") && updates.get("name") != null)
            existing.setName(updates.get("name").toString());

        if (updates.containsKey("email") && updates.get("email") != null) {
            String emailStr = updates.get("email").toString();
            // só faz algo se mudou
            if (!Objects.equals(existing.getEmail(), emailStr)) {

                if (emailStr == null || emailStr.isBlank()) {
                    throw new IllegalArgumentException("Email é obrigatório.");
                }
                if (repo.existsByEmailIgnoreCase(emailStr)) {
                    throw new IllegalArgumentException("Email já cadastrado");
                }
                existing.setEmail(emailStr);
            }
        }

        // =========================
        // NOVO: jobTitle (cargo/profissão)
        // =========================
        if (updates.containsKey("jobTitle") && updates.get("jobTitle") != null)
            existing.setJobTitle(updates.get("jobTitle").toString());

        // Compatibilidade: aceitar "role" para jobTitle
        if (updates.containsKey("role") && updates.get("role") != null)
            existing.setJobTitle(updates.get("role").toString());

        // =========================
        // NOVO: systemRole (RBAC)
        // =========================
        if (updates.containsKey("systemRole") && updates.get("systemRole") != null) {
            Object val = updates.get("systemRole");
            try {
                if (val instanceof SystemRole) {
                    existing.setSystemRole((SystemRole) val);
                } else {
                    String s = val.toString().trim().toUpperCase();
                    existing.setSystemRole(SystemRole.valueOf(s));
                }
            } catch (Exception e) {
                throw new IllegalArgumentException("systemRole inválido. Use: ADMIN, MANAGER ou USER.");
            }
        }

        if (updates.containsKey("active") && updates.get("active") != null) {
            Object val = updates.get("active");
            if (val instanceof Boolean) existing.setActive((Boolean) val);
            else existing.setActive(Boolean.parseBoolean(val.toString()));
        }

        return toDto(repo.save(existing));
    }

    // Estatísticas do dashboard
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new java.util.HashMap<>();

        // =========================
        // NOVO: Contagem por jobTitle (cargo/profissão)
        // =========================
        Map<String, Long> jobTitleStats = new java.util.HashMap<>();
        repo.countByJobTitle().forEach(r -> jobTitleStats.put((String) r[0], (Long) r[1]));

        // Mantém "byRole" por compatibilidade com o frontend antigo
        stats.put("byRole", jobTitleStats);

        // Novo nome correto
        stats.put("byJobTitle", jobTitleStats);

        // =========================
        // NOVO: Contagem por systemRole (RBAC)
        // =========================
        Map<String, Long> systemRoleStats = new java.util.HashMap<>();
        repo.countBySystemRole().forEach(r -> systemRoleStats.put(String.valueOf(r[0]), (Long) r[1]));
        stats.put("bySystemRole", systemRoleStats);

        // Contagem por ativo/inativo
        Map<String, Long> activeStats = new java.util.HashMap<>();
        repo.countByActive().forEach(a -> activeStats.put((Boolean) a[0] ? "active" : "inactive", (Long) a[1]));
        stats.put("byActive", activeStats);

        return stats;
    }

    // =========================
    // NOVOS MÉTODOS DE BUSCA
    // (não combinam filtros)
    // =========================

    public List<UserDto> findByName(String name) {
        String q = name == null ? "" : name.trim();
        if (q.isEmpty()) return List.of();
        return repo.findByNameContainingIgnoreCase(q).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> findByEmailLike(String email) {
        String q = email == null ? "" : email.trim();
        if (q.isEmpty()) return List.of();
        return repo.findByEmail(q).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Mantém por compatibilidade (nome antigo), mas agora busca por jobTitle
    public List<UserDto> findByRoleExactly(String role) {
        return findByJobTitleExactly(role);
    }

    // NOVO nome correto
    public List<UserDto> findByJobTitleExactly(String jobTitle) {
        String q = jobTitle == null ? "" : jobTitle.trim();
        if (q.isEmpty()) return List.of();
        return repo.findByJobTitle(q).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // NOVO: busca por systemRole
    public List<UserDto> findBySystemRole(SystemRole systemRole) {
        if (systemRole == null) return List.of();
        return repo.findBySystemRole(systemRole).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> findByActive(Boolean active) {
        if (active == null) return List.of();
        return repo.findByActive(active).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
