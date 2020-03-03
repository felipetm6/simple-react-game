import React, { useCallback, useEffect, useRef } from "react";
import { useGameView } from "../../hooks/gameHooks";
import Player from "../Player";
import { IDrawableComponent } from "../../types";

const Game = () => {
  const { width, height } = useGameView();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const player = useRef<IDrawableComponent>(null);

  const draw = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, width, height);

    player.current!.draw(context);
  }, [height, width]);

  useEffect(() => {
    setInterval(draw, 63);
  }, [draw]);

  return (
    <canvas ref={ref => (canvasRef.current = ref)} width={450} height={650}>
      <Player gameRef={player} />
    </canvas>
  );
};

export default Game;
