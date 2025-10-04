package com.example.users.service;

import org.springframework.stereotype.Service;

import com.example.users.dto.UserDto;
import com.example.users.model.User;
import com.example.users.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getActive());
    }

    public List<UserDto> findAll() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    public Optional<UserDto> findById(Long id) {
        return repo.findById(id).map(this::toDto);
    }

    public UserDto create(UserDto dto) {
        repo.findByEmail(dto.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email já cadastrado");
        });

        User u = new User();
        u.setName(dto.getName());
        u.setEmail(dto.getEmail());
        u.setRole(dto.getRole());
        u.setActive(dto.getActive() != null ? dto.getActive() : true);

        return toDto(repo.save(u));
    }

    public Optional<UserDto> update(Long id, UserDto dto) {
        return repo.findById(id).map(existing -> {
            if (!existing.getEmail().equals(dto.getEmail())) {
                repo.findByEmail(dto.getEmail()).ifPresent(u -> {
                    throw new IllegalArgumentException("Email já cadastrado");
                });
            }

            existing.setName(dto.getName());
            existing.setEmail(dto.getEmail());
            existing.setRole(dto.getRole());
            existing.setActive(dto.getActive());
            return toDto(repo.save(existing));
        });
    }

    public boolean delete(Long id) {
        return repo.findById(id).map(u -> {
            repo.delete(u);
            return true;
        }).orElse(false);
    }

    // PATCH parcial
    public Optional<UserDto> patch(Long id, Map<String, Object> updates) {
        return repo.findById(id).map(existing -> {

            if (updates.containsKey("name") && updates.get("name") != null)
                existing.setName(updates.get("name").toString());

            if (updates.containsKey("email") && updates.get("email") != null) {
                String emailStr = updates.get("email").toString();
                repo.findByEmail(emailStr)
                    .filter(u -> !u.getId().equals(id))
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
        });
    }
}
