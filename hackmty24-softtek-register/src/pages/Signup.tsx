import React from 'react'
import { SignupForm } from '@/components/SignupForm'

const Signup = () => {
  return (
    <div className="w-full flex flex-col justify-center bg-red-200 lg:grid min-h-dvh lg:grid-cols-2">
      <div className="flex items-center justify-center h-full px-4 py-12">
        <SignupForm />
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default Signup