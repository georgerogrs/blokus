import React, { useState } from "react";
import Block from "../Block";
import Draggable from "react-draggable";

const Shape = () => {
  const [cursorState, setCursorState] = useState("grab");

  const handleDrag = () => {
    setCursorState("grabbing");
  };

  const handleStop = () => {
    setCursorState("grab");
  };

  return (
    <Draggable onDrag={handleDrag} onStop={handleStop}>
      <div style={{ cursor: cursorState }}>
        <Block />
        <Block />
        <Block />
      </div>
    </Draggable>
  );
};

export default Shape;
