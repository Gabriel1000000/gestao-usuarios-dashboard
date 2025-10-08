package com.example.users.repository;

import com.example.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {


    List<User> findByRole(String role);

    boolean existsByEmailIgnoreCase(String email);

    List<User> findByNameContainingIgnoreCase(String name);
    List<User> findByEmail(String email);
    List<User> findByActive(Boolean active);


    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> countByRole();

    @Query("SELECT u.active, COUNT(u) FROM User u GROUP BY u.active")
    List<Object[]> countByActive();
}
