import React, { useState, useRef, useCallback } from "react"; // Import useRef and useCallback
import { useDrop } from "react-dnd";
import resizeIcon from "../assets/resize.svg"; // Make sure this image exists in src/assets/

export default function Canvas({ shapes, setShapes }) {
  // State for rendering cursor and identifying the dragged shape
  const [draggedShapeId, setDraggedShapeId] = useState(null);

  // Ref to store mutable drag-related coordinates and flags
  const dragState = useRef({
    isDragging: false,
    initialMouseX: 0,
    initialMouseY: 0,
    initialShapeX: 0,
    initialShapeY: 0,
    currentShapeId: null, // Store id in ref for consistent access
  });

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

  // Handler for starting the resize
  const handleResize = useCallback((e, shapeId) => {
    e.stopPropagation(); // Prevent drag from starting if resize handle is clicked
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
  }, [shapes, setShapes]); // Depend on shapes and setShapes

  // Handler for moving a shape - memoized with useCallback
  const handleShapeMouseMove = useCallback((e) => {
    if (!dragState.current.isDragging) return;

    const dx = e.clientX - dragState.current.initialMouseX;
    const dy = e.clientY - dragState.current.initialMouseY;

    setShapes(prevShapes =>
      prevShapes.map(s =>
        s.id === dragState.current.currentShapeId
          ? {
              ...s,
              x: dragState.current.initialShapeX + dx,
              y: dragState.current.initialShapeY + dy
            }
          : s
      )
    );
  }, [setShapes]); // Depends on setShapes

  // Handler for ending the drag of a shape - memoized with useCallback
  const handleShapeMouseUp = useCallback(() => {
    dragState.current.isDragging = false;
    dragState.current.currentShapeId = null;
    setDraggedShapeId(null); // Reset state for cursor

    document.removeEventListener("mousemove", handleShapeMouseMove);
    document.removeEventListener("mouseup", handleShapeMouseUp);
  }, [handleShapeMouseMove]); // Depends on handleShapeMouseMove

  // Handler for starting the drag of a shape
  const handleShapeMouseDown = useCallback((e, shape) => {
    // Check if the target is the resize handle, if so, don't start dragging the shape
    if (e.target.classList.contains("resize-handle")) {
        return;
    }

    e.stopPropagation(); // Prevent canvas drop event from firing when clicking a shape

    // Update ref with current drag start info
    dragState.current.isDragging = true;
    dragState.current.currentShapeId = shape.id;
    dragState.current.initialMouseX = e.clientX;
    dragState.current.initialMouseY = e.clientY;
    dragState.current.initialShapeX = shape.x;
    dragState.current.initialShapeY = shape.y;

    setDraggedShapeId(shape.id); // Update state for cursor

    // Attach global listeners for dragging
    document.addEventListener("mousemove", handleShapeMouseMove);
    document.addEventListener("mouseup", handleShapeMouseUp);
  }, [handleShapeMouseMove, handleShapeMouseUp]); // Dependencies for useCallback

  return (
    <div id="canvas" ref={drop} className="canvas" style={{ background: isOver ? "#f0f0f0" : "#fff" }}>
      {shapes.map(shape => {
        const style = {
          position: "absolute",
          top: shape.y,
          left: shape.x,
          width: shape.size,
          height: shape.size,
          // Add cursor style to indicate draggable
          cursor: draggedShapeId === shape.id ? "grabbing" : "grab" // Use draggedShapeId from state
        };

        return (
          // Add onMouseDown to the shape wrapper for dragging
          <div
            key={shape.id}
            className={`shape ${shape.type}`}
            style={style}
            onDoubleClick={() => deleteShape(shape.id)}
            onMouseDown={(e) => handleShapeMouseDown(e, shape)} // Attach drag handler
          >
            {shape.type === "triangle" ? (
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polygon points="50,0 100,100 0,100" stroke="black" strokeWidth="2" fill="transparent" />
              </svg>
            ) : (
              <div className="shape-content" style={{ width: "100%", height: "100%" }} />
            )}
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
