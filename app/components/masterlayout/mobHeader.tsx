"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const MobHeader: React.FC = () => {
  const pathname = usePathname();
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const navLinks = [
    { name: "upcoming events", link: "/upcomingevent" },
    { name: "past events", link: "/pastevent" },
    { name: "Gallery", link: "/gallery" },
    { name: "Connect", link: "/connect" },
  ];

  return (
    <div>
      <nav className="z-50 bg-white border-b-2 shadow-2xl border-gray-600 text-gray-800 fixed top-0 h-16 w-full flex justify-between items-center px-4 font-abel-pro">
        {/* Logo */}
        <Link href="/">
          <Image
            className="w-15 h-12"
            width={100}
            height={100}
            src="/icon-e.jpg"
            alt="logo"
          />
        </Link>

        {/* Menu Toggle */}
        <button onClick={toggleDropdown}>
          <div className="flex gap-2 items-center">
            <h1 className="text-black text-[20px] font-bold font-abel uppercase">
              Menu
            </h1>
            <Image
              src="/menu down.png"
              alt="menu icon"
              width={17}
              height={9}
              className="transition-transform"
              style={{
                transform: dropdown ? "rotate(0)" : "rotate(180deg)",
              }}
            />
          </div>
        </button>
      </nav>

      {/* Dropdown Menu */}
      {dropdown && (
        <div className="h-screen pt-20 fixed z-20 flex flex-col items-center justify-start font-bold bg-white top-0 right-0 w-full">
          {navLinks.map((nav, index) => (
            <Link
              key={index}
              href={nav.link}
              onClick={() => setDropdown(false)}
              className={`py-4 text-[20px] uppercase font-abel-pro font-semibold ${
                pathname === nav.link ? "text-red-500" : "text-black"
              }`}
            >
              {nav.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobHeader;
