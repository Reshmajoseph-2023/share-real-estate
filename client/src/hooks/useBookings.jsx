import { useContext } from "react";
import { useQuery } from "react-query";
import UserDetailContext from "../context/UserDetailContext";
import { getAllBookings } from "../utils/api";

const useBookings = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const token = userDetails?.token;
  const email = userDetails?.email;

  const query = useQuery({
    queryKey: ["allBookings", email],          // cache per user
    queryFn: () => getAllBookings(email, token),
    enabled: !!token && !!email,               // <-- use token (and email) to gate fetch
    staleTime: 30_000,
    onSuccess: (list) => {
      if (Array.isArray(list)) {
        setUserDetails((prev) => ({ ...prev, bookings: list }));
      }
    },
  });

  return {
    data: Array.isArray(query.data) ? query.data : (userDetails.bookings ?? []),
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export default useBookings;
