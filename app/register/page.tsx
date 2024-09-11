"use client"
import HackathonRegistrationForm from '@/components/HackathonRegistrationForm'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'


const page = () => {
  return (
    <div>
        <HackathonRegistrationForm />
    </div>
  )
}

export default ProtectedRoute(page)