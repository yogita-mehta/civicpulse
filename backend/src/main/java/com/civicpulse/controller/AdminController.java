package com.civicpulse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.civicpulse.model.Complaint;
import com.civicpulse.model.Department;
import com.civicpulse.service.AdminService;
import com.civicpulse.dto.ComplaintResponseDTO;


@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 1️⃣ Get all complaints
    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(adminService.getAllComplaints());
    }

    // 2️⃣ Assign complaint to department
   @PutMapping("/assign")
public ResponseEntity<Complaint> assignDepartment(
        @RequestParam Long complaintId,
        @RequestParam String departmentName,
        @RequestParam String officerName) {  // <-- new parameter

    Complaint updated = adminService.assignDepartment(complaintId, departmentName, officerName);
    return ResponseEntity.ok(updated);
}


    // 3️⃣ Get all departments
    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(adminService.getAllDepartments());
    }
    
}
