import React from "react";
import { useDrop } from "react-dnd";
import resizeIcon from "../assets/resize.svg"; // <-- Make sure this image exists in src/assets/

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
        size: 60
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
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    const shape = shapes.find(s => s.id === shapeId);
    const startSize = shape.size;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
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

        if (shape.type === "triangle") {
          return (
            <svg
              key={shape.id}
              className="shape"
              style={style}
              onDoubleClick={() => deleteShape(shape.id)}
              viewBox="0 0 100 100"
            >
              <polygon points="50,0 100,100 0,100" stroke="black" strokeWidth="2" fill="transparent" />
              <image
                href={resizeIcon}
                x="80"
                y="80"
                width="16"
                height="16"
                style={{ cursor: "se-resize" }}
                onMouseDown={(e) => handleResize(e, shape.id)}
              />
            </svg>
          );
        }

        return (
          <div
            key={shape.id}
            className={`shape ${shape.type}`}
            style={style}
            onDoubleClick={() => deleteShape(shape.id)}
          >
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
