"use client";

import React, { useState } from "react";
import MasterLayout from "../../masterlayout/master";
import Link from "next/link";
import eventsData from "../../data/eventsData";
import slugify from "@/app/utils/slugify";
import Image from "next/image";

const PastEvent: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(5);

  // Filter past events (date before today)
  const pastEvents = eventsData.filter(
    (event) => new Date(event.date) < new Date()
  );

  const visibleEvents = pastEvents.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <MasterLayout>
      <div className="bg-black flex flex-col gap-6 justify-center items-center pt-40 pb-16">
        <h2 className="text-3xl font-bold uppercase text-white mb-4">
          Highlights from the Past
        </h2>

        {visibleEvents.map((data) => (
        <Link
        href={`/event/gallery/${slugify(data.title)}`}
        key={data.id}
      >
            <div className="relative md:w-[66.5vw] md:h-[31.25vw] md:border-[2vw] rounded w-[90.4vw] h-[42.5vw] xs:border-[3vw] border-gray-300 hover:border-gray-500 cursor-pointer">
              <Image
                src={data.featuredImage}
                height={100}
                width={100}
                className="md:h-[27.29vw] md:w-[62.5vw] rounded border md:w-full object-cover w-[84.5vw] h-[36.8vw]"
                alt={data.title}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/60 px-6 py-3 rounded text-black text-xl font-bold text-center">
                  {data.title}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {visibleCount < pastEvents.length && (
          <button
            onClick={handleLoadMore}
            className="mt-6 font-bold text-black border px-6 py-2 cursor-pointer bg-white border-white px-10 py-2 rounded box font-abel-pro text-base"
          >
            LOAD MORE
          </button>
        )}
      </div>
    </MasterLayout>
  );
};

export default PastEvent;
