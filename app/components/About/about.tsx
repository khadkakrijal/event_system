"use client"

import React from "react"
import MasterLayout from "../masterlayout/master"
import Image from "next/image"



const About:React.FC = ()=>{
    return (
        <MasterLayout>
              <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/events.jpg" 
        alt="Event Background"
        fill
        className="object-cover brightness-50"
        priority
      />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center text-white">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <p className="mb-4 text-lg leading-relaxed">
            Welcome to our Event Management System — a platform built to simplify the planning and organization of all kinds of events. From business meetings and concerts to festivals and private gatherings, we help bring your vision to life.
          </p>
          <p className="text-lg leading-relaxed">
            Our goal is to provide a smooth, modern, and intuitive experience for event organizers and attendees alike. With powerful tools for creation, engagement, and analytics, we’re redefining how events are managed.
          </p>
        </div>
      </div>
    </div>
        </MasterLayout>
    )
}
export default About