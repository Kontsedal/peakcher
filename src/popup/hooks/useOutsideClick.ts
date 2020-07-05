import { useCallback, useEffect } from "react";

export const useOutsideClick = (
  element,
  callback,
  { excludedClasses = [] } = {}
) => {
  const handleClick = useCallback(
    (event) => {
      const isExcluded = Array.from(event.target.classList).some((item) =>
        excludedClasses.includes(item)
      );
      if (isExcluded) {
        return;
      }
      if (!element || (element.contains && !element.contains(event.target))) {
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
