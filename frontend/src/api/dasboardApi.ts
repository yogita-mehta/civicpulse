import api from "./axios";

/* Dashboard */
export const getDashboard = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

/* Submit Complaint */
export const submitComplaint = async (data: FormData) => {
  const token = localStorage.getItem("token"); // get JWT from localStorage

  const res = await api.post("/citizen/complaints", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // <-- send token
    },
  });

  return res.data;
};

/* Get citizen complaints */
export const getMyComplaints = async () => {
  const token = localStorage.getItem("token"); // JWT
  const res = await api.get("/citizen/complaints/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return res.data;
};

export const getComplaintById = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await api.get(`/citizen/complaints/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getAllComplaints = async (token: string) => {
  const response = await api.get("/admin/complaints", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const assignComplaint = async (
  complaintId: number,
  departmentName: string,
  officerName: string    // <-- new
) => {
  const token = localStorage.getItem("token");

  const response = await api.put(
    "/admin/assign",
    null,
    {
      params: {
        complaintId: complaintId,
        departmentName: departmentName,
        officerName: officerName,  // <-- send officer
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const getDepartmentComplaints = async (token: string) => {
  const response = await api.get("/department/complaints", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const resolveComplaint = async (complaintId: number, note?: string) => {
  const token = localStorage.getItem("token");
  const res = await api.put(
    "/department/resolve",
    null,
    {
      params: { complaintId, note },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
export const submitFeedback = async (
  complaintId: number,
  feedback: string,
  rating: number
) => {
  const token = localStorage.getItem("token");

  const res = await api.post(
    `/citizen/complaints/${complaintId}/feedback`,
    null,
    {
      params: { feedback, rating },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
