
import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-[0.05] animate-grid-slide"></div>
      <div className="absolute inset-0 bg-grid-pattern-diagonal bg-[length:50px_50px] opacity-[0.05] animate-grid-slide-reverse"></div>
    </div>
  );
};

export default AnimatedBackground;
