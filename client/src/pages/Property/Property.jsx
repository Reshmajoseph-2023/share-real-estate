import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart } from "react-icons/ai";
import "./Property.css";
import { AiTwotoneCar } from "react-icons/ai";
import { MdMeetingRoom,MdLocationPin } from "react-icons/md";
import { FaShower } from "react-icons/fa";
import Map from "../../components/Map/Map";

const Property = () => {
  const { pathname } = useLocation(); //complete pathname of our url
  const id = pathname.split("/").slice(-1)[0];

  const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id));  // when change from this const { data, isLoading, isError } = useQuery(["resd"]);  make changes in api.js page also
  console.log(data);
  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="wrapper flexCenter" style={{ height: "60vh" }}>
          <PuffLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        {/* Like button */}
        <div className="like">
          <AiFillHeart size={24} color="white" />
        </div>
        <img src={data?.image} alt="home image" />

        <div className="flexCenter property-details">
          <div className="flexColStart left">

            <div className="flexStart head">
              <span className="primaryText">{data?.title}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}> ${data?.price}</span>
            </div>



            {/* Facilities */}

            <div className="flexStart facilities">
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} Bathrooms</span>
              </div>

              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.parking} Parking</span>
              </div>


              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities?.bedrooms} Room/s</span>
              </div>
            </div>

            {/*description*/}
            <span className="secondaryText" style={{ textAlign: "justify" }}> {data?.description}</span>

            {/*address*/}
            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address} {data?.city} {data?.country}
              </span>
            </div>


            {/* Booking button */}
            <button className="button">Book your visit</button>

          </div>

            {/* Map on right*/}

            <div className="map">
              <Map address={data?.address} city={data?.city} country={data?.country} />
            </div>
       </div>




      </div>
    </div>
  );
};


export default Property;
