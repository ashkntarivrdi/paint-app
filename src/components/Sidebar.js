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

  return (
    <div ref={drag} className={`shape-btn ${type}`} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {type}
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
