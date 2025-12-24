package com.civicpulse.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.civicpulse.model.Complaint;
import com.civicpulse.model.Department;
import com.civicpulse.repository.ComplaintRepository;
import com.civicpulse.repository.DepartmentRepository;

@Service
public class AdminService {

    @Autowired
    private ComplaintRepository complaintRepo;

    @Autowired
    private DepartmentRepository departmentRepo;

    // 1️⃣ Get all complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepo.findAll();
    }

    // 2️⃣ Assign complaint to department
    public Complaint assignDepartment(Long complaintId, String departmentName, String officerName) {
    Complaint complaint = complaintRepo.findById(complaintId)
            .orElseThrow(() -> new RuntimeException("Complaint not found"));

    complaint.setAssignedDepartment(departmentName);
    complaint.setAssignedOfficer(officerName);
    complaint.setStatus("ASSIGNED");

    return complaintRepo.save(complaint);
}


public List<Complaint> getComplaintsForDepartment(String departmentName) {
    return complaintRepo.findByAssignedDepartment(departmentName);
}


    // 3️⃣ Get all departments
    public List<Department> getAllDepartments() {
        return departmentRepo.findAll();
    }
     public void resolveComplaint(Long complaintId, String note) {
        Complaint complaint = complaintRepo.findById(complaintId)
            .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus("RESOLVED");
        if (note != null && !note.isEmpty()) {
            complaint.setResolutionNote(note); // Make sure you added this field in Complaint entity
        }
        complaintRepo.save(complaint);
    }
}
