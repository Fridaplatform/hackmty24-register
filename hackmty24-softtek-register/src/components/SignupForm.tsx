import { NavLink, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doSignInGithub, doSignInGoogle } from "@/auth";
import useAuthContext from "@/hooks/useAuthContext";

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export function SignupForm() {
  const navigate = useNavigate();
  const { dispatch, dispatchWithCallback } = useAuthContext();

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
          <Button
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
          </Button>
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
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <NavLink to="#" className="underline">
            Log in
          </NavLink>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignupForm;
