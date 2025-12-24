package com.civicpulse.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "complaints")
public class Complaint {
    public Long getId() {
    return complaintId;
}


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "complaint_id")
    private Long complaintId;

    // Citizen (user)
    @ManyToOne
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "location")
    private String location;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "address")
    private String address;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "priority")
    private String priority; // LOW / MEDIUM / HIGH

    @Column(name = "assigned_department")
    private String assignedDepartment;

    @Column(name = "created_at", nullable = false, updatable = false)
private LocalDateTime createdAt;

@Column(name = "updated_at")
private LocalDateTime updatedAt;
private String resolutionNote;


    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "assigned_officer")
private String assignedOfficer;
@Column(name = "feedback")
private String feedback;

@Column(name = "rating")
private Integer rating; // 1–5 stars


    // ===== GETTERS & SETTERS =====
    

public List<String> getImages() {
    if (this.imagePath == null || this.imagePath.isEmpty()) return List.of();
    return Arrays.asList(this.imagePath.split(","));
}

public String getResolutionNote() { return resolutionNote; }
public void setResolutionNote(String resolutionNote) { this.resolutionNote = resolutionNote; }
    public Long getComplaintId() {
        return complaintId;
    }

    public User getCitizen() {
        return citizen;
    }

    public void setCitizen(User citizen) {
        this.citizen = citizen;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssignedDepartment() {
        return assignedDepartment;
    }

    public void setAssignedDepartment(String assignedDepartment) {
        this.assignedDepartment = assignedDepartment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
    this.resolvedAt = resolvedAt;
}
@PrePersist
protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
}

@PreUpdate
protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
}
// getter
public String getAssignedOfficer() {
    return assignedOfficer;
}

// setter
public void setAssignedOfficer(String assignedOfficer) {
    this.assignedOfficer = assignedOfficer;
}
public String getFeedback() {
    return feedback;
}

public void setFeedback(String feedback) {
    this.feedback = feedback;
}

public Integer getRating() {
    return rating;
}

public void setRating(Integer rating) {
    this.rating = rating;
}


}
