import React from "react";

export default function Header({ shapes, setShapes, title, setTitle }) {
  const exportJSON = () => {
    const fileData = { title, shapes };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fileData));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${title || "untitled"}.json`);
    downloadAnchor.click();
  };

  const importJSON = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      const loaded = JSON.parse(reader.result);
      setTitle(loaded.title || "untitled");
      setShapes(loaded.shapes || []);
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <div className="header">
      <input
        className="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="header-buttons">
        <label className="import-label">
          Import
          <input type="file" accept=".json" onChange={importJSON} hidden />
        </label>
        <button onClick={exportJSON}>Export</button>
      </div>
    </div>
  );
}