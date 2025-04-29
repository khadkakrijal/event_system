"use client";
import React from "react";
import Image from "next/image";

const CoverPage: React.FC = () => {
  return (
    <div className="h-[100vh]">
      <Image
        src="/events.jpg"
        alt="Event Cover"
        className="object-cover"
        fill
        priority
      />
    </div>
  );
};

export default CoverPage;
