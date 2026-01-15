package com.example.users.repository;

import com.example.users.model.SystemRole;
import com.example.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmailIgnoreCase(String email);

    @Query("""
    SELECT u
    FROM User u
    WHERE (:nameLike IS NULL OR LOWER(u.name) LIKE :nameLike)
      AND (:emailLike IS NULL OR LOWER(u.email) LIKE :emailLike)
      AND (:jobTitleLower IS NULL OR LOWER(u.jobTitle) = :jobTitleLower)
      AND (:systemRole IS NULL OR u.systemRole = :systemRole)
      AND (:active IS NULL OR u.active = :active)
    """)
    List<User> search(
            @Param("nameLike") String nameLike,
            @Param("emailLike") String emailLike,
            @Param("jobTitleLower") String jobTitleLower,
            @Param("systemRole") SystemRole systemRole,
            @Param("active") Boolean active
    );

    // Stats
    @Query("SELECT u.jobTitle, COUNT(u) FROM User u GROUP BY u.jobTitle")
    List<Object[]> countByJobTitle();

    @Query("SELECT u.systemRole, COUNT(u) FROM User u GROUP BY u.systemRole")
    List<Object[]> countBySystemRole();

    @Query("SELECT u.active, COUNT(u) FROM User u GROUP BY u.active")
    List<Object[]> countByActive();
}
