import React from "react";
import { useDrag } from "react-dnd";

const Shape = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "shape",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  // Define a small size for the sidebar preview shapes
  const previewSize = 40; // Adjust as needed

  return (
    <div
      ref={drag}
      className={`shape-btn`} // Removed ${type} here, styling is now based on inner content
      style={{ opacity: isDragging ? 0.5 : 1, width: previewSize + 20, height: previewSize + 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
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
        <div className={`sidebar-shape-preview ${type}`} style={{ width: previewSize, height: previewSize }} />
      )}
    </div>
  );
};

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Shape type="circle" />
      <Shape type="square" />
      <Shape type="triangle" />
    </div>
  );
}
