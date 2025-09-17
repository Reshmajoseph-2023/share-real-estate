import React from 'react'
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {Outlet} from "react-router-dom";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {
      useFavourites()
  useBookings()
    return (
        <>

            <div style={{background: "var(--black)",overflow: "hidden"}}>

                <Header />
                <Outlet/>
            </div>
            <Footer />
        </>

    );
};

export default Layout;

//outlet loads children route