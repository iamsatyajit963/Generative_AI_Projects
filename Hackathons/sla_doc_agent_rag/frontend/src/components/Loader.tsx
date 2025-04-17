import React, { useState, useEffect } from "react";
 
export const DotsLoader: React.FC = () => {

  const [dots, setDots] = useState(".");
 
  useEffect(() => {

    const interval = setInterval(() => {

      setDots((prev) => (prev.length === 3 ? "." : prev + "."));

    }, 500);

    return () => clearInterval(interval);

  }, []);
 
  return <span className="font-bold text-xl">{dots}</span>;

};
 