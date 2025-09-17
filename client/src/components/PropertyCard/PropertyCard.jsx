import React from 'react'
import './PropertyCard.css'
import Heart from "../Heart/Heart";
import truncate from "lodash/truncate";
import { useNavigate } from 'react-router-dom';
const PropertyCard = ({ card }) => {


//to return individual property
  const navigate=useNavigate();
  return (
    <div className="flexColStart r-card" 
    onClick={()=>navigate(`../properties/${card.id}`)}>
      <Heart id={card?.id}/>
      <img src={card.image} alt="home" />
      
      <span className="secondaryText r-price">
        <span style={{ color: "orange" }}>$</span>
        <span>{card.price}</span>
      </span>
<span className="primaryText">
  {truncate(String(card?.title || ""), { length: 15 })}
</span>

<span className="secondaryText">
  {truncate(String(card?.description || ""), { length:50 })}
</span>

    </div>
  );
};

export default PropertyCard


// to return individual property
//const navigate=useNavigate();
//return (
   //   const navigate=useNavigate();
  //return (
   // <div className="flexColStart r-card" 
    //onClick={()=>navigate(`../properties/${card.id}`)}>