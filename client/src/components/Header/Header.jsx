import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { useAuth0 } from "@auth0/auth0-react";


const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  //const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const headerColor = useHeaderColor();
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to="/">
          <img src="/logo.png" alt="logo" width={100} />
        </Link>

        {/* menu */}
        <OutsideClickHandler onOutsideClick={() => setMenuOpened(false)}>
          <div className="flexCenter h-menu" style={getMenuStyles(menuOpened)}>
            <NavLink to="/properties">Properties</NavLink>
            <a href="mailto:rj287@students.waikato.ac.nz">Contact</a>

            {/* login button */}

            {isLoggedIn ? (
              <ProfileMenu
                user={{ picture: "/default-avatar.png" }}
                logout={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              />
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </OutsideClickHandler>

        {/* hamburger for small screens */}
        <div className="menu-icon" onClick={() => setMenuOpened((p) => !p)}>
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;






//yarn add @mantine/core @mantine/dates @mantine/form @mantine/hooks

//serach for menu in mantine

// <button className="button" onClick={loginWithRedirect}>
