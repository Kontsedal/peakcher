import React, { useEffect, useState } from "react";
import { UploadIndicatorView } from "./view";

export default { title: "Upload indicator" };

export const ten = () => <UploadIndicatorView progress={10} />;
export const thirty = () => <UploadIndicatorView progress={30} />;
export const fifty = () => <UploadIndicatorView progress={50} />;
export const seventy = () => <UploadIndicatorView progress={50} />;
export const ninety = () => <UploadIndicatorView progress={90} />;
export const hundred = () => <UploadIndicatorView progress={10} />;
export const animated = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((progress) => {
        const newProgress = progress + 5;
        if (newProgress > 100) {
          return 0;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  });
  return <UploadIndicatorView progress={progress} />;
};
