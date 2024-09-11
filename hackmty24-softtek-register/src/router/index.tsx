import useAuthContext from '@/hooks/useAuthContext';
import Login from '@/pages/Login';
import RegisterTeam from '@/pages/RegisterTeam';
import RegistrationConfirmed from '@/pages/RegistrationConfirmed';
import Signup from '@/pages/Signup';
import React, { ReactNode } from 'react'
import {
    createBrowserRouter,
    LoaderFunctionArgs,
    Navigate,
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
        console.log("is there user?",user)
        // if not authenticated, redirect to login
        if (!user) {
          return <Navigate to={"/login"} />;
        }
    
        return children;
      };

    const browserRoutes: RouteObject[] = [
        {
            path: "/",
            element: <Signup />
        },
        {
            path: "login",
            element: <Login />
        },
        {
            path: "/register",
            element: <ProtectedRoute children={<RegisterTeam />} />
        },
        {
            path: "/registration-confirmed",
            element: <ProtectedRoute children={<RegistrationConfirmed />} />
        }
    ]


    const router = createBrowserRouter(browserRoutes)

    return <RouterProvider router={router}></RouterProvider>;
  
}

export default ReactRouterBrowser