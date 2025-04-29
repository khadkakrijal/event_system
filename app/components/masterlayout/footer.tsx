import React from "react";

import Image from "next/image";
import Link from "next/link";

interface footerProps {
  className?: string;
}

const Footer: React.FC<footerProps> = () => {
  return (
    <div>
      <footer className=" w-full bg-black md:border-t md:border-gray-300 text-white">
        <div className="md:flex  md:justify-between md:flex-row flex flex-col justify-center items-center md:px-20 py-8 md:py-14">
          <div className=" flex flex-col gap-4 justify-center items-center">
            <Image
              className="mb-4"
              src="/icon-e.jpg"
              alt="Positive Vibes's Logo"
              width={80}
              height={80}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2  md:ml-20">
            <div className="col-span-1 flex flex-col items-start md:items-center text-lg">
              <ul className="flex flex-col gap-3 items-center  font-abel-pro">
                <li>
                  <Link href="/">
                    <p className="text-white hover:text-gray-100">Home</p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-white hover:text-gray-100"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link href="/connect">
                    <p className="text-white hover:text-gray-100 hover:cursor-pointer">
                      Contact us
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
