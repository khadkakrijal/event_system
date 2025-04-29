import classNames from "classnames";
import React from "react";
import { useState } from "react";

interface CardData {
  title: string;
  imageSrc: string;
}

interface CardProps {
  cardsData: CardData[];
}

const EventCard: React.FC<CardProps> = ({ cardsData }) => {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards: CardData[] = [
    ...cardsData.slice(startIndex),
    ...cardsData.slice(0, startIndex),
  ].slice(0, 4);

  const nextCard = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % cardsData.length);
  };

  const prevCard = () => {
    setStartIndex(
      (prevIndex) => (prevIndex - 1 + cardsData.length) % cardsData.length
    );
  };

  return (
    <div className="pb-20">
      <div className=" flex flex-row gap-4 justify-center md:items-center  w-full">
        <button onClick={prevCard} className=" items-center md:flex hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="25"
            viewBox="0 0 18 40"
            fill="none"
          >
            <path
              d="M2.62347e-07 20L17.25 0.947441L17.25 39.0526L2.62347e-07 20Z"
              fill="#D9D9D9"
            />
          </svg>
        </button>
        <div className="flex gap-2 hidden md:flex">
          {visibleCards.map((card, index) => (
            <div
              key={index}
              className="group  flex flex-col bg-white rounded-lg md:h-[25vw] md:w-[17vw] h-[123.5vw] w-[81.6vw] overflow-clip cursor-pointer  transition-transform "
            >
              <h2 className="flex items-center justify-center text-black bg-white py-3 rounded-t-lg text-[1.4rem] font-semibold  uppercase md:h-[5vw] h-[20vw]">
                {card.title}
              </h2>
              <div
                className="rounded-b-lg xs:h-[103.2vw] md:h-full w-full bg-blue-500 flex flex-col justify-end bg-cover bg-center object-cover"
                style={{ backgroundImage: `url(${card.imageSrc})` }}
              >
                <div
                  className={classNames(
                    " relative  w-full bg-red-500   text-white   text-center py-8 translate-y-[125px] group-hover:translate-y-0 transition-transform h-[4.5vw]",
                    {
                      "rotate-360": "rotate-200",
                    }
                  )}
                >
                  BUY TICKETS
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={nextCard} className=" items-center md:flex hidden ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="25"
            viewBox="0 0 18 40"
            fill="none"
          >
            <path
              d="M18 20L0.750002 39.0526L0.750002 0.947441L18 20Z"
              fill="#D9D9D9"
            />
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-hide ">
        <div className="md:hidden flex gap-2 w-screen">
          <div className="flex flex-row gap-5 mb-3 px-5">
            {visibleCards.map((card, index) => (
              <div
                key={index}
                className="group  flex flex-col bg-white rounded-lg h-[350px] w-[250px] cursor-pointer"
              >
                <h2 className="flex items-center justify-center bg-white py-3 rounded-t-lg text-[1.4rem] font-semibold   uppercase text-black">
                  {card.title}
                </h2>
                <div
                  className="rounded-b-lg h-full  w-full bg-blue-500 flex flex-col justify-end bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.imageSrc})` }}
                >
                  <div
                    className={
                      "w-full bg-red-500   text-white   text-center py-4 rounded-b-lg"
                    }
                  >
                    BUY TICKETS
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
