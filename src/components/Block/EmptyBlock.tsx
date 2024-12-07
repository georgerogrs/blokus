import React from "react";
import { BLOCK_SIZE } from "../../utils/gameSettings";

const EmptyBlock = () => {
  return (
    <div
      style={{
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
      }}
    />
  );
};

export default EmptyBlock;
