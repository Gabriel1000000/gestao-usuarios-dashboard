package com.example.users.service;

import com.example.users.dto.UserDto;
import com.example.users.exception.UserNotFoundException;
import com.example.users.model.SystemRole;
import com.example.users.model.User;
import com.example.users.repository.UserRepository;
import com.example.users.service.validacoes.create.ValidadorCriacaoUsuario;
import com.example.users.service.validacoes.update.ValidadorAtualizacaoUsuario;
import com.example.users.service.validacoes.patch.ValidadorPatchUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    // Validadores (injeção automática de todos os @Component implementando a interface)
    @Autowired
    private List<ValidadorCriacaoUsuario> validadoresCriacao;

    @Autowired
    private List<ValidadorAtualizacaoUsuario> validadoresAtualizacao;

    @Autowired
    private List<ValidadorPatchUsuario> validadoresPatch;

    // =========================
    // LISTAGEM COM FILTROS COMBINADOS
    // =========================
    // @Transactional(readOnly = true)

    private String likeLowerOrNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        if (t.isEmpty()) return null;
        return "%" + t.toLowerCase() + "%";
    }

    private String lowerOrNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t.toLowerCase();
    }

    public List<UserDto> search(String name, String email, String jobTitle, SystemRole systemRole, Boolean active) {
        String nameLike = likeLowerOrNull(name);
        String emailLike = likeLowerOrNull(email);
        String jobTitleLower = lowerOrNull(jobTitle);

        return repo.search(nameLike, emailLike, jobTitleLower, systemRole, active)
                .stream().map(this::toDto).toList();
    }



    @Transactional(readOnly = true)
    public UserDto findById(Long id) {
        var user = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        return toDto(user);
    }

    @Transactional
    public UserDto create(UserDto dto) {
        validadoresCriacao.forEach(v -> v.validar(dto));

        var user = toEntity(dto);
        user.setId(null);
        var saved = repo.save(user);

        return toDto(saved);
    }

    @Transactional
    public UserDto update(Long id, UserDto dto) {
        var existing = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));

        validadoresAtualizacao.forEach(v -> v.validar(id, dto, existing));

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setJobTitle(dto.getJobTitle());
        existing.setSystemRole(dto.getSystemRole());
        existing.setActive(dto.getActive());

        return toDto(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        var existing = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        repo.delete(existing);
    }

    @Transactional
    public UserDto patch(Long id, Map<String, Object> updates) {
        var existing = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));

        validadoresPatch.forEach(v -> v.validar(id, updates, existing));

        // aplica updates (somente campos presentes)
        applyPatch(existing, updates);

        return toDto(repo.save(existing));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        var stats = new java.util.HashMap<String, Object>();

        var jobTitleStats = new java.util.HashMap<String, Long>();
        repo.countByJobTitle().forEach(r -> jobTitleStats.put((String) r[0], (Long) r[1]));
        stats.put("byRole", jobTitleStats);       // compatibilidade
        stats.put("byJobTitle", jobTitleStats);   // correto

        var systemRoleStats = new java.util.HashMap<String, Long>();
        repo.countBySystemRole().forEach(r -> systemRoleStats.put(String.valueOf(r[0]), (Long) r[1]));
        stats.put("bySystemRole", systemRoleStats);

        var activeStats = new java.util.HashMap<String, Long>();
        repo.countByActive().forEach(a -> activeStats.put((Boolean) a[0] ? "active" : "inactive", (Long) a[1]));
        stats.put("byActive", activeStats);

        return stats;
    }

    // =========================
    // helpers (privados)
    // =========================

    // private String likeOrNull(String s) {
    //     if (s == null) return null;
    //     String t = s.trim();
    //     return t.isEmpty() ? null : "%" + t + "%";
    // }


    // private String norm(String s) {
    //     if (s == null) return null;
    //     var t = s.trim();
    //     return t.isEmpty() ? null : t;
    // }

    private UserDto toDto(User u) {
        return new UserDto(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getJobTitle(),
                u.getSystemRole(),
                u.getActive()
        );
    }

    private User toEntity(UserDto d) {
        var u = new User();
        u.setId(d.getId());
        u.setName(d.getName());
        u.setEmail(d.getEmail());
        u.setJobTitle(d.getJobTitle());
        u.setSystemRole(d.getSystemRole());
        u.setActive(d.getActive() == null ? true : d.getActive());
        return u;
    }

    private void applyPatch(User existing, Map<String, Object> updates) {
        if (updates.containsKey("name") && updates.get("name") != null)
            existing.setName(updates.get("name").toString());

        if (updates.containsKey("email") && updates.get("email") != null)
            existing.setEmail(updates.get("email").toString());

        if (updates.containsKey("jobTitle") && updates.get("jobTitle") != null)
            existing.setJobTitle(updates.get("jobTitle").toString());

        // compatibilidade: role -> jobTitle
        if (updates.containsKey("role") && updates.get("role") != null)
            existing.setJobTitle(updates.get("role").toString());

        if (updates.containsKey("systemRole") && updates.get("systemRole") != null) {
            var s = updates.get("systemRole").toString().trim().toUpperCase();
            existing.setSystemRole(SystemRole.valueOf(s));
        }

        if (updates.containsKey("active") && updates.get("active") != null) {
            var val = updates.get("active");
            if (val instanceof Boolean b) existing.setActive(b);
            else existing.setActive(Boolean.parseBoolean(val.toString()));
        }
    }
}
