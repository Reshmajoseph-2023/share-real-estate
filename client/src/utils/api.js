import axios from "axios";
import { toast } from "react-toastify";



export const api = axios.create({
  baseURL: "http://localhost:8001/api",
  // withCredentials: true, // uncomment if you use cookies/JWT in cookies
});

export const getAllProperties = async () => {
  try {
    const res = await api.get("/property/allproperties");
    return res.data;
  } catch (err) {
    // Try to show server message if available; fallback to generic
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong";
    toast.error(msg);
    throw err; // rethrow so callers can handle
  }
};



export const getProperty = async (id) => {
  try {
    const response = await api.get(`/property/${id}`);

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};


export const register = async () => {
  try {
    const response = await api.post(`/auth/register}`);

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const login = async () => {
  try {
    const response = await api.post(`/auth/login}`);

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};



//to work with apis installed yarn add axios dayjs react-toastify
//, { timeout: 10_000 }

//yarn add @auth0/auth0-react@v2.0.1