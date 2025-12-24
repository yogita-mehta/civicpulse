package com.civicpulse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.civicpulse.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Used for login & email uniqueness check
    Optional<User> findByEmail(String email);
}
