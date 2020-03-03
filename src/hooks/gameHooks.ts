import { useCallback, useEffect, useState } from "react";

const useGameView = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  const [aspectRatio, setAspectRatio] = useState(width / height || 1);
  const onResize = useCallback(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
    setAspectRatio(window.innerHeight * aspectRatio);
  }, [aspectRatio]);

  useEffect(() => {
    document.addEventListener("resize", onResize);

    return () => document.removeEventListener("resize", onResize);
  }, [onResize]);

  return { width, height, aspectRatio };
};

export { useGameView };
