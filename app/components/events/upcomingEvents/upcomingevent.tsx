"use client";

import React, { useState } from "react";
import MasterLayout from "../../masterlayout/master";
import Link from "next/link";
import eventsData from "../../data/eventsData";
import slugify from "@/app/utils/slugify";
import Image from "next/image";


const UpcomingEvents: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(5);

  // Filter only upcoming events
  const upcomingEvents = eventsData.filter(
    (event) => new Date(event.date) > new Date()
  );

  const visibleEvents = upcomingEvents.slice(0, visibleCount);
  console.log(visibleEvents, "visible events==");

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <MasterLayout>
      <div className="bg-black flex flex-col gap-6 justify-center items-center pt-40 pb-16">
        <h2 className="text-3xl font-bold uppercase text-white mb-4">
        {"What's Coming Up"}
        </h2>

        {visibleEvents.map((data) => (
          <div
            key={data.id}
            className="rounded-lg md:flex md:gap-8 bg-cover hover:bg-onhover cursor-pointer text-white md:w-[83vw] md:h-[17.5vw] md:p-[11px] md:border-none border border-outline md:items-center"
          >
            <div>
              <Image
              height={100}
              width={100}
                className="md:h-[16.35vw] object-fit md:w-[27.7vw] h-[45.39vw] w-[79.6vw] object-cover rounded p-2"
                src={data.featuredImage}
                alt={data.title}
              />
            </div>
            <div className="flex flex-col md:justify-center lg:w-[55.32vw] relative md:pl-7">
              <div className="flex flex-col gap-4 md:p-0 p-3 md:pb-6">
                <h1 className="md:text-[1.2rem] text-[0.95rem] font-semibold font-abel-pro">
                  {data.title}
                </h1>
                <div className="flex gap-2 items-center font-abel-pro font-semibold">
                  <span>🕒</span>
                  <h1>{data.date}</h1>
                </div>
                <div className="flex gap-3 font-abel items-center">
                  <span>📍</span>
                  <h1>{data.venue}</h1>
                </div>
                <div className="flex gap-3 font-abel items-center">
                  <span>📌</span>
                  <h1>{data.location}</h1>
                </div>
              </div>
              <div className="flex flex-row justify-between w-full md:gap-2">
                <div className="md:h-[2.9vw] md:w-[12vw] w-full bg-red-500 md:text-[16px] text-[14px] md:border md:border-white text-white md:rounded flex justify-center md:rounded-br-none rounded-bl-lg font-abel font-medium">
                  <Link href="/buyticket" className="flex justicy-center items-center" >BUY TICKETS</Link>
                </div>
                <div className="text-[16px] md:flex hidden justify-end md:pr-11">
                  <div className="relative">
                    <button className="box md:h-[2.9vw] md:w-[12vw] md:border md:border-white md:rounded text-white w-full rounded-bl-lg font-abel border-t border-r border-outline font-medium">
                      <Link href={`/event/detail/${slugify(data.title)}`}>
                        READ MORE
                      </Link>
                    </button>
                  </div>
                </div>
                <div className="w-full text-[14px] md:hidden flex justify-end md:pr-11">
                  <div className="relative w-full">
                    <button className="box py-1 text-white w-full rounded-br-lg font-abel border-t border-r border-outline font-medium">
                      <Link href={`/event/detail/${slugify(data.title)}`}>
                        READ MORE
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Load More Button */}
        <div className="relative">
          {visibleCount < upcomingEvents.length && (
            <button
              onClick={handleLoadMore}
              className="mt-6 font-bold text-black border px-6 py-2 cursor-pointer bg-white border-white px-10 py-2 rounded box font-abel-pro text-base"
            >
              LOAD MORE
            </button>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default UpcomingEvents;
