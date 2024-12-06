import React from "react";

interface ShapeContainerProps {
  children: React.ReactNode;
}

const ShapeContainer = ({ children }: ShapeContainerProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
};

export default ShapeContainer;
