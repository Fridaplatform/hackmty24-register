import { User, UserCredential } from "firebase/auth";

export interface SignUpForm {
    email: string;
    password: string;
    repassword: string;
  }
  
  export interface SignInForm {
    email: string;
    password: string;
  }
  
  export interface SignStatus {
    status: "" | "error" | "validating" | "success" | "warning" | undefined;
    message: string | undefined;
  user: User | UserCredential | null;

  }
  