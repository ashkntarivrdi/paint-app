import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import ShapeCounter from "./components/ShapeCounter";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function App() {
  const [shapes, setShapes] = useState([]);
  const [title, setTitle] = useState("untitled");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <Header
          shapes={shapes}
          setShapes={setShapes}
          title={title}
          setTitle={setTitle}
        />
        <div className="main">
          <Canvas shapes={shapes} setShapes={setShapes} />
          <Sidebar />
        </div>
        <ShapeCounter shapes={shapes} />
      </div>
    </DndProvider>
  );
}
