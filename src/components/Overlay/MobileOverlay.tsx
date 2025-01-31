import React from "react";
import { MobileView } from "react-device-detect";

const MobileOverlay = () => {
  return (
    <MobileView>
      <div className="flex flex-col w-screen h-screen items-center justify-center">
        <img src="/blokus-logo-shorter.png" alt="logo" width="70px" />
        <h2 className="text-[22px] mt-4 mb-20 text-white font-bold drop-shadow-2xl">
          Not available on mobile
        </h2>
      </div>
    </MobileView>
  );
};

export default MobileOverlay;
