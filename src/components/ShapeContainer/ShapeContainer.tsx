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
        backgroundColor: "rgba(8, 9, 10, 0.2)",
        height: "100vh",
        paddingLeft: "5vw",
      }}
    >
      {children}
    </div>
  );
};

export default ShapeContainer;
