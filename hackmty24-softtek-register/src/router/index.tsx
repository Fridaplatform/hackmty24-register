import { fs } from "@/firebase";
import useAuthContext from "@/hooks/useAuthContext";
import Login from "@/pages/Login";
import RegisterTeam from "@/pages/RegisterTeam";
import RegistrationConfirmed from "@/pages/RegistrationConfirmed";
import Signup from "@/pages/Signup";
import { Team } from "@/types/Team";
import { User, UserCredential } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { ReactNode } from "react";
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  Navigate,
  redirect,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

const ReactRouterBrowser = () => {
  const {
    authState: { user, authReady },
  } = useAuthContext();

  if (!authReady) {
    return null;
  }

  /**
   * @returns Redirects the user to the protected route it is requesting. If not authenticated, it is redirected to the login
   */
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    console.log("is there user?", user);
    // if not authenticated, redirect to login
    if (!user) {
      return <Navigate to={"/login"} />;
    }

    return children;
  };

  const browserRoutes: RouteObject[] = [
    {
      path: "/",
      element: <Signup />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "/register",
      // if user already has an account, retrieve team Id and redirect to their QR code.
      loader: async () => {
        const uid = (user as User).uid || (user as UserCredential).user.uid;

        const userDoc = await getDoc(doc(fs, `users/${uid}`));
        // if user already exists, go directly to registration-confirmed
        if (userDoc.exists()) {
          const colRef = collection(fs, "teams");
          // get team document where the user uid is stored.
          const q = query(colRef, where("uid", "==", uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            console.log("this the length of the docs", querySnapshot.size);
            const teamId = querySnapshot.docs[0].id;
            return redirect(`/registration-confirmed/${teamId}`);
          }
        }
        // send uid to then save it along with the team document
        return uid
      },
      element: <ProtectedRoute children={<RegisterTeam />} />,
    },
    {
      path: "/registration-confirmed/:teamId",
      loader: async ({ params }: LoaderFunctionArgs) => {
        const { teamId } = params;

        if (!teamId) {
          redirect("/");
        }
        const docRef = doc(fs, `teams/${teamId}`);
        const teamDoc = await getDoc(docRef);
        if (teamDoc.exists()) {
          return {
            teamId: teamDoc.id,
            ...teamDoc.data(),
          };
        }
      },
      element: <ProtectedRoute children={<RegistrationConfirmed />} />,
    },
  ];

  const router = createBrowserRouter(browserRoutes);

  return <RouterProvider router={router}></RouterProvider>;
};

export default ReactRouterBrowser;
