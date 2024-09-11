import { AuthContext } from "@/auth/authContext";
import { useContext } from "react";

const useAuthContext = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
      throw new Error("useAuthContext needs to be inside AuthContextProvider");
    }
  
    return authContext;
  };
  
  export default useAuthContext;
  