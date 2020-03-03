import React, { Key, MutableRefObject, useRef } from "react";
import { imageLoader, importAllImages } from "../../utils/imageHelper";
import { useEffect, useState } from "react";
import { IDrawableComponent } from "../../types";

type Props = {
  gameRef: MutableRefObject<IDrawableComponent | null>;
};

const movingKeys = ["a", "d"];

const Player = ({ gameRef }: Props) => {
  const position = useRef({ x: 0, y: 0 });
  const size = 100;
  const [imageSet, setImageSet] = useState<{
    idle: HTMLImageElement[];
    walking: HTMLImageElement[];
  }>({ idle: [], walking: [] });
  const [animation, setAnimation] = useState<HTMLImageElement[]>([]);
  const currentFrame = useRef<number>(0);
  const orientation = useRef<1 | -1>(1);
  const moving = useRef<boolean>(false);

  const draw = (context: CanvasRenderingContext2D) => {
    if (!animation.length) {
      return;
    }

    const frame = currentFrame.current;

    context.save();

    context.translate(position.current.x, position.current.y);
    context.scale(orientation.current, 1);
    context.drawImage(animation[frame], 0, 0, size, size);

    context.restore();

    currentFrame.current = frame < animation.length - 1 ? frame + 1 : 0;

    if (moving.current) {
      position.current.x += 2.5 * orientation.current;
    }
  };

  gameRef.current = { draw };

  useEffect(() => {
    const onKeyDown = ({ key }: KeyboardEvent) => {
      if (movingKeys.includes(key)) {
        setAnimation([...imageSet.walking]);
        orientation.current = key === "d" ? 1 : -1;

        if (!moving.current) {
          currentFrame.current = 0;
        }

        moving.current = true;
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [imageSet.idle, imageSet.walking]);

  useEffect(() => {
    const onKeyUp = () => {
      setAnimation([...imageSet.idle]);
      currentFrame.current = 0;
      moving.current = false;
    };

    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [imageSet.idle, imageSet.walking]);

  useEffect(() => {
    const preloadImages = async () => {
      const newImageSet: {
        idle: HTMLImageElement[];
        walking: HTMLImageElement[];
      } = { idle: [], walking: [] };

      newImageSet.idle = await Promise.all(
        importAllImages(
          require.context(
            "images/sprites/boy/idle/",
            false,
            /\.(png|jpe?g|svg)$/
          )
        ).map(path => imageLoader(path))
      );
      newImageSet.walking = await Promise.all(
        importAllImages(
          require.context(
            "images/sprites/boy/walk/",
            false,
            /\.(png|jpe?g|svg)$/
          )
        ).map(path => imageLoader(path))
      );

      setImageSet({ ...newImageSet });
      setAnimation([...newImageSet.idle]);
    };

    preloadImages();
  }, []);

  return <></>;
};

export default Player;
