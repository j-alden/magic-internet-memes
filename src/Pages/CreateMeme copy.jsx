// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { fabricGif } from '../helpers/giftest.ts';
import _ from 'lodash';
// Styling
import '@mantine/core/styles.css';
import {
  MantineProvider,
  AppShell,
  Title,
  Image,
  Paper,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import styled from 'styled-components';

// Components
import StickerPanel from '../components/StickerPanel.jsx';
import CanvasTools from '../components/CanvasTools.jsx';
import DownloadPanel from '../components/DownloadPanel.jsx';
import ViewMeme from '../components/ViewMeme.jsx';
import GifEditor from '../components/GifEditor.jsx';

// Routing
import UploadImage from '../components/UploadImage.jsx';

// GIF testing
import { parseGIF, decompressFrames } from 'gifuct-js';
import GIF from 'gif.js';
import { v4 as uuidv4 } from 'uuid'; // Use uuid for unique sticker IDs
import { Carousel } from '@mantine/carousel'; // Import Carousel

// Styled components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

const CanvasWrapper = styled.div`
  border: 2px solid #d9d9d9;
  position: relative;
`;
const MAX_IMAGE_DIMENSION = 2048; // Limit the maximum dimension of the image to 2048px

const CreateMeme2 = () => {
  const canvasRef = useRef(null); // canvas for UI
  const exportCanvasRef = useRef(null); // canvas for exported image
  //const [opened, { toggle }] = useDisclosure();

  const [exportCanvas, setExportCanvas] = useState(null);
  const [enableButtons, setEnableButtons] = useState(false);
  const [editedBlob, setEditedBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(false);

  // GIF TESTING
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [frames, setFrames] = useState([]);
  const framesRef = useRef(frames); // Ref to track current frame index

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const currentFrameIndexRef = useRef(currentFrameIndex); // Ref to track current frame index

  const [stickers, setStickers] = useState({});
  const stickersRef = useRef(stickers); // Ref to track stickers
  const [isGif, setIsGif] = useState(false);

  // Update refs when state changes
  // Need this for sticker modification to work
  useEffect(() => {
    currentFrameIndexRef.current = currentFrameIndex;
    framesRef.current = frames;
    stickersRef.current = stickers;
  }, [currentFrameIndex, frames, stickers]);

  // Initialize Fabric canvas only once
  useEffect(() => {
    // UI canvas
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
      allowTouchScrolling: true,
    });
    setFabricCanvas(newCanvas);

    // Set up selection controls
    newCanvas.on('object:modified', handleStickerModification);
    newCanvas.on('custom:stickerskewed', handleStickerModification);
    newCanvas.on('custom:stickerflipped', handleStickerModification);
    newCanvas.on('custom:stickerlayerchanged', handleStickerModification); // Doesn't work
    newCanvas.on('custom:stickerremoved', handleStickerRemoval);

    // Export canvas
    const newExportCanvas = new fabric.Canvas(exportCanvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
    });

    // Set up selection controls
    // newExportCanvas.on('object:modified', () => {
    //   newExportCanvas.renderAll();
    // });
    // newExportCanvas.on('object:added', () => {
    //   newExportCanvas.renderAll();
    // });
    setExportCanvas(newExportCanvas);
  }, []);

  // Handle sticker modifications to propagate changes to future frames
  const handleStickerModification = async (event) => {
    const modifiedSticker = event.target;

    // Use currentFrameIndexRef to get the current frame index value
    const currentIndex = currentFrameIndexRef.current;

    // Create a copy of the stickers state to update
    const newStickers = { ...stickersRef.current };

    // Propagate changes to all future frames
    for (let i = currentIndex + 1; i < framesRef.current.length; i++) {
      const frameStickers = newStickers[i];
      if (frameStickers) {
        // Find the sticker in the frame
        const sticker = frameStickers.find(
          (sticker) => sticker.id === modifiedSticker.id
        );
        if (sticker) {
          // Update the sticker with modified properties
          sticker.set(modifiedSticker);
        }
      }
    }

    // Update the stickers state to reflect changes for re-rendering
    setStickers(newStickers); // This will trigger a re-render
  };

  const handleStickerRemoval = async (event) => {
    const removedSticker = event.target;

    // Use currentFrameIndexRef to get the current frame index value
    const currentIndex = currentFrameIndexRef.current;

    // Create a copy of the stickers state to update
    const newStickers = { ...stickersRef.current };

    // Iterate over the current and following frames to remove the sticker
    for (let i = currentIndex; i < framesRef.current.length; i++) {
      const frameStickers = newStickers[i];
      if (frameStickers) {
        // Remove the sticker with the same id from the frame's stickers array
        newStickers[i] = frameStickers.filter(
          (sticker) => sticker.id !== removedSticker.id
        );
      }
    }

    // Update the stickers state to reflect changes for re-rendering
    setStickers(newStickers); // This will trigger a re-render
  };

  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    //const file = acceptedFiles[0];
    const file = acceptedFiles;

    reader.onload = async (e) => {
      if (file.type === 'image/gif') {
        setIsGif(true);
        const buffer = await file.arrayBuffer();
        const gif = parseGIF(buffer);
        const gifFrames = decompressFrames(gif, true);
        setFrames(gifFrames);
        setEnableButtons(true);
      } else {
        // Maintain larger canvas in background for higher quality image download
        fabric.Image.fromURL(e.target.result, (img) => {
          // Set background canvas for export at original dimensions
          const exportImg = img;

          // Resize if too large
          let scaleFactor = 1;
          if (
            exportImg.width > MAX_IMAGE_DIMENSION ||
            exportImg.height > MAX_IMAGE_DIMENSION
          ) {
            scaleFactor =
              MAX_IMAGE_DIMENSION / Math.max(exportImg.width, exportImg.height);
          }

          exportImg.scale(scaleFactor);

          exportCanvas.clear();
          exportCanvas.setWidth(exportImg.width * scaleFactor);
          exportCanvas.setHeight(exportImg.height * scaleFactor);

          exportCanvas.setBackgroundImage(
            exportImg,
            exportCanvas.renderAll.bind(exportCanvas)
          );

          exportCanvas.renderAll();

          // Enabled Delete and Save buttons
          setEnableButtons(true);
        });

        // Maintain a smaller canvas on UI that is scaled to window size
        fabric.Image.fromURL(e.target.result, async (img) => {
          // Handle non-GIF images (existing logic)
          let scaleFactor = getScaleValue(img);

          img.set({
            scaleX: scaleFactor,
            scaleY: scaleFactor,
          });

          // Clear the canvas
          fabricCanvas.clear();

          // Set the canvas dimensions to match the image dimensions
          fabricCanvas.setWidth(img.width * scaleFactor);
          fabricCanvas.setHeight(img.height * scaleFactor);

          fabricCanvas.setBackgroundImage(
            img,
            fabricCanvas.renderAll.bind(fabricCanvas)
          );

          // Set CSS dimensions of the canvas for consistency
          const canvasElement = canvasRef.current;
          if (canvasElement) {
            canvasElement.style.width = '100%';
            canvasElement.style.height = 'auto';
          }

          fabricCanvas.renderAll();
          // Enabled Delete and Save buttons
          setEnableButtons(true);
        });
      }
    };

    reader.readAsDataURL(file);
  };

  // Determines value to scale image and canvas to fit screen window
  const getScaleValue = (img) => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // Limit the maximum dimensions of the image
    let scaleFactor = 1;

    if (img.width > maxWidth || img.height > maxHeight) {
      const scaleWidth = maxWidth / img.width;
      const scaleHeight = maxHeight / img.height;
      scaleFactor = Math.min(scaleWidth, scaleHeight);
    }

    return scaleFactor;
  };
  if (editedBlob) {
    return <ViewMeme editedBlob={editedBlob} isGif={isGif} />;
  } else {
    return (
      <>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {/* {!enableButtons ? <UploadPanel onDrop={onDrop} /> : null} */}
        {!enableButtons ? <UploadImage onDrop={onDrop} /> : null}
        {enableButtons ? (
          <DownloadPanel
            enabled={enableButtons}
            canvas={fabricCanvas}
            exportCanvas={exportCanvas}
            setUploadedImageUrl={setUploadedImageUrl}
            // setLoading={setLoading}
            // loading={loading}
            setEditedBlob={setEditedBlob}
            isGif={isGif}
            framesRef={framesRef}
            stickersRef={stickersRef}
          />
        ) : null}
        <StickerPanel
          canvas={fabricCanvas}
          isGif={isGif}
          gifStickers={stickersRef}
          //addGifSticker={addSticker}
          setStickers={setStickers}
          currentFrameIndexRef={currentFrameIndexRef}
          framesRef={framesRef}
        />

        <CanvasTools
          enabled={enableButtons}
          canvas={fabricCanvas}
          isGif={isGif}
          setStickers={setStickers}
        />
        <Container>
          <CanvasWrapper>
            {!enableButtons ? (
              <Title
                order={2}
                style={{ margin: '20px', alignContent: 'center' }}
              >
                Upload image or GIF to start the magic
                {/* <IconWand /> */}
                <Image
                  src='/ogwizzybare_grayscale.png'
                  mah='200px'
                  //maw='50%'
                  fit='contain'
                  style={{ margin: 20 }}
                />
              </Title>
            ) : null}
            <canvas ref={canvasRef} id='canvas' />
          </CanvasWrapper>
        </Container>
        {isGif ? (
          <GifEditor
            fabricCanvas={fabricCanvas}
            frames={frames}
            framesRef={framesRef}
            stickersRef={stickersRef}
            currentFrameIndex={currentFrameIndex}
            setCurrentFrameIndex={setCurrentFrameIndex}
            handleStickerModification={handleStickerModification}
          />
        ) : null}
      </>
    );
  }
};
export default CreateMeme2;
