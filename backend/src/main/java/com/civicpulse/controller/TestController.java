package com.civicpulse.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    // Public endpoint (no JWT needed)
    @GetMapping("/public")
    public String publicEndpoint() {
        return "Public endpoint, anyone can access";
    }

    // Protected endpoint (any authenticated user)
    @GetMapping("/protected")
    @PreAuthorize("isAuthenticated()")
    public String protectedEndpoint() {
        return "Protected endpoint, you are authenticated";
    }

    // Citizen-only endpoint
    @GetMapping("/citizen")
    @PreAuthorize("hasAuthority('CITIZEN')")
    public String citizenEndpoint() {
        return "Citizen only endpoint";
    }

    // Department-only endpoint
    @GetMapping("/department")
    @PreAuthorize("hasAuthority('DEPARTMENT')")
    public String departmentEndpoint() {
        return "Department only endpoint";
    }

    // Admin-only endpoint
    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String adminEndpoint() {
        return "Admin only endpoint";
    }
}
