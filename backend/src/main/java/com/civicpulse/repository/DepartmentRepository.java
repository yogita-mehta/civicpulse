package com.civicpulse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.civicpulse.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
