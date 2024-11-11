import React from "react";

interface ShapeContainerProps {
  children: React.ReactNode;
}

const ShapeContainer = ({ children }: ShapeContainerProps) => {
  return (
    <div
      className="p-10 rounded-lg mt-10 w-25 h-25 flex flex-row space-x-20"
      style={{ alignItems: "center" }}
    >
      {children}
    </div>
  );
};

export default ShapeContainer;
