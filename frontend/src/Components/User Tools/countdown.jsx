import React, { useState, useEffect } from "react";

const COUNTDOWN_TARGET = new Date("2025-12-31T23:59:59");

const getTimeLeft = () => {
  const totalTimeLeft = COUNTDOWN_TARGET - new Date();

  if (totalTimeLeft <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(totalTimeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((totalTimeLeft / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full flex flex-row justify-center gap-3 md:gap-6">
        {Object.entries(timeLeft).map(([label, value]) => (
          <div key={label} className="flex flex-col items-center justify-center h-36 w-36 md:h-44 md:w-44">
            <div className="text-3xl md:text-5xl font-semibold bg-gray-400 text-gray-800 flex justify-center items-center rounded-lg w-20 h-20 md:w-32 md:h-32 shadow-lg relative">
              <span>{value}</span>
              <div className="absolute w-full h-[1px] bg-gray-600 shadow-md"></div>
              <div className="absolute left-[-7px] w-[10px] h-[20px] bg-gray-500 shadow-inner"></div>
            </div>
            <span className="text-lg md:text-xl font-light tracking-widest mt-2">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;