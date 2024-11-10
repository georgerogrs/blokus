import React from "react";
import { BLOCK_SIZE } from "../../gameSettings";

const Block = () => {
  return (
    <div
      className="rounded-sm border-black"
      style={{
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        backgroundColor: "red",
        borderWidth: "0.5px",
      }}
    />
  );
};

export default Block;