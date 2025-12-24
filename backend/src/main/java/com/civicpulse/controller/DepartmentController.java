package com.civicpulse.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.civicpulse.model.Complaint;
import com.civicpulse.service.AdminService;

@RestController
@RequestMapping("/department")
@PreAuthorize("hasRole('DEPARTMENT')")
public class DepartmentController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/complaints")
public ResponseEntity<List<Complaint>> getAssignedComplaints() {
    String departmentName = "Water Works Department"; // hardcode for demo
    List<Complaint> complaints = adminService.getComplaintsForDepartment(departmentName);
    return ResponseEntity.ok(complaints);
}

    @PutMapping("/resolve")
public ResponseEntity<Void> resolveComplaint(
        @RequestParam Long complaintId,
        @RequestParam(required = false) String note) {

    adminService.resolveComplaint(complaintId, note); // implement this in service
    return ResponseEntity.ok().build();
}

}
