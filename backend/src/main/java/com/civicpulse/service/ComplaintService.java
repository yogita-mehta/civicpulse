package com.civicpulse.service;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.civicpulse.model.Complaint;
import com.civicpulse.model.User;
import com.civicpulse.repository.ComplaintRepository;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    // ---------------- CITIZEN ----------------

    public Complaint submitComplaint(Complaint complaint, User citizen, MultipartFile[] images) {
        complaint.setCitizen(citizen);
        complaint.setStatus("SUBMITTED");
        // Example path to your OneDrive folder
String uploadDir = "C:/yogita-backend/uploads"; // <- old + new images


    // Make sure folder exists
    File folder = new File(uploadDir);
    if (!folder.exists()) {
        folder.mkdirs();
    }

    // Save each file and build paths
    if (images != null && images.length > 0) {
        StringBuilder paths = new StringBuilder();
        for (MultipartFile file : images) {
            try {
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                File dest = new File(folder, filename);
                file.transferTo(dest); // save file

                if (paths.length() > 0) paths.append(",");
                paths.append(dest.getName()); // save only filename
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        complaint.setImagePath(paths.toString());
    }
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsByCitizen(User citizen) {
        return complaintRepository.findByCitizen(citizen);
    }

    // ---------------- ADMIN ----------------

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint assignDepartment(Long complaintId, String department) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setAssignedDepartment(department);
        complaint.setStatus("ASSIGNED");

        return complaintRepository.save(complaint);
    }

    // ---------------- DEPARTMENT ----------------

    public List<Complaint> getDepartmentComplaints(String department) {
        return complaintRepository.findByAssignedDepartment(department);
    }

    
    public Complaint getComplaintById(Long id) {
    return complaintRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Complaint not found"));
}
public void resolve(Long complaintId) {
    Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new RuntimeException("Complaint not found"));
    complaint.setStatus("COMPLETED");
    complaintRepository.save(complaint);
}

public void submitFeedback(
        Long complaintId,
        User citizen,
        String feedback,
        Integer rating
) {
    Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new RuntimeException("Complaint not found"));

    if (!complaint.getCitizen().getId().equals(citizen.getId())) {
        throw new RuntimeException("Access denied");
    }

    if (!"RESOLVED".equals(complaint.getStatus())) {
        throw new RuntimeException("Complaint not resolved yet");
    }

    complaint.setFeedback(feedback);
    complaint.setRating(rating);

    complaintRepository.save(complaint);
}


}
