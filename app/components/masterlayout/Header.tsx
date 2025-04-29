"use client";

import React from "react";
import { useEffect, useState } from "react";
import MobHeader from "./mobHeader";
import WebHeader from "./webHeader";


const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 868);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div>{isMobile ? <MobHeader /> : <WebHeader />}</div>;
};

export default Header;
