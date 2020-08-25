import { useCallback, useEffect } from "react";

export const useOutsideClick = (
  element: HTMLElement,
  callback: () => void,
  { excludedClasses }: { excludedClasses: string[] } = {
    excludedClasses: [],
  }
): void => {
  const handleClick = useCallback(
    (event) => {
      const isExcluded = Array.from(
        event.target.classList
      ).some((item: string) => excludedClasses.includes(item));
      if (isExcluded) {
        return;
      }
      if (!element || (element.contains && !element.contains(event.target))) {
        callback();
      }
    },
    [element, callback, excludedClasses]
  );

  useEffect(() => {
    if (!element) {
      return undefined;
    }
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [handleClick, element]);
};
