import React from "react";
import { useDrop } from "react-dnd";
import resizeIcon from "../assets/resize.svg"; // Make sure this image exists in src/assets/

export default function Canvas({ shapes, setShapes }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "shape",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = document.getElementById("canvas").getBoundingClientRect();
      const newShape = {
        id: Date.now(),
        type: item.type,
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top,
        size: 60 // Initial size for all shapes
      };
      setShapes(prev => [...prev, newShape]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const deleteShape = (id) => {
    setShapes(shapes.filter(shape => shape.id !== id));
  };

  const handleResize = (e, shapeId) => {
    e.stopPropagation(); // Prevent canvas drop event from firing
    const startX = e.clientX;
    const startY = e.clientY;

    const shape = shapes.find(s => s.id === shapeId);
    const startSize = shape.size;

    const onMouseMove = (moveEvent) => {
      // Calculate change in position from where the drag started
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      // Update size based on the larger of dx or dy to maintain aspect ratio
      // Ensure a minimum size of 10px
      const newSize = Math.max(10, startSize + Math.max(dx, dy));
      setShapes(prev =>
        prev.map(s => s.id === shapeId ? { ...s, size: newSize } : s)
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div id="canvas" ref={drop} className="canvas" style={{ background: isOver ? "#f0f0f0" : "#fff" }}>
      {shapes.map(shape => {
        const style = {
          position: "absolute",
          top: shape.y,
          left: shape.x,
          width: shape.size,
          height: shape.size
        };

        return (
          // Common wrapper div for all shapes to apply positioning and size
          // Also acts as the relative container for the resize handle
          <div
            key={shape.id}
            className={`shape ${shape.type}`} // Now apply shape.type class here
            style={style}
            onDoubleClick={() => deleteShape(shape.id)}
          >
            {shape.type === "triangle" ? (
              // SVG for triangle for better scaling and drawing control
              <svg
                width="100%" // Make SVG fill its parent div's width
                height="100%" // Make SVG fill its parent div's height
                viewBox="0 0 100 100" // Define the internal coordinate system for the polygon
                preserveAspectRatio="none" // Allow the triangle to stretch/squash with the div's size
              >
                {/* Polygon points define an equilateral triangle within the 0-100 viewBox */}
                {/* Stroke and fill are set here to match the desired appearance */}
                <polygon points="50,0 100,100 0,100" stroke="black" strokeWidth="2" fill="transparent" />
              </svg>
            ) : (
              // Simple div for circle and square, styled by CSS
              <div className="shape-content" style={{ width: "100%", height: "100%" }} />
            )}
            {/* The resize handle is now always an HTML img element,
                positioned absolutely relative to the parent 'shape' div */}
            <img
              src={resizeIcon}
              alt="resize"
              className="resize-handle"
              onMouseDown={(e) => handleResize(e, shape.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
