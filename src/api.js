import axios from "axios";

const API_BASE = "http://localhost:5000/api/exam";

export const startExamAPI = () => axios.get(`${API_BASE}/start`);
export const submitExamAPI = (payload) => axios.put(`${API_BASE}/submit`, payload);
export const terminateExamAPI = () => axios.post(`${API_BASE}/terminate`);
