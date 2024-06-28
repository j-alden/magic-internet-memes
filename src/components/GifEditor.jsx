import React, { useEffect } from 'react';
import { ActionIcon, Group, Paper, Text } from '@mantine/core';
import {
  IconSquareArrowLeftFilled,
  IconSquareArrowRightFilled,
} from '@tabler/icons-react';
// GIF testing
import GIF from 'gif.js';
import { Carousel } from '@mantine/carousel'; // Import Carousel

const GifEditor = ({
  fabricCanvas,
  frames,
  framesRef,
  stickersRef,
  currentFrameIndex,
  setCurrentFrameIndex,
  handleStickerModification,
}) => {
  useEffect(() => {
    if (frames.length > 0) {
      renderFrame(frames[0]);
    }
  }, [frames]);
  // Draw stickers on the current frame
  const drawStickers = (frameIndex) => {
    if (!fabricCanvas) return; // Guard against null fabricCanvas

    // Clear the canvas to draw only the current frame's content
    fabricCanvas.clear();

    // Detach the event listener
    // Needed to avoid cascading sticker changes when sticker is added
    fabricCanvas.off('object:modified', handleStickerModification);

    if (stickersRef.current[frameIndex]) {
      stickersRef.current[frameIndex].forEach((sticker) => {
        fabricCanvas.add(sticker);
      });
    }
    fabricCanvas.renderAll(); // Ensure the canvas updates

    // Reattach the event listener
    fabricCanvas.on('object:modified', handleStickerModification);
  };

  // Generates an image for each frame and downloads a gif
  const generateAndDownloadGIF = () => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: '/gif.worker.js', // Ensure this path is correct
    });

    const { width, height } = framesRef.current[0].dims; // Get dimensions from the first frame

    // Set GIF dimensions
    gif.setOptions({
      width: width,
      height: height,
    });

    const fabricCanvas = new fabric.Canvas(); // Create a new Fabric.js canvas

    const processFrame = async (index) => {
      if (index >= framesRef.current.length) {
        gif.render();
        return;
      }

      const frame = framesRef.current[index];
      const { width, height } = frame.dims;

      // Clear the Fabric.js canvas
      fabricCanvas.clear();
      fabricCanvas.setWidth(width);
      fabricCanvas.setHeight(height);

      const frameImage = await loadImage(frameToDataURL(frame));

      // Create a Fabric.js image object for the frame and add it to the canvas
      const fabricImage = new fabric.Image(frameImage, {
        left: 0,
        top: 0,
        selectable: false, // Background frame should not be selectable
      });

      fabricCanvas.add(fabricImage);
      fabricCanvas.sendToBack(fabricImage); // Ensure the background is at the back

      // Draw stickers onto the Fabric.js canvas
      if (stickersRef.current[index]) {
        stickersRef.current[index].forEach((sticker) => {
          const fabricSticker = new fabric.Image(sticker.getElement(), {
            left: sticker.left,
            top: sticker.top,
            scaleX: sticker.scaleX,
            scaleY: sticker.scaleY,
            angle: sticker.angle,
            originX: 'left',
            originY: 'top',
          });
          fabricCanvas.add(fabricSticker);
        });
      }

      // Convert the Fabric.js canvas to a data URL and then to ImageData
      const canvasDataURL = fabricCanvas.toDataURL({ format: 'png' });
      const imageData = await dataURLToImageData(canvasDataURL, width, height);

      // Add the frame to the GIF
      gif.addFrame(imageData, { copy: true, delay: frame.delay });

      // Process the next frame
      processFrame(index + 1);
    };

    processFrame(0);

    gif.on('finished', (blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'final.gif';
      link.click();
    });
  };

  // Handle frame navigation
  const handleNextFrame = () => {
    console.log('next frame');

    if (currentFrameIndex < framesRef.current.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
      renderFrame(frames[currentFrameIndex + 1]);

      // setCurrentFrameIndex((prevIndex) => {
      //   const nextIndex = prevIndex + 1;
      //   renderFrame(framesRef.current[nextIndex]); // Render the next frame
      //   drawStickers(nextIndex); // Draw stickers for the next frame
      //   return nextIndex;
      // });
    }
  };

  const handlePreviousFrame = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1);
      renderFrame(frames[currentFrameIndex - 1]);
    }
  };

  // Handle frame selection from the carousel
  const handleFrameSelect = (frameIndex) => {
    setCurrentFrameIndex(frameIndex);
    renderFrame(frames[frameIndex]);
  };

  // Render individual GIF frame using Fabric.js
  const renderFrame = (frame) => {
    if (!fabricCanvas) return; // Guard against null fabricCanvas

    const { width, height } = frame.dims;

    // Clear the canvas and set size
    //fabricCanvas.clear();
    fabricCanvas.setWidth(width);
    fabricCanvas.setHeight(height);

    // Create a new canvas to draw the frame patch or complete frame
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    // Check if the frame has a patch or is a complete frame
    if (frame.patch) {
      const imageData = new ImageData(
        new Uint8ClampedArray(frame.patch),
        width,
        height
      );

      offscreenCtx.putImageData(imageData, 0, 0);
    } else if (frame.imageData) {
      const imageData = new ImageData(
        new Uint8ClampedArray(frame.imageData),
        width,
        height
      );
      offscreenCtx.putImageData(imageData, 0, 0);
    }

    // Convert the offscreen canvas to a data URL
    const imageURL = offscreenCanvas.toDataURL();

    // Add the frame as an image object in Fabric.js
    fabric.Image.fromURL(imageURL, (img) => {
      fabricCanvas.setBackgroundImage(
        img,
        fabricCanvas.renderAll.bind(fabricCanvas)
      );
    });
    // Draw stickers on the current frame
    drawStickers(currentFrameIndex);
  };

  return (
    <Paper>
      <Group justify='space-between' gap='xs' wrap={false} mw='100%'>
        <ActionIcon
          variant='transparent'
          style={{ flex: '0 0 auto' }}
          onClick={handlePreviousFrame}
        >
          <IconSquareArrowLeftFilled size={30} />
        </ActionIcon>
        <Carousel
          style={{ flex: '1 1 auto' }}
          dragFree={true}
          //speed={1}
          slideSize='75px'
          slideGap='0px'
          align='start'
          withControls={false}
          breakpoints={[
            { maxWidth: 'lg', slideSize: '20%' },
            { maxWidth: 'md', slideSize: '20%' },
            { maxWidth: 'sm', slideSize: '20%' },
          ]}
          onNextSlide={handleNextFrame}
          onPreviousSlide={() => handlePreviousFrame()}
        >
          {frames.map((frame, index) => (
            <Carousel.Slide key={index}>
              <div
                style={{
                  width: '100%',
                  height: '100px',
                  backgroundImage: `url(${frameToDataURL(frame)})`,
                  backgroundSize: 'cover',
                  cursor: 'pointer',
                  border:
                    index === currentFrameIndex
                      ? '3px solid blue'
                      : '1px solid gray', // Highlight current frame
                }}
                onClick={() => handleFrameSelect(index)}
              >
                <Text>{index}</Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
        <ActionIcon
          variant='transparent'
          style={{ flex: '0 0 auto' }}
          onClick={handleNextFrame}
        >
          <IconSquareArrowRightFilled size={30} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};
export default GifEditor;

// Utility function to load an image from a data URL
const loadImage = (dataURL) => {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.src = dataURL;
  });
};

// Utility function to convert a data URL to ImageData
const dataURLToImageData = (dataURL, width, height) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const image = new window.Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      resolve(imageData);
    };
    image.src = dataURL;
  });
};

// Helper function to convert a frame to a data URL for the carousel preview
const frameToDataURL = (frame) => {
  const { width, height } = frame.dims;
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;
  const offscreenCtx = offscreenCanvas.getContext('2d');

  if (frame.patch) {
    const imageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height
    );
    offscreenCtx.putImageData(imageData, frame.dims.left, frame.dims.top);
  } else if (frame.imageData) {
    const imageData = new ImageData(
      new Uint8ClampedArray(frame.imageData),
      frame.dims.width,
      frame.dims.height
    );
    offscreenCtx.putImageData(imageData, 0, 0);
  }

  return offscreenCanvas.toDataURL();
};
