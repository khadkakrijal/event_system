"use client";

import Admin from "@/app/components/admin/layouts/adminLayout";
import AdminUsersPage from "@/app/components/admin/users/users";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";


export default function Userspage() {
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
      {" "}
      <AdminUsersPage />
    </Admin>
  );
}
