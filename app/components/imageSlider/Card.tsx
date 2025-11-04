"use client";

import React, { useMemo, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import type { Event } from "@/app/api/apiContract";

type Props = {
  events: Event[];
  loading?: boolean;
};

/** Only what the UI needs, no `any` */
type CardView = {
  id: string | number;
  title: string;
  featured_image: string;
  date?: string | null;
  ticket_available?: boolean;
};

const toCardView = (e: Event): CardView => {
  const maybeTicket = (e as { ticket_available?: boolean }).ticket_available;
  const maybeDate = (e as { date?: string | Date | null }).date;

  let dateStr: string | null = null;
  if (maybeDate instanceof Date) {
    dateStr = maybeDate.toISOString();
  } else if (typeof maybeDate === "string") {
    dateStr = maybeDate;
  } else {
    dateStr = null;
  }

  return {
    id: (e as { id: string | number }).id,
    title: (e as { title?: string }).title ?? "Untitled",
    featured_image: (e as { featured_image?: string }).featured_image ?? "/events.jpg",
    date: dateStr,
    ticket_available: maybeTicket ?? false,
  };
};

/** Hydration-safe date formatter: fixed locale + timezone */
const fmtDate = (iso?: string | null) => {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
};

const EventCards: React.FC<Props> = ({ events, loading }) => {
  const [startIndex, setStartIndex] = useState(0);

  // Keep behavior: 4 visible at a time (looping window)
  const looped = useMemo(() => {
    const xs = events ?? [];
    if (xs.length === 0) return xs;
    return [...xs.slice(startIndex), ...xs.slice(0, startIndex)];
  }, [events, startIndex]);

  const visibleCards: CardView[] = useMemo(() => {
    if (loading) {
      const placeholders: CardView[] = Array.from({ length: 4 }, (_, i) => ({
        id: `placeholder-${i}`,
        title: "Loading…",
        featured_image: "/events.jpg",
        date: new Date().toISOString(),
        ticket_available: false,
      }));
      return placeholders;
    }
    const normalized = looped.map(toCardView);
    return normalized.slice(0, 4);
  }, [loading, looped]);

  const total = events?.length ?? 0;

  const nextCard = () => {
    if (!total) return;
    setStartIndex((prev) => (prev + 1) % total);
  };

  const prevCard = () => {
    if (!total) return;
    setStartIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <div className="pb-20">
      <div className="flex flex-row gap-4 justify-center md:items-center w-full">
        {total > 4 && (
          <button onClick={prevCard} className="items-center md:flex hidden" aria-label="Previous">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="25" viewBox="0 0 18 40" fill="none">
              <path d="M0 20L17.25 0.947441L17.25 39.0526L0 20Z" fill="#D9D9D9" />
            </svg>
          </button>
        )}

        <div className="flex gap-2 hidden md:flex">
          {visibleCards.map((card) => {
            const imageSrc = card.featured_image || "/events.jpg";
            const title = card.title;
            const id = card.id;
            const canBuy = !!card.ticket_available;
            const date = fmtDate(card.date);

            return (
              <div
                key={id}
                className="group flex flex-col bg-white rounded-lg md:h-[25vw] md:w-[17vw] h-[123.5vw] w-[81.6vw] overflow-clip cursor-pointer transition-transform"
              >
                <h2 className="flex px-2 items-center justify-center text-black bg-white py-3 rounded-t-lg text-[1.4rem] font-semibold uppercase md:h-[5vw] h-[20vw]">
                  {title}
                </h2>

                <div
                  className="rounded-b-lg xs:h-[103.2vw] md:h-full w-full bg-blue-500 flex flex-col justify-end bg-cover bg-center object-cover relative"
                  style={{ backgroundImage: `url(${imageSrc})` }}
                >
                  {/* Event Date */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {date}
                  </div>

                  <div
                    className={classNames(
                      "relative w-full bg-red-500 text-white text-center py-8 translate-y-[125px] group-hover:translate-y-0 transition-transform h-[4.5vw]",
                      { "rotate-360": "rotate-200" }
                    )}
                  >
                    <Link
                      href={
                        canBuy
                          ? `/buyticket?eventId=${encodeURIComponent(String(id))}`
                          : `/event/detail/${encodeURIComponent(String(title).toLowerCase().replace(/\s+/g, "-"))}`
                      }
                    >
                      BUY TICKETS
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {total > 4 && (
          <button onClick={nextCard} className="items-center md:flex hidden" aria-label="Next">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="25" viewBox="0 0 18 40" fill="none">
              <path d="M18 20L0.75 39.0526L0.75 0.947441L18 20Z" fill="#D9D9D9" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile horizontal scroll (kept exact CSS) */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="md:hidden flex gap-2 w-screen">
          <div className="flex flex-row gap-5 mb-3 px-5">
            {visibleCards.map((card) => {
              const imageSrc = card.featured_image || "/events.jpg";
              const title = card.title;
              const id = card.id;
              const canBuy = !!card.ticket_available;
              const date = fmtDate(card.date);

              return (
                <div
                  key={id}
                  className="group flex flex-col bg-white rounded-lg h-[350px] w-[250px] cursor-pointer"
                >
                  <h2 className="flex items-center justify-center px-2 bg-white py-3 rounded-t-lg text-[1.4rem] font-semibold uppercase text-black">
                    {title}
                  </h2>
                  <div
                    className="rounded-b-lg h-full w-full bg-blue-500 flex flex-col justify-end bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${imageSrc})` }}
                  >
                    {/* Event Date */}
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {date}
                    </div>

                    <div className="w-full bg-red-500 text-white text-center py-4 rounded-b-lg">
                      <Link
                        href={
                          canBuy
                            ? `/buyticket?eventId=${encodeURIComponent(String(id))}`
                            : `/event/detail/${encodeURIComponent(String(title).toLowerCase().replace(/\s+/g, "-"))}`
                        }
                      >
                        BUY TICKETS
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCards;
