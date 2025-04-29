"use client";

import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      username: email,
      password,
      callbackUrl: "/admin",
    });

    if (result?.error) {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
      });
    } else {
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      router.push(result?.url || "/admin");
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <Image
        src="/event-collage.avif"
        alt="Admin Login Background"
        fill
        className="object-cover z-0"
        priority
      />

    

      {/* Login Form Container */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl shadow-2xl p-10 w-[90vw] max-w-md"
        >

          <div className="mb-8 flex justify-center">
            <Image
              src="/icon-e.jpg"
              alt="Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
