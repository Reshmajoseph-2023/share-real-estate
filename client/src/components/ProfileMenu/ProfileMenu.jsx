import { Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import React from 'react'
const ProfileMenu = ({ user, logout, setUserDetails }) => {
  const navigate = useNavigate();

 
  return (
    <Menu>
        <Menu.Target>
            <Avatar src={user?.picture} alt='user image' radius={"xl"}/>
        </Menu.Target>
        <Menu.Dropdown>
            <Menu.Item onClick={()=> navigate("./favourites", {replace: true})}>
                Favourites
            </Menu.Item>

            <Menu.Item onClick={()=> navigate("./bookings", {replace: true})}>
                Bookings
            </Menu.Item>

            <Menu.Item onClick={()=>{
                localStorage.clear();
                logout()
            }}>
                Logout
            </Menu.Item>
        </Menu.Dropdown>
    </Menu>
  )
}

export default ProfileMenu;
//yarn add @mantine/core @mantine/dates @mantine/form @mantine/hooks
//  const navigate = useNavigate();
//yarn add @emotion/react
// <Menu.Item onClick={() => navigate("/favourites")}>Favourites</Menu.Item>