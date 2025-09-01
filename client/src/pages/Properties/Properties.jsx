import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
//import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
const Properties = () => {
  const { data, isError, isLoading } = useProperties();

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
        <PuffLoader 
        height="80"
        width="80"
        radius={1}
        color="#4066ff"
        aria-label="puff-loading" />
      </div>
    )
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar />
        <div className="paddings flexCenter properties">
          {
            data?.map((card) => (
              <PropertyCard card={card} key={card.id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;



//yarn add react-spinners --isLoading dependecny
//yarn add loadash --sorting algorith here
