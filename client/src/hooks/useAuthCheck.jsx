import {useAuth0} from '@auth0/auth0-react'
import { toast } from "react-toastify";


const useAuthCheck = () => {

   const isLoggedIn = !!localStorage.getItem("token");
    const validateLogin = () => {
        if(!isLoggedIn)
        {
            toast.error("you must be logged in", {position: "bottom-right"})
            return false
        } else return true
    }
  return (
    {
        validateLogin
    }
  )
}

export default useAuthCheck