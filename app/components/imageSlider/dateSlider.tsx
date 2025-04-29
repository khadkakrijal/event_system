import React, { useState } from "react";
interface EventData {
  title: string;
  title2: string;
}

interface EventCalendarProps {
  data: EventData[];
}
const EventCalender: React.FC<EventCalendarProps> = ({ data }) => {
  const [shiftX, setShiftX] = useState(0);
  const handleclick = (direction: string) => {
    const screenWidth = window.innerWidth;
    if (direction === "+" && (screenWidth < 868 ? shiftX > -9 : shiftX > -6)) {
      setShiftX(shiftX - 1);
    } else if (direction === "-" && shiftX < 0) {
      setShiftX(shiftX + 1);
    }
  };

  return (
    <div className="w-full md:p-12 mb-10 px-2">
      <div className="md:h-[80px] h-[60px] flex md:gap-5 justify-center items-center cursor-pointer gap-3">
        <div
          className="   md:h-full text-white items-center flex justify-center "
          onClick={() => handleclick("-")}
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
        <div className="md:w-[69.4vw] md:h-[4.8vw] border rounded-md border-white bg-black text-white flex justify-start items-center overflow-hidden">
          {data.map((month, index) =>(
            <div className="hover:bg-white hover:text-black realtive text-white md:min-w-[11.8vw] md:min-h-[4.8vw] min-w-[27.5vw] min-h-[1.87vw] border border-white md:py-3 text-center uppercase transition-transform" style={{ transform: `translate(${shiftX}00%, 0%)` }} key={index}>
              <div className="felx flex-col">
                <div className="text-[1.6rem] font-bold">{month.title}</div>
                <div className="text-[1rem]">{month.title2}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="  md:h-full text-white items-center flex justify-center cursor-pointer "
          onClick={() => handleclick("+")}
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

export default EventCalender;
