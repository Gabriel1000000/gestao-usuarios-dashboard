package com.example.users.dto;

import com.example.users.model.SystemRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 200, message = "Email must be at most 200 characters")
    private String email;

    @NotBlank(message = "Job title is required")
    @Size(max = 80, message = "Job title must be at most 80 characters")
    private String jobTitle;

    @NotNull(message = "System role is required")
    private SystemRole systemRole;

    private Boolean active;
}
