import { useQuery } from "react-query";
import { getAllProperties } from "../utils/api";

const useProperties = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allProperties",
    getAllProperties,
    {
      refetchOnWindowFocus: false, 
      select: (res) => res.data,   // only return the array from the response
    }
  );

  return { data, isError, isLoading, refetch };
};

export default useProperties;


//yarn add react-query