import { RefObject, useEffect, useRef } from "react";

export const useWheelStep = (
  ref: RefObject<HTMLElement | null>,
  onStep: (direction: 1 | -1) => void,
  enabled = true,
) => {
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onStepRef.current(event.deltaY > 0 ? 1 : -1);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [ref, enabled]);
};
