import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import React, { useState, useContext, useMemo } from "react";
import UserDetailContext from "../../context/UserDetailContext.js";
import Footer from "../../components/Footer/Footer";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");


  const ctx = useContext(UserDetailContext) || {};
  const user =
    ctx.userDetails || ctx.user || ctx; 

const displayName = useMemo(() => {
  return (typeof user?.username === "string" && user.username.trim())
    ? user.username
    : "Guest";
}, [user?.username]);

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
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

  return (
    <div className="wrapper">
       Welcome: {displayName}
      <div className="flexColCenter paddings innerWidth properties-container">
      
        <div className="self-start mb-3 text-lg font-semibold">
         
        </div>

        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {data
            .filter(
              (property) =>
                property.title.toLowerCase().includes(filter.toLowerCase()) ||
                property.city.toLowerCase().includes(filter.toLowerCase()) ||
                property.country.toLowerCase().includes(filter.toLowerCase())
            )
            .map((card, i) => (
              <PropertyCard card={card} key={i} />
            ))}
        </div>
      </div>
          <Footer />
    </div>
  
  );
};

export default Properties;
