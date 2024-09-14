import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { doSignInGithub } from "@/auth";
import useAuthContext from "@/hooks/useAuthContext";

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export function SignupForm() {
  const navigate = useNavigate();
  const { dispatchWithCallback } = useAuthContext();

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Solo un integrante del equipo puede registrar a su equipo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              const { success, user, message } = await doSignInGoogle();
              if (success && user) {
                console.log("this the user", user);
                dispatch({ type: "SET_USER", payload: user });
                navigate("/register");
              }
            }}
          >
            Login with Google
          </Button> */}
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              const { success, user, message } = await doSignInGithub();
              if (success && user) {
                console.log("this the user", user);
                
                dispatchWithCallback(
                  { type: "SET_USER", payload: user },
                  () => navigate('/register')
                );
                
              }
              console.log("Error singing in with Github", message);
            }}
          >
            Sign up with GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignupForm;
