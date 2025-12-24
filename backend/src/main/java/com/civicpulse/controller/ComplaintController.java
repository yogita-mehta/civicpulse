package com.civicpulse.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.civicpulse.model.Complaint;
import com.civicpulse.model.User;
import com.civicpulse.service.ComplaintService;
import com.civicpulse.service.UserService;

@RestController
@RequestMapping("/citizen/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserService userService;

    // ---------------- CITIZEN ----------------
    @PostMapping("/{id}/feedback")
public ResponseEntity<?> submitFeedback(
        @PathVariable Long id,
        @RequestParam String feedback,
        @RequestParam Integer rating
) {
    String email = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();

    User citizen = userService.findByEmail(email);

    complaintService.submitFeedback(id, citizen, feedback, rating);

    return ResponseEntity.ok("Feedback submitted successfully");
}



   @PostMapping(consumes = "multipart/form-data")
public ResponseEntity<?> submitComplaint(
        @RequestParam String title,
        @RequestParam String category,
        @RequestParam String description,
        @RequestParam String location,
        @RequestParam String priority,
        @RequestParam(value = "images", required = false) MultipartFile[] images  
) {
    System.out.println(">>> SUBMIT COMPLAINT CONTROLLER HIT");

    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User citizen = userService.findByEmail(email);

    Complaint complaint = new Complaint();
    complaint.setTitle(title);
    complaint.setCategory(category);
    complaint.setDescription(description);
    complaint.setLocation(location);
    complaint.setPriority(priority);
    

    Complaint saved = complaintService.submitComplaint(complaint, citizen,images);
    return ResponseEntity.ok(
    Map.of(
        "id", saved.getId(),
        "trackingId", saved.getId()
    )
);


}


    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> myComplaints() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User citizen = userService.findByEmail(email);

        return ResponseEntity.ok(
                complaintService.getComplaintsByCitizen(citizen)
        );
    }
@GetMapping("/{id}")
public ResponseEntity<?> getComplaintById(@PathVariable Long id) {

    String email = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();

    User citizen = userService.findByEmail(email);

    Complaint complaint = complaintService.getComplaintById(id);

    // 🔐 Security check: citizen can see only their complaint
    if (!complaint.getCitizen().getId().equals(citizen.getId())) {
        return ResponseEntity.status(403).body("Access denied");
    }

    return ResponseEntity.ok(complaint);
}


    // ---------------- ADMIN ----------------

    @GetMapping("/all")
    public ResponseEntity<List<Complaint>> allComplaints() {
        return ResponseEntity.ok(
                complaintService.getAllComplaints()
        );
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignDepartment(
            @PathVariable Long id,
            @RequestParam String department
    ) {
        return ResponseEntity.ok(
                complaintService.assignDepartment(id, department)
        );
    }

}
