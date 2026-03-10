const API_BASE = "https://exam-scheduler-backend-88hb.onrender.com/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* ================= AUTH ================= */

export const loginUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* ================= STUDENTS ================= */

export const getStudents = async () => {
  const res = await fetch(`${API_BASE}/students`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const addStudent = async (data) => {
  const res = await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateStudentMarks = async (id, data) => {
  const res = await fetch(`${API_BASE}/students/${id}/marks`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteStudent = async (id) => {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
};

/* ================= HALLS ================= */

export const getHalls = async () => {
  const res = await fetch(`${API_BASE}/halls`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const addHall = async (data) => {
  const res = await fetch(`${API_BASE}/halls`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteHall = async (id) => {
  const res = await fetch(`${API_BASE}/halls/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
};

/* ================= EXAMS ================= */

export const getExams = async () => {
  const res = await fetch(`${API_BASE}/exams`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const scheduleExam = async (data) => {
  const res = await fetch(`${API_BASE}/exams`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteExam = async (id) => {
  const res = await fetch(`${API_BASE}/exams/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
};

/* ================= TOP STUDENTS ================= */

export const getTopStudents = async () => {
  const res = await fetch(`${API_BASE}/students/top`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};