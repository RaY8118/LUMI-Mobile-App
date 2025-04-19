import { useNavigationState } from "@react-navigation/native";
import { useRef, useEffect, useState } from "react";

export default function useTabDirection() {
  const state = useNavigationState((state) => state);
  const prevRouteName = useRef(null);
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    const currentIndex = state?.index;
    const currentRoute = state?.routes?.[currentIndex]?.name;

    if (prevRouteName.current && currentRoute) {
      const prevIndex = state.routes.findIndex(
        (r) => r.name === prevRouteName.current,
      );
      const currIndex = state.routes.findIndex((r) => r.name === currentRoute);

      if (currIndex > prevIndex) {
        setDirection("right");
      } else if (currIndex < prevIndex) {
        setDirection("left");
      }
    }

    if (currentRoute) {
      prevRouteName.current = currentRoute;
    }
  }, [state?.index, state?.routes]);

  return direction;
}
