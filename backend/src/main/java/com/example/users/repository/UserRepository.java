package com.example.users.repository;

import com.example.users.model.User;
import com.example.users.model.SystemRole;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {
    
    boolean existsByEmailIgnoreCase(String email);
    
    List<User> findByJobTitle(String jobTitle);
    List<User> findByNameContainingIgnoreCase(String name);
    List<User> findByEmail(String email);
    List<User> findByActive(Boolean active);
    List<User> findBySystemRole(SystemRole systemRole);

    @Query("SELECT u.systemRole, COUNT(u) FROM User u GROUP BY u.systemRole")
    List<Object[]> countBySystemRole();

    @Query("SELECT u.jobTitle, COUNT(u) FROM User u GROUP BY u.jobTitle")
    List<Object[]> countByJobTitle();

    @Query("SELECT u.active, COUNT(u) FROM User u GROUP BY u.active")
    List<Object[]> countByActive();
}
