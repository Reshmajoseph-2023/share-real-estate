// components/Heart/Heart.jsx
import { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { useMutation } from "react-query";
import UserDetailContext from "../../context/UserDetailContext";
import { checkFavourites, updateFavourites, normalizeFavs } from "../../utils/common";
import { toFav } from "../../utils/api";
import useAuthCheck from "../../hooks/useAuthCheck";

const Heart = ({ id }) => {
  const [heartColor, setHeartColor] = useState("white");

  const ctx = useContext(UserDetailContext) || {};
  const userDetails = ctx.userDetails || {};
  const setUserDetails = ctx.setUserDetails;

  const favourites = normalizeFavs(userDetails.favourites); // normalize here
  const token = userDetails.token || localStorage.getItem("token");

  useEffect(() => {
    setHeartColor(checkFavourites(id, favourites));
  }, [id, favourites]);

  const { validateLogin } = useAuthCheck();

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Missing token");
      // Ensure toFav uses Bearer header internally
      return toFav(id, token);
    },
    onSuccess: () => {
      setUserDetails?.((prev) => {
        const nextFavs = updateFavourites(id, prev?.favourites || []);
        // persist
        try {
          localStorage.setItem("favourites", JSON.stringify(nextFavs));
        } catch {}
        return { ...(prev || {}), favourites: nextFavs };
      });
      setHeartColor((prev) => (prev === "#fa3e5f" ? "white" : "#fa3e5f"));
    },
    onError: (err) => {
      console.error("Failed to update favourites:", err?.response?.data || err?.message);
    },
  });

  const handleLike = () => {
    if (validateLogin()) {
      mutate();
    }
  };

  return (
    <AiFillHeart
      size={24}
      color={heartColor}
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
    />
  );
};

export default Heart;



//step 2: mutate  --to send data to server
//stpe3: usercontext for token
//reference to toFav from api.js
//create oSuccess() part
//when refresh all fav disapper to tackle that creating hooks useFavourites