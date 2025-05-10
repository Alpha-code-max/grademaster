'use client'

import NavBar from "@/components/NavBar";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import CourseInputRow from "@/components/CourseInputRow";
import Table from "@/components/Table";
import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import Register from "@/auth-components/Register";
import ContactPage from "@/components/ContactComponent";
export default function Page(){


  
  
  return (
    <div className=" bg-background">
      <NavBar/>
      <div className="flex items-center justify-center p-4 sm:p-8 mt-10">
        <LandingPage />
      </div>
    
      <ContactPage />
    </div>
  )
}