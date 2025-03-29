import React from "react";

const FloatingShape = () => {
  const images = [
    "badge.png",
    "police-badge.png",
    "police-handcuffs.png",
    "police-hat.png",
    "policeman.png",
    "siren.png",
    "traffic.png",
    "cone.png",
    "road-sign-2.png",
    "road-sign.png",
    "road.png",
    "traffic-lights-4.png",
    "pedestrians.png",
    "car.png",
    "siren.png",
    "traffic-lights.png",
    "alert.png",
    "car-2.png",
    "car-3.png",
    "traffic-circle.png",
    "warning.png",
    "police-hat.png",
    "badge.png",
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <style>
        {`
          @keyframes floating {
            0% {
              transform: translateY(100vh) rotate(0deg); /* Start from below the screen */
              opacity: 0.8; /* Slightly visible at the start */
            }
            100% {
              transform: translateY(-200vh) rotate(720deg); /* Move off the screen at the top */
              opacity: 0; /* Fade out completely */
            }
          }
        `}
      </style>
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={`/images/${image}`}
            alt={`Floating ${image}`}
            className="absolute w-10 h-10 opacity-80"
            style={{
              left: `${(index * 6) % 100}%`, // Spread images across the width
              bottom: `-${Math.random() * 300}px`, // Start further below the viewport
              animation: `floating ${50 + (index % 4) * 5}s linear infinite`, // Animation keeps running
              animationDelay: `${Math.random() * 5}s`, // Staggered start
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloatingShape;