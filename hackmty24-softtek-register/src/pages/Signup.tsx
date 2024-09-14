import { useEffect } from 'react'
import { SignupForm } from '@/components/SignupForm'
import useAuthContext from '@/hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
const Signup = () => {

  const {authState: { user }} = useAuthContext()
  const navigate = useNavigate();

  // UNCOMMENT FOR EXPECTED BEHAVIOUR IN PRODUCTION
  useEffect(() => {
    if (user) {
      navigate('/register');
    }
  }, [user, navigate]);

  return (
    <div className="w-full flex flex-col justify-center bg-gradient-to-b from-black to-[#5d2e7f] lg:grid min-h-dvh lg:grid-cols-2">
      <div className="flex items-center justify-center h-full px-4 py-12 z-10">
        <SignupForm />
      </div>
      <div className="relative hidden lg:flex flex-col gap-16 items-center justify-center bg-muted">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
        <img
          src="/logo_softtek.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-auto w-64 object-cover z-10"
        />
        <img
          src="/logo2024.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-auto w-64 object-cover z-10"
        />
      </div>
      {/* <Button onClick={async () => logout()}>Log out of app</Button> */}
    </div>
  )
}

export default Signup