"use client";

import React from "react";
import Link from "next/link";
import Upcomingeventscard from "./upcomingCard/upcomingsCard";

const UpcomingSection: React.FC = () => {
  return (
    <div className="bg-black flex flex-col gap-2 justify-center items-center p-10">
      <h2 className="text-3xl font-bold uppercase text-white mb-4">
        Upcoming Events
      </h2>
      <Upcomingeventscard />
      <div className="mt-6 relative">
        <Link href="/upcomingevent">
          <button className="box hover:cursor-pointer bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition">
            View All Events
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UpcomingSection;
