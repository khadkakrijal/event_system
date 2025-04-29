"use client";

import React, { useEffect } from "react";
import Admin from "../components/admin/layouts/adminLayout";
import AdminDashboard from "../components/admin/dashboard/dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Adminpage() {
    const {  status } = useSession();
    const router = useRouter();
  
    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/admin/login");
      }
    }, [status, router]);
  
    if (status === "loading") {
      return <div>Loading...</div>;
    }
  return (
    <Admin>
      <AdminDashboard />
    </Admin>
  );
}
