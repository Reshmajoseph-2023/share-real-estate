import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty, removeBooking } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart, AiTwotoneCar } from "react-icons/ai";
import "./Property.css";
import { MdMeetingRoom, MdLocationPin } from "react-icons/md";
import { FaShower } from "react-icons/fa";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import BookingModal from "../../components/BookingModal/BookingModal";
import UserDetailContext from "../../context/UserDetailContext.js";
import { toast } from "react-toastify";
import { Button } from "@mantine/core";
import Heart from "../../components/Heart/Heart";


const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];

  const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id));
  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  //Cancel booking
  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));

      toast.success("Booking cancelled", { position: "bottom-right" });
    },
  });


  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="wrapper flexCenter" style={{ height: "60vh" }}>
          <PuffLoader />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <div className="wrapper">Failed to load property.</div>;
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        <div className="like">
        
        <Heart id={id} />
        </div>

        <img src={data.image} alt="home image" />

        <div className="flexCenter property-details">
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className="primaryText">{data.title}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>${data.price}</span>
            </div>

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

            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data.description}
            </span>

            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data.address} {data.city} {data.country}
              </span>
            </div>


            {/*booking button*/}
            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
             <Button
                  variant="outline"
                  w={"100%"}
                  color="red"
                  onClick={() => cancelBooking()}
                  disabled={cancelling}
                >
                  <span>Cancel booking</span>
                </Button>
                <span>
                  Your visit already booked for date{" "}
                  {bookings?.filter((booking) => booking?.id === id)[0].date}
                </span>
              </>
            ) : (
              <button
                className="button"
                onClick={() => {
                  if (validateLogin()) setModalOpened(true);
                }}

              >
                Book your visit
              </button>
            )}
            {/* No email prop needed */}
            <BookingModal opened={modalOpened} setOpened={setModalOpened} propertyId={id}  />
          </div>

          <div className="map">
            <Map address={data.address} city={data.city} country={data.country}  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
