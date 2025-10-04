package com.example.users.service;

import com.example.users.dto.UserDto;
import com.example.users.exception.UserNotFoundException;
import com.example.users.model.User;
import com.example.users.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getActive());
    }

    private User toEntity(UserDto d) {
        User u = new User();
        u.setId(d.getId());
        u.setName(d.getName());
        u.setEmail(d.getEmail());
        u.setRole(d.getRole());
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
        repo.findByEmail(dto.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email já cadastrado");
        });
        User u = toEntity(dto);
        u.setId(null);
        return toDto(repo.save(u));
    }

    public UserDto update(Long id, UserDto dto) {
        User existing = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));

        if (!existing.getEmail().equals(dto.getEmail())) {
            repo.findByEmail(dto.getEmail()).filter(u -> !u.getId().equals(id))
                    .ifPresent(u -> { throw new IllegalArgumentException("Email já cadastrado"); });
        }

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setRole(dto.getRole());
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
            repo.findByEmail(emailStr).filter(u -> !u.getId().equals(id))
                    .ifPresent(u -> { throw new IllegalArgumentException("Email já cadastrado"); });
            existing.setEmail(emailStr);
        }

        if (updates.containsKey("role") && updates.get("role") != null)
            existing.setRole(updates.get("role").toString());

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

        // Contagem por role
        Map<String, Long> roleStats = new java.util.HashMap<>();
        repo.countByRole().forEach(r -> roleStats.put((String) r[0], (Long) r[1]));
        stats.put("byRole", roleStats);

        // Contagem por ativo/inativo
        Map<String, Long> activeStats = new java.util.HashMap<>();
        repo.countByActive().forEach(a -> activeStats.put((Boolean) a[0] ? "active" : "inactive", (Long) a[1]));
        stats.put("byActive", activeStats);

        return stats;
    }
}
