import { useState } from "react";

export const useToggleState = (initialValue = false) => {
  const [stateVariable, setStateVariable] = useState<boolean>(initialValue);

  const toggleState = () => {
    setStateVariable((prev) => !prev);
  };

  return [stateVariable, toggleState];
};
