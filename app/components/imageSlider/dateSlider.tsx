"use client";

import React, { useState } from "react";
import type { MonthRow } from "./eventCalendar";

interface EventCalendarProps {
  data: MonthRow[];
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
  loading?: boolean;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  data,
  selectedKey = null,
  onSelect,
  loading = false,
}) => {
  const [shiftX, setShiftX] = useState(0);

  const handleClick = (direction: string) => {
    const screenWidth =
      typeof window !== "undefined" ? window.innerWidth : 1024;
    if (direction === "+" && (screenWidth < 868 ? shiftX > -9 : shiftX > -6)) {
      setShiftX((v) => v - 1);
    } else if (direction === "-" && shiftX < 0) {
      setShiftX((v) => v + 1);
    }
  };

  const rows: MonthRow[] = loading
    ? Array.from({ length: 12 }, (_, i) => ({
        key: `s-${i}`,
        title: "…",
        count: 0,
      }))
    : data;

  return (
    <div className="w-full md:p-12 mb-10 px-2">
      <div className="md:h-[80px] h-[60px] flex md:gap-5 justify-center items-center cursor-pointer gap-3">
        {/* Left arrow */}
        <div
          className="md:h-full text-white items-center flex justify-center"
          onClick={() => handleClick("-")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="25"
            viewBox="0 0 18 40"
            fill="none"
          >
            <path d="M0 20L17.25 0.947441L17.25 39.0526L0 20Z" fill="#D9D9D9" />
          </svg>
        </div>

        {/* Month strip */}
        <div className="md:w-[69.4vw] md:h-[4.8vw] border rounded-md border-white bg-black text-white flex justify-start items-center overflow-hidden">
          {rows.map((row) => {
            const isSelected = !loading && selectedKey === row.key;
            const subtitle = loading
              ? "…"
              : `${row.count} ${row.count === 1 ? "Event" : "Events"}`;

            return (
              <div
                key={row.key}
                onClick={() => !loading && onSelect?.(row.key)}
                className={`hover:bg-white hover:text-black relative text-white md:min-w-[11.8vw] md:min-h-[4.8vw] min-w-[27.5vw] min-h-[1.87vw] border border-white md:py-3 text-center uppercase transition-transform ${
                  isSelected ? "bg-gray-500 text-black font-bold" : ""
                }`}
                style={{ transform: `translate(${shiftX}00%, 0%)` }}
              >
                <div className="flex flex-col">
                  <div className="text-[1.6rem] font-bold">{row.title}</div>
                  <div className="text-[1rem]">{subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right arrow */}
        <div
          className="md:h-full text-white items-center flex justify-center cursor-pointer"
          onClick={() => handleClick("+")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="25"
            viewBox="0 0 18 40"
            fill="none"
          >
            <path
              d="M18 20L0.75 39.0526 0.750002 0.94744 18 20Z"
              fill="#D9D9D9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
