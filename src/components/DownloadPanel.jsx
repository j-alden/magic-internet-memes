import React, { useEffect, useState } from 'react';
import { Button, LoadingOverlay } from '@mantine/core';
import { IconWand } from '@tabler/icons-react';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import GIF from 'gif.js';
import { fabric } from 'fabric';
import axios from 'axios';

// Helper function
//import downloadEditedImage from '../helpers/downloadEditedImage';
//import saveTempImage from '../helpers/downloadEditedImage';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const DownloadPanel = ({
  canvas,
  exportCanvas,
  enabled,
  setUploadedImageUrl,
  setEditedBlob,
  isGif,
  framesRef,
  stickersRef,
}) => {
  const [loading, setLoading] = useState(false);

  // Scales objects from working canvas to exported canvas
  const prepExportCanvas = () => {
    const exportWidth = exportCanvas.width;
    const exportHeight = exportCanvas.height;

    let scaleX = exportWidth / canvas.width;
    let scaleY = exportHeight / canvas.height;

    let objects = canvas.getObjects();
    console.log(objects);

    for (var i in objects) {
      let scaledObject = objects[i];
      scaledObject.scaleX = scaledObject.scaleX * scaleX;
      scaledObject.scaleY = scaledObject.scaleY * scaleY;
      scaledObject.left = scaledObject.left * scaleX;
      scaledObject.top = scaledObject.top * scaleY;
      //scaledObject.setCoords();

      exportCanvas.add(scaledObject);
    }
    exportCanvas.discardActiveObject();
    exportCanvas.renderAll();
    exportCanvas.calcOffset();
  };

  const saveTempImage = () => {
    if (exportCanvas) {
      prepExportCanvas(canvas, exportCanvas);

      // Prep blob to be stored
      const dataUrl = exportCanvas.toDataURL({ format: 'jpeg', quality: 0.9 });
      const blob = dataURLtoBlob(dataUrl);
      //const url = URL.createObjectURL(blob);
      return blob;
    }
  };

  // Generate blob image based on GIF or image
  const downloadImage = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 100)); // Force UI update

    let blob_url;
    if (isGif) {
      // Testing getting transformation data
      // const transformedStickers = {};

      // Object.keys(stickersRef.current).forEach((frameIndex) => {
      //   const frameStickers = stickersRef.current[frameIndex];
      //   transformedStickers[frameIndex] = frameStickers.map((sticker) => {
      //     // Calculate the transformation matrix
      //     const transformMatrix = sticker.calcTransformMatrix();
      //     console.log(sticker);
      //     // Format the sticker data to include only the necessary properties
      //     return {
      //       left: sticker.left,
      //       top: sticker.top,
      //       width: sticker.width,
      //       height: sticker.height,
      //       scaleX: sticker.scaleX,
      //       scaleY: sticker.scaleY,
      //       angle: sticker.angle,
      //       skewX: sticker.skewX,
      //       skewY: sticker.skewY,
      //       flipX: sticker.flipX,
      //       flipY: sticker.flipY,
      //       src: sticker.getSrc(),
      //       transformMatrix: transformMatrix,
      //     };
      //   });
      // });

      // // Convert the transformed stickers to JSON and send to the server

      // console.log(stickersRef.current);
      // uploadGifData(framesRef.current, transformedStickers);
      blob_url = await generateAndDownloadGIF();
    } else {
      const blob = saveTempImage(canvas, exportCanvas);
      setEditedBlob(blob);
      blob_url = URL.createObjectURL(blob);
    }
    // setEditedBlob(blob);
    // const blob_url = URL.createObjectURL(blob);
    setUploadedImageUrl(blob_url);
    setLoading(false);
  };

  // Testing doing gif generation server side
  const uploadGifData = async (frames, stickers) => {
    try {
      // API endpoint to your Vercel serverless function
      const endpoint = `${apiBaseUrl}/api/generate-gif`;

      // Create FormData to handle binary data
      const formData = new FormData();
      console.log('Building form');

      // Get frame delay
      const frameDelay = frames[0].delay;
      formData.append('delay', `${frameDelay}`);

      // Add frames to FormData
      frames.forEach((frame, index) => {
        const frameBlob = dataURLtoBlob(frameToDataURL(frame));
        formData.append(`frame-${index}`, frameBlob, `frame-${index}.png`);
      });

      console.log('Appending stickers');
      // Add stickers to FormData as JSON
      formData.append('stickers', JSON.stringify(stickers));

      // Make the POST request to the serverless function
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('response', response);

      // Handle the response
      const gifUrl = response.data;
      console.log('Generated GIF URL:', gifUrl);

      // Return the generated GIF URL
      return gifUrl;
    } catch (error) {
      console.error('Error uploading GIF data:', error);
      throw error;
    }
  };

  // Generate GIF for Viewing
  const generateAndDownloadGIF = async () => {
    return new Promise((resolve, reject) => {
      try {
        const gif = new GIF({
          workers: 2,
          quality: 10,
          workerScript: '/gif.worker.js',
        });

        const { width, height } = framesRef.current[0].dims;

        gif.setOptions({
          width: width,
          height: height,
        });

        const fabricCanvas = new fabric.Canvas();

        const processFrame = async (index) => {
          if (index >= framesRef.current.length) {
            gif.render();
            return;
          }

          const frame = framesRef.current[index];
          const { width, height } = frame.dims;

          await new Promise((resolve) => {
            fabricCanvas.clear();
            fabricCanvas.setWidth(width);
            fabricCanvas.setHeight(height);
            resolve();
          });

          const frameImage = await loadImage(frameToDataURL(frame));

          const fabricImage = new fabric.Image(frameImage, {
            left: 0,
            top: 0,
            selectable: false,
          });

          fabricCanvas.add(fabricImage);
          fabricCanvas.sendToBack(fabricImage);

          if (stickersRef.current[index]) {
            stickersRef.current[index].forEach((sticker) => {
              // const fabricSticker = new fabric.Image(sticker.getElement(), {
              //   left: sticker.left,
              //   top: sticker.top,
              //   scaleX: sticker.scaleX,
              //   scaleY: sticker.scaleY,
              //   angle: sticker.angle,
              //   originX: 'left',
              //   originY: 'top',
              //   skewX: sticker.skewX,
              //   skewY: sticker.skewY,
              //   flipX: sticker.flipX,
              //   flipY: sticker.flipY,
              // });
              // fabricCanvas.add(fabricSticker);
              fabricCanvas.add(sticker); // doesn't persist to future frames
            });
          }

          const canvasDataURL = fabricCanvas.toDataURL({ format: 'png' });
          const imageData = await dataURLToImageData(
            canvasDataURL,
            width,
            height
          );

          gif.addFrame(imageData, { copy: true, delay: frame.delay });

          await new Promise((resolve) => setTimeout(resolve, 0)); // Yield after each frame

          await processFrame(index + 1);
        };

        gif.on('finished', (blob) => {
          setEditedBlob(blob);
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          resolve(link.href);
        });

        processFrame(0);
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Button
        onClick={downloadImage}
        rightSection={<IconWand size={14} />}
        mt='xs'
        color='green'
        variant='outline'
        disabled={!enabled}
        fullWidth
      >
        {isGif ? 'Generage GIF' : 'Generate Image'}
      </Button>
    </>
  );
};
export default DownloadPanel;

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
