"use client";

import AdminConnectPage from "@/app/components/admin/connect/connect";
import Admin from "@/app/components/admin/layouts/adminLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Connectpage() {
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
      <AdminConnectPage />
    </Admin>
  );
}
