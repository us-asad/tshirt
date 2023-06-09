/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

export default function ZoomableImg({ src }) {
  const [position, setPosition] = useState("0% 0%");

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition(`${x}% ${y}%`);
  };

  return (
    <div className="overflow-hidden">
      <figure
        onMouseMove={handleMouseMove}
        style={{ backgroundImage: `url(${src})`, backgroundPosition: position, backgroundSize: "600px" }}
        className="bg-no-repeat group cursor-zoom-in"
      >
        <img
          src={src}
          alt="IMG"
          className="group-hover:opacity-0 pointer-events-none"
        />
      </figure>
    </div>
  );
}
