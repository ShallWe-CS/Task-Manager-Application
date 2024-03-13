import axios from "axios";

const BASE_URL = process.env.REACT_APP_DEV_URL;

const authInterceptor = (req) => {
    const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
};
  
const adminAuthInterceptor = (req) => {
    const accessToken = JSON.parse(localStorage.getItem("admin"))?.accessToken;
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
};

export const API = axios.create({
    baseURL: BASE_URL,
});  

export const handleApiError = async (error) => {
    try {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      const data = null;
      return { error: errorMessage, data };
    } catch (err) {
      throw new Error("An unexpected error occurred.");
    }
};