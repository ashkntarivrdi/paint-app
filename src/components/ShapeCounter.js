import React from "react";

// Helper component to render a small shape preview
const ShapePreview = ({ type }) => {
  const previewSize = 20; // Smaller size for counter display

  return (
    <div className="counter-shape-container"> {/* Container for padding/border */}
      {type === "triangle" ? (
        <svg
          width={previewSize}
          height={previewSize}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="50,0 100,100 0,100" stroke="black" strokeWidth="2" fill="transparent" />
        </svg>
      ) : (
        <div className={`counter-shape-preview ${type}`} style={{ width: previewSize, height: previewSize }} />
      )}
    </div>
  );
};

export default function ShapeCounter({ shapes }) {
  const count = shapes.reduce((acc, shape) => {
    acc[shape.type] = (acc[shape.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="counter">
      {["circle", "square", "triangle"].map(type => (
        <span key={type} className="counter-item">
          <ShapePreview type={type} />
          {count[type] || 0}
        </span>
      ))}
    </div>
  );
}
