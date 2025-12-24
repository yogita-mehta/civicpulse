 package com.civicpulse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.civicpulse.model.User;
import com.civicpulse.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ✅ Register User with encrypted password
    public User registerUser(User user) throws Exception {

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default role safety (in case frontend sends null)
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CITIZEN");
        }

        return userRepository.save(user);
    }

    // ✅ Find user by email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}