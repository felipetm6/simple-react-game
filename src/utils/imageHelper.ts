const imageLoader = async (path: string): Promise<HTMLImageElement> =>
  await new Promise(resolve => {
    const image = new Image();
    image.src = path;
    image.onload = () => {
      resolve(image);
    };
  });

const importAllImages = (resource: any): string[] =>
  resource.keys().map(resource);

export { imageLoader, importAllImages };
