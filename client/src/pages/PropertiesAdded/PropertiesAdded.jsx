import React, { useContext, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import SearchBar from "../../components/SearchBar/SearchBar";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";
import { AllMyProperties } from "../../utils/api";

/* id helper for stable keys */
const pickPropId = (p) =>
  String(p?.id ?? p?._id ?? p?.propertyId ?? p?.property?.id ?? p?.property?._id ?? "");

/* owner label helper (uses owner relation if included; otherwise falls back to ownerId) */
const ownerLabel = (p) =>
  p?.owner?.username ||
  p?.owner?.email ||
  p?.ownerId ||
  "unknown";

export default function PropertiesAdded() {
  const { userDetails } = useContext(UserDetailContext) || { userDetails: {} };
  const token = userDetails?.token || localStorage.getItem("token") || null;
  const email = userDetails?.email;

  const [filter, setFilter] = useState("");

  // Fetch ONLY my properties from server (scoped by email and JWT on backend)
  const { data, isLoading, isError, error } = useQuery(
    ["myProperties", email, token], // Include email in query key
    () => AllMyProperties(email, token), // Pass both email and token
    { enabled: !!token && !!email } // Only fetch if both token and email are available
  );

  const properties = Array.isArray(data) ? data : [];

  // Local search across my properties
  const visible = useMemo(() => {
    const q = (filter || "").toLowerCase().trim();
    if (!q) return properties;
    return properties.filter((p) =>
      [p?.title, p?.city, p?.country, pickPropId(p)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [properties, filter]);

  /* --------- LOGS --------- */
  useEffect(() => {
    console.log(`[PropertiesAdded] fetched ${properties.length} item(s).`, properties);
  }, [properties]);

  useEffect(() => {
    console.groupCollapsed(`[PropertiesAdded] Visible list (${visible.length})`);
    visible.forEach((p, i) => {
      console.log(
        `${i + 1}. id=${pickPropId(p)} | title="${p?.title ?? ""}" | added by: ${ownerLabel(p)}`
      );
    });
    console.groupEnd();
  }, [visible]);
  /* ------------------------ */

  if (!token) {
    return (
      <div className="wrapper">
        <div className="flexColCenter paddings innerWidth properties-container">
          <SearchBar filter={filter} setFilter={setFilter} />
          <div className="paddings flexCenter properties" style={{ textAlign: "center" }}>
            <div><strong>Please log in</strong> to see properties you’ve added.</div>
          
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader height="80" width="80" radius={1} color="#4066ff" aria-label="puff-loading" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error loading your properties{error?.message ? `: ${error.message}` : ""}</span>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />
        <div className="paddings flexCenter properties">
          {visible.length === 0 ? (
            <div>You haven’t added any properties yet.</div>
          ) : (
            visible.map((card) => <PropertyCard key={pickPropId(card)} card={card} />)
          )}
        </div>
      </div>
    </div>
  );
}