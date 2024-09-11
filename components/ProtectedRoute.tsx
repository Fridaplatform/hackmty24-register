"use client"
import useAuthContext from "@/hackmty24-softtek-register/src/hooks/useAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * @param 
 * @returns Protected route element that utilizes Firebase Auth to protect routes in Next.js App router.
 */
const ProtectedRoute = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithProtection: React.FC<P> = (props) => {
      const { authState: {loading, user} } = useAuthContext();
      const router = useRouter();
  
      useEffect(() => {
        if (!loading && !user) {
          router.push('/login');
        }
      }, [user, loading, router]);
  
      if (loading) {
        return <div>Loading...</div>;
      }
  
      if (!user) {
        return null;
      }
  
      return <WrappedComponent {...props} />;
    };
  
    WithProtection.displayName = `WithProtection(${getDisplayName(WrappedComponent)})`;
  
    return WithProtection;
  };
  
  // Helper function to get the display name of a component
  function getDisplayName<P>(WrappedComponent: React.ComponentType<P>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }
  
  export default ProtectedRoute;