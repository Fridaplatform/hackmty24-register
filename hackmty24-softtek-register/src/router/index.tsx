import { fs } from "@/firebase";
import useAuthContext from "@/hooks/useAuthContext";
import Login from "@/pages/Login";
import RegisterTeam from "@/pages/RegisterTeam";
import RegistrationConfirmed from "@/pages/RegistrationConfirmed";
import Signup from "@/pages/Signup";
import TeamsDashboard from "@/pages/TeamsDashboard";
import { Team } from "@/types/Team";
import { User, UserCredential } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
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
        if (!user) {
          return redirect("/");
        }

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
        return uid;
      },
      element: <ProtectedRoute children={<RegisterTeam />} />,
    },
    {
      path: "/registration-confirmed/:teamId",
      loader: async ({ params }: LoaderFunctionArgs) => {
        if (!user) {
          return redirect("/");
        }
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
    {
      path: "/showGrades",
      loader: async () => {
        const querySnapshot = await getDocs(collection(fs, "categories"));
        const categoriesInfo = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        // get evaluations by judges
        const evaluationsQuerySnapshot = await getDocs(collection(fs, "evaluations"));
        const evaluationsInfo = evaluationsQuerySnapshot.docs.map((doc) => {
          // TODO: get the name of all judges 
          return {
            id: doc.id,
            ...doc.data(),
          };
        });



        // get all teams and grades
        const teamsRef = collection(fs, "teams"); // Reference to the 'teams' collection
        const q = query(teamsRef, orderBy("finalScore", "desc")); // Query to order by 'finalScore' in descending order
        const teamsQuerySnapshot = await getDocs(q);

        const teamsData = teamsQuerySnapshot.docs.map((doc) => doc.data());

        return {
          teamsData, // las calificaciones de los equipos
          categoriesInfo, // las columnas que aparecen en la tabla
          evaluationsInfo // las evaluaciones de los jueces.
        }
      },

      element: <TeamsDashboard />,
    },
  ];

  const router = createBrowserRouter(browserRoutes);

  return <RouterProvider router={router}></RouterProvider>;
};

export default ReactRouterBrowser;
