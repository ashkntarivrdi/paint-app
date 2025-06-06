import React from "react";

export default function ShapeCounter({ shapes }) {
  const count = shapes.reduce((acc, shape) => {
    acc[shape.type] = (acc[shape.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="counter">
      {["circle", "square", "triangle"].map(type => (
        <span key={type}>{type}: {count[type] || 0} </span>
      ))}
    </div>
  );
}
