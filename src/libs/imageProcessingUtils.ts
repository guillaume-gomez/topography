
export async function loadImage(imagepath: string): Promise<Image> {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imagepath;
  })
}


export function pixelsDataConvertedToGray(image: HTMLImageElement): ImageData {
  const { width, height } = image;
  const offscreenCanvas = new OffscreenCanvas(width, height);

  const context = offscreenCanvas.getContext("2d");
  if(!context) {
    throw new Error("Cannot create context from offScreenCanvas");
  }
  context.drawImage(image, 0, 0);
  
  convertToGrayScale(context, width, height);

  return context.getImageData(0, 0, width, height);
}

function convertToGrayScale(context: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = context.getImageData(0, 0, width, height);
  for (let i = 0; i < imageData.data.length; i += 4) {
   const red = imageData.data[i];
   const green = imageData.data[i + 1];
   const blue = imageData.data[i + 2];
   // use gimp algorithm to generate prosper grayscale
   const gray = (red * 0.3 + green * 0.59 + blue * 0.11);

   imageData.data[i] = gray;
   imageData.data[i + 1] = gray;
   imageData.data[i + 2] = gray;
   imageData.data[i + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
}