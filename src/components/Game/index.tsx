import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGameView } from "../../hooks/gameHooks";
import { imageLoader, importAllImages } from "../../utils/imageHelper";
const imageResources: string[] = importAllImages(
  require.context("images/sprites/boy/walk/", false, /\.(png|jpe?g|svg)$/)
);

const Game = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const { width, height } = useGameView();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrame = useRef<number>(0);

  const draw = useCallback(() => {
    if (!canvasRef.current || !images.length) {
      return;
    }
    const context = canvasRef.current.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, width, height);

    context.drawImage(images[currentFrame.current], 0, 0);
    currentFrame.current =
      currentFrame.current < images.length - 1 ? currentFrame.current + 1 : 0;
  }, [height, images, width]);

  useEffect(() => {
    setInterval(draw, 63);
  }, [draw]);

  useEffect(() => {
    const preloadImages = async () => {
      const preloadedImages: HTMLImageElement[] = await Promise.all(
        imageResources.map(path => imageLoader(path))
      );

      setImages(preloadedImages);
    };

    preloadImages();
  }, []);

  return (
    <canvas ref={ref => (canvasRef.current = ref)} width={450} height={650}>
      <p>a</p>
    </canvas>
  );
};

export default Game;
