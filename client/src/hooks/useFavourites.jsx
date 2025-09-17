import { useContext } from "react";
import { useQuery } from "react-query";
import UserDetailContext from "../context/UserDetailContext";
import { AllBookmarked } from "../utils/api";

const useFavourites = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const token = userDetails?.token;
  const email = userDetails?.email || "anon";

  const query = useQuery({
    queryKey: ["allFavourites", email],
    queryFn: () => AllBookmarked(token),
    enabled: !!token,            // only run after token is ready
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      if (!Array.isArray(data)) return;

      setUserDetails((prev) => {
        // if we already have favourites and server returned empty, don't wipe
        const hadLocal = (prev?.favourites?.length ?? 0) > 0;
        if (hadLocal && data.length === 0) return prev;

        const next = { ...prev, favourites: data };
        // persist
        try { localStorage.setItem("favourites", JSON.stringify(next.favourites)); } catch {}
        return next;
      });
    },
  });

  // fall back to context while first load happens
  const data = Array.isArray(query.data) ? query.data : (userDetails.favourites ?? []);

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export default useFavourites;
