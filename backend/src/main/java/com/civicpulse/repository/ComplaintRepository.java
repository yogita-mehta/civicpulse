package com.civicpulse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.civicpulse.model.Complaint;
import com.civicpulse.model.User;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Citizen: view own complaints
    List<Complaint> findByCitizen(User citizen);

    // Admin: view all complaints (already covered by findAll)

    // Department: view assigned complaints
    List<Complaint> findByAssignedDepartment(String assignedDepartment);

    // Filter by status
    List<Complaint> findByStatus(String status);
    List<Complaint> findByAssignedOfficer(String assignedOfficer);

    
}
