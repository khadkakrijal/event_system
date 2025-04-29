"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface WebNavProps {
  className?: string;
}

const WebHeader: React.FC<WebNavProps> = () => {
  const pathname = usePathname();

  const handleScroll = () => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      const scrollPosition = window.scrollY;
      const bodyWidth = document.body.offsetWidth;

      if (scrollPosition > 100) {
        navbar.style.transition =
          "transform 0.5s ease-in-out, width 0.5s ease-in-out, margin-top 0.2s ease-in-out";
        navbar.style.marginTop = "0";
        navbar.style.width = `${bodyWidth}px`;
      } else {
        navbar.style.transition =
          "transform 0.2s ease-in-out, width 0.2s ease-in-out, margin-top 0.1s ease-in-out";
        navbar.style.transform = "none";
        navbar.style.width = "1130px";
        navbar.style.marginTop = `${49 - scrollPosition / 2}px`;
      }
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav className="h-16 bg-white text-gray-800 duration-700 flex uppercase justify-center fixed top-0 left-0 right-0 m-auto mt-[50px] z-50 rounded-sm shadow-2xl font-abel-pro">
        <ul className="flex items-center text-black justify-around gap-32 text-base font-bold relative">
          <li className="relative">
            <Link
              href="/upcomingevent"
              className={`hover:after:absolute hover:after:block hover:after:w-full hover:after:h-1 hover:after:mt-4  hover:after:bg-red-500 hover:text-red-500  ${
                pathname === "/upcomingevent" ? "text-red-500" : ""
              }`}
            >
              Upcoming Events
              {pathname === "/upcomingevent" && (
                <div className="absolute top-10 w-full h-1 bg-red-500"></div>
              )}
            </Link>
          </li>

          <li className="relative">
            <Link
              href="/gallery"
              className={`hover:after:absolute hover:after:block hover:after:w-full hover:after:h-1 hover:after:mt-4  hover:after:bg-red-500 hover:text-red-500  ${
                pathname === "/gallery" ? "text-red-500" : ""
              }`}
            >
              Gallery
              {pathname === "/gallery" && (
                <div className="absolute top-10 w-full h-1 bg-red-500"></div>
              )}
            </Link>
          </li>

          <li className="relative">
            <Link href="/">
              <Image
                className=" w-13 h-12 px-0 "
                width={100}
                height={100}
                src="/icon-e.jpg"
                alt="logo"
              />

              {pathname === "/" && (
                <div className="absolute top-13 w-full h-1 bg-red-500"></div>
              )}
            </Link>
          </li>

          <li className="relative">
            <Link
              href="/pastevent"
              className={`hover:after:absolute hover:after:block hover:after:w-full hover:after:h-1 hover:after:mt-4  hover:after:bg-red-500 hover:text-red-500  ${
                pathname === "/pastevent" ? "text-red-500" : ""
              }`}
            >
              past Events
              {pathname === "/pastevent" && (
                <div className="absolute top-10 w-full h-1 bg-red-500"></div>
              )}
            </Link>
          </li>

          <li className="relative">
            <Link
              href="/connect"
              className={`hover:after:absolute hover:after:block hover:after:w-full hover:after:h-1 hover:after:mt-4  hover:after:bg-red-500 hover:text-red-500  ${
                pathname === "/connect" ? "text-red-500" : ""
              }`}
            >
              Connect
              {pathname === "/connect" && (
                <div className="absolute top-10 w-full h-1 bg-red-500"></div>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default WebHeader;
