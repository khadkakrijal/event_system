"use client";


import AdminAttendeesPage from "@/app/components/admin/attendee/attendee";
import Admin from "@/app/components/admin/layouts/adminLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Attendeepage() {
  const { status } = useSession();
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
      <AdminAttendeesPage />
    </Admin>
  );
}
