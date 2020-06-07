import { useCallback, useEffect } from "react";

export const useOutsideClick = (element, callback) => {
  const handleClick = useCallback(
    (event) => {
      if (!element || !element.contains(event.target)) {
        callback();
      }
    },
    [element, callback]
  );

  useEffect(() => {
    if (!element) {
      return;
    }
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [element]);
};
