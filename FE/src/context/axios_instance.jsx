import axios from "axios";

const instance = axios.create({
  withCredentials: true, // Cho phép gửi cookie phiên
  baseURL: import.meta.env.VITE_BE_URI
});

export default instance;