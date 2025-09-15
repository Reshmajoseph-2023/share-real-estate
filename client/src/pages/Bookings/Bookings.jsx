import React, { useContext, useEffect, useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";
import { getAllBookings, api } from "../../utils/api";

const pickPropertyId = (b) =>
  b?.propertyId ?? b?.propertyID ?? b?.property_id ?? b?.property?.id ?? b?.property?._id ?? b?.id ?? b?._id ?? null;

export default function Bookings() {
  const { data, isError, isLoading } = useProperties();
  const properties = data ?? [];

  const [filter, setFilter] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [extraProps, setExtraProps] = useState([]);
  const [loadingExtras, setLoadingExtras] = useState(false);

  const ctx = useContext(UserDetailContext) || {};
  const userDetails = ctx.userDetails || { bookings: [], token: null, email: null };
  const setUserDetails = ctx.setUserDetails;
  const bookings = userDetails.bookings ?? [];

  const getEmail = () => {
    if (userDetails?.email) return userDetails.email;
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) return storedEmail;
    try {
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {};
      return user?.email || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    console.log("Initial userDetails:", userDetails);
    console.log("localStorage token:", localStorage.getItem("token"));
    console.log("localStorage email:", localStorage.getItem("email"));
    console.log("localStorage user:", localStorage.getItem("user"));
    console.log("localStorage bookings:", localStorage.getItem("bookings"));
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingBookings(true);
        const token = userDetails?.token || localStorage.getItem("token");
        const email = getEmail();

        console.log("Attempting fetch with token:", token);
        console.log("Attempting fetch with email:", email);

        if (!token || !email) {
          console.warn("Missing token or email, skipping bookings fetch");
          if (alive) setLoadingBookings(false);
          return;
        }

        const list = await getAllBookings(email, token).catch((err) => {
          console.error("API Error:", err);
          return [];
        });
        console.log("Fetched bookings:", list);
        if (!alive) return;

        setUserDetails?.((prev) => ({
          ...(prev || {}),
          bookings: Array.isArray(list) ? list : [],
          token,
          email,
        }));
        localStorage.setItem("bookings", JSON.stringify(Array.isArray(list) ? list : []));
      } catch (err) {
        console.error("getAllBookings failed:", err?.response?.data || err.message);
        if (alive && !userDetails.bookings?.length && localStorage.getItem("bookings")) {
          const storedBookings = JSON.parse(localStorage.getItem("bookings"));
          setUserDetails?.((prev) => ({
            ...(prev || {}),
            bookings: Array.isArray(storedBookings) ? storedBookings : [],
          }));
        }
      } finally {
        if (alive) setLoadingBookings(false);
      }
    })();
    return () => { alive = false; };
  }, [userDetails?.token, userDetails?.email, setUserDetails]);

  const bookedIds = useMemo(() => {
    const ids = new Set((bookings ?? []).map(pickPropertyId).filter(Boolean).map(String));
    console.log("bookedIds:", [...ids]);
    return ids;
  }, [bookings]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const baseIds = new Set(properties.map((p) => String(p?.id ?? p?._id)).filter(Boolean));
        const missing = [...bookedIds].filter((id) => !baseIds.has(id));
        console.log("Missing property IDs:", missing);
        if (missing.length === 0) {
          if (alive) setExtraProps([]);
          return;
        }
        setLoadingExtras(true);

        const token = userDetails?.token || localStorage.getItem("token");
        const fetched = await Promise.all(
          missing.map(async (id) => {
            try {
              const res = await api.get(`/api/property/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              });
              return res.data;
            } catch {
              return null;
            }
          })
        );

        console.log("Fetched extra properties:", fetched);
        if (alive) setExtraProps(fetched.filter(Boolean));
      } finally {
        if (alive) setLoadingExtras(false);
      }
    })();
  }, [properties, bookedIds, userDetails?.token]);

  const allProps = useMemo(() => [...properties, ...extraProps], [properties, extraProps]);

  const visible = useMemo(() => {
    const q = (filter || "").toLowerCase();
    const result = allProps
      .filter((p) => bookedIds.has(String(p?.id ?? p?._id)))
      .filter((p) =>
        !q
          ? true
          : [p?.title, p?.city, p?.country].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      );
    console.log("Visible properties:", result);
    return result;
  }, [allProps, bookedIds, filter]);

  if (isError) return <div className="wrapper"><span>Error while fetching data</span></div>;
  if (isLoading || loadingBookings || loadingExtras) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader height="80" width="80" radius={1} color="#4066ff" aria-label="puff-loading" />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />
        <div className="paddings flexCenter properties">
          {visible.length === 0
            ? <div>No bookings found.</div>
            : visible.map((card) => <PropertyCard key={card?.id ?? card?._id} card={card} />)}
        </div>
      </div>
    </div>
  );
}