import React, { useEffect, useState } from "react";
import { UploadIndicatorView } from "./view";

export default { title: "Upload indicator" };

export const ten: React.FC = () => <UploadIndicatorView progress={10} />;
export const thirty: React.FC = () => <UploadIndicatorView progress={30} />;
export const fifty: React.FC = () => <UploadIndicatorView progress={50} />;
export const seventy: React.FC = () => <UploadIndicatorView progress={50} />;
export const ninety: React.FC = () => <UploadIndicatorView progress={90} />;
export const hundred: React.FC = () => <UploadIndicatorView progress={10} />;
export const Animated: React.FC = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 5;
        if (newProgress > 100) {
          return 0;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [setProgress]);
  return <UploadIndicatorView progress={progress} />;
};
