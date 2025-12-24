package com.civicpulse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.civicpulse.model.LoginRequest;
import com.civicpulse.model.LoginResponse;
import com.civicpulse.model.User;
import com.civicpulse.security.JwtUtil;
import com.civicpulse.service.UserService;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/auth")  // <-- changed from /api/auth to /auth
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostConstruct
public void generateHashOnce() {
    System.out.println("BCrypt hash for 123456 = "  + passwordEncoder.encode("123456"));
}


    // ✅ Register API
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
        User user = userService.findByEmail(loginRequest.getEmail());
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // ✅ Check role
        if (!user.getRole().equalsIgnoreCase(loginRequest.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Role mismatch");
        }

        // ✅ Use the new method to include id, full_name, and role in JWT
        String token = jwtUtil.generateTokenWithClaims(user);

        return ResponseEntity.ok(new LoginResponse(token));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
    }
}


} 
