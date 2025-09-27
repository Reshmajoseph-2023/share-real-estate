import React, { useContext, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getProperty, removeBooking, deletePropertyById, updatePropertyById } from "../../utils/api";
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

const parseNZD = (input) => {
  const cleaned = String(input ?? "").replace(/[^0-9.-]/g, "");
  if (!cleaned || isNaN(Number(cleaned))) return null;
  return Math.round(Number(cleaned));
};

const Property = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const id = pathname.split("/").slice(-1)[0];

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id));
  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  useEffect(() => {
    // Ensure price input is current if you later switch to inline editing
  }, [data?.price]);

  // ---- Update (Edit) mutation
  const { mutate: saveProperty, isLoading: saving } = useMutation({
    mutationFn: (payload) => updatePropertyById(id, payload, token),
    onSuccess: (res) => {
      toast.success(res?.message || "Property updated");
      queryClient.invalidateQueries("properties");
      queryClient.invalidateQueries("myProperties");
      queryClient.invalidateQueries(["resd", id]);
    },
    onError: (err) => {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message;
      if (status === 401) toast.error(msg || "Please sign in.");
      else if (status === 403) toast.error(msg || "You are not allowed to update this listing.");
      else if (status === 409) toast.error(msg || "Address already exists on another listing.");
      else toast.error(msg || "Update failed.");
    },
    retry: false,
  });

  // ---- Cancel booking
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

  // ---- Delete property
  const { mutate: deleteProperty, isLoading: deleting } = useMutation({
    mutationFn: () => deletePropertyById(id, token),
    onSuccess: () => {
      toast.success("Property deleted");
      queryClient.invalidateQueries("properties");
      queryClient.invalidateQueries("myProperties");
      queryClient.invalidateQueries(["resd", id]);
      navigate("/properties");
    },
    onError: (error) => {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || error?.response?.data?.error;
      if (status === 401) {
        toast.error(msg || "Please sign in to delete this property.");
      } else if (status === 403) {
        toast.error( "Sorry, You are not allowed to delete this property.");
      } else if (status === 404) {
        toast.error(msg || "Property not found.");
      } else {
        toast.error(msg || "Couldn't delete property. Please try again.");
      }
    },
    retry: false,
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

  const isBooked = (bookings ?? []).map((b) => b?.id).includes(id);
  const bookedDate = (bookings ?? []).find((b) => b?.id === id)?.date;

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
            </div>

            <span style={{ fontSize: "1rem" }}>
              Capital value (CV): ${Number(data.price ?? 0).toLocaleString("en-NZ")}
            </span>

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

            {/* booking button */}
            {isBooked ? (
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
                <span>Your visit already booked for date {bookedDate}</span>
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

            <BookingModal opened={modalOpened} setOpened={setModalOpened} propertyId={id} />
          </div>

          <div className="map">
            {/* Delete property (admins/owners should see this; server still enforces auth) */}
            <Button
              variant="outline"
              w={"50%"}
              color="red"
              onClick={() => {
                if (!token) return toast.error("Please log in");
                if (window.confirm("Delete this property? This cannot be undone.")) deleteProperty();
              }}
              disabled={deleting}
            >
              <span>{deleting ? "Deleting..." : "Delete property"}</span>
            </Button>

            {/* Edit CV -> prompt for new price and call update API */}
            <Button
              variant="outline"
              w={"50%"}
              onClick={() => {
                if (!token) return toast.error("Please log in");
                const value = window.prompt(
                  "Enter new Capital value (CV) in NZD (e.g. 650000):",
                  String(data?.price ?? "")
                );
                if (value == null) return; // user cancelled
                const parsed = parseNZD(value);
                if (parsed == null || parsed < 0) {
                  return toast.error("Please enter a valid non-negative number.");
                }
                saveProperty({ price: parsed });
              }}
              disabled={saving}
            >
              <span>{saving ? "Saving..." : "Edit CV"}</span>
            </Button>

            <Map address={data.address} city={data.city} country={data.country} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
