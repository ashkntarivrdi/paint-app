import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import ShapeCounter from "./components/ShapeCounter";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function App() {
  const [shapes, setShapes] = useState([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <Header shapes={shapes} setShapes={setShapes} />
        <div className="main">
          <Sidebar />
          <Canvas shapes={shapes} setShapes={setShapes} />
        </div>
        <ShapeCounter shapes={shapes} />
      </div>
    </DndProvider>
  );
}
