import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";


const API = import.meta.env.VITE_API_URL || "http://localhost:8001";
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
    toast.error("Something went wrong, try again");
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



export const bookVisit = async (date, propertyId, token) => {
  const iso = date instanceof Date ? date.toISOString() : date;
  // TEMP LOG (remove later)
  console.log("bookVisit() propertyId:", propertyId, "date:", iso, "token:", token?.slice?.(0, 12) + "...");
  return axios.post(
    `${API}/api/user/bookVisit/${propertyId}`,
    { date: iso },
    {
      headers: {
        Authorization: `Bearer ${token}`, // <-- MUST be here
        "Content-Type": "application/json",
      },
    }
  );
};
// api.js
export const getAllBookings = async (email, token) => {
  if (!token || !email) return [];
  const res = await api.get(
    "/api/user/allBookings",
    { email },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data?.alreadyRequested ?? [];

};

// utils/api.ts
export async function removeBooking(id, token) {
  try {
    const { data } = await api.post(
      `/user/removeBooking/${id}`,
      {}, // no body needed
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data; // e.g. { message: "Booking cancelled successfully" }
  } catch (err) {
    const msg =
      err?.response?.data?.message || "Something went wrong, please try again";
    toast.error(msg, { position: "bottom-right" });
    throw err;
  }
}














//to work with apis installed yarn add axios dayjs react-toastify
//, { timeout: 10_000 }

//yarn add @auth0/auth0-react@v2.0.1
//yarn add dayjs to get date in particluar format