"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDropdown } from "react-icons/io";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";


const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (route: string) =>
    pathname === route ? "bg-neutral-600" : "";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="border w-[300px] bg-black text-white h-full fixed top-0 left-0 flex flex-col justify-between z-50">
      {/* Logo / Header */}
      <div>
        <div className="border-b p-5 flex pl-12 items-center bg-slate-500">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col">
          <Link
            href="/admin"
            className={`h-[65px] flex items-center hover:bg-neutral-600 cursor-pointer gap-2 pl-[65px] ${isActive("/admin")}`}
          >
            <h1>Dashboard</h1>
          </Link>
          <Link
            href="/admin/event"
            className={`h-[65px] flex items-center hover:bg-neutral-600 cursor-pointer gap-2 pl-[65px] ${isActive("/admin/event")}`}
          >
            <h1>Events</h1>
          </Link>
          <Link
            href="/admin/gallery"
            className={`h-[65px] flex items-center hover:bg-neutral-600 cursor-pointer gap-2 pl-[65px] ${isActive("/admin/gallery")}`}
          >
            <h1>Gallery</h1>
          </Link>
          <Link
            href="/admin/connect"
            className={`h-[65px] flex items-center hover:bg-neutral-600 cursor-pointer gap-2 pl-[65px] ${isActive("/admin/connect")}`}
          >
            <h1>Connect</h1>
          </Link>
          <Link
            href="/admin/attendees"
            className={`h-[65px] flex items-center hover:bg-neutral-600 cursor-pointer gap-2 pl-[65px] ${isActive("/admin/attendees")}`}
          >
            <h1>Attendees</h1>
          </Link>
          <Link
            href="/admin/reports"
            className={`h-[65px] flex items-center hover:bg-neutral-600 cursor-pointer gap-2 pl-[65px] ${isActive("/admin/reports")}`}
          >
            <h1>Reports</h1>
          </Link>
        </div>
      </div>

      {/* Profile & Signout */}
      <div className="relative flex flex-col bg-gray-700">
        <div
          className="flex justify-between items-center px-5 py-4 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <CgProfile className="text-2xl" />
          <p className="flex-1 text-center">
            {session?.user?.name || "Admin"}
          </p>
          <IoIosArrowDropdown className="text-2xl" />
        </div>

        {dropdownOpen && (
          <div className="bg-gray-800 text-center py-2">
            <button
              onClick={handleSignOut}
              className="text-sm text-white hover:text-red-500 transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
