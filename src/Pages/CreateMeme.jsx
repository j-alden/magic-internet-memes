// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
// Styling
import '@mantine/core/styles.css';
import {
  MantineProvider,
  AppShell,
  Title,
  Image,
  Paper,
  LoadingOverlay,
} from '@mantine/core';
import styled from 'styled-components';

// Components
import Header from '../components/Header.jsx';
import StickerPanel from '../components/StickerPanel.jsx';
import Footer from '../components/Footer.jsx';
import UploadPanel from '../components/UploadPanel.jsx';
import CanvasTools from '../components/CanvasTools.jsx';
import DownloadPanel from '../components/DownloadPanel.jsx';
import UploadStickerPanel from '../components/UploadStickerPanel.jsx';
import ViewMeme from '../components/ViewMeme.jsx';

// Routing
import { Outlet } from 'react-router-dom';
import Louvre from './Louvre.jsx';
import Layout from '../components/Layout.jsx';

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

const CreateMeme = () => {
  const canvasRef = useRef(null); // canvas for UI
  const exportCanvasRef = useRef(null); // canvas for exported image
  //const [opened, { toggle }] = useDisclosure();

  const [canvas, setCanvas] = useState(null);
  const [exportCanvas, setExportCanvas] = useState(null);
  const [enableButtons, setEnableButtons] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize Fabric canvas only once
  useEffect(() => {
    // UI canvas
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
      allowTouchScrolling: true,
    });

    // Set up selection controls
    newCanvas.on('object:modified', () => {
      newCanvas.renderAll();
    });
    newCanvas.on('object:added', () => {
      newCanvas.renderAll();
    });

    setCanvas(newCanvas);

    // Export canvas
    const newExportCanvas = new fabric.Canvas(exportCanvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
    });

    // Set up selection controls
    newExportCanvas.on('object:modified', () => {
      newExportCanvas.renderAll();
    });
    newExportCanvas.on('object:added', () => {
      newExportCanvas.renderAll();
    });

    setExportCanvas(newExportCanvas);
  }, []);

  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];

    reader.onload = (e) => {
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
      fabric.Image.fromURL(e.target.result, (img) => {
        let scaleFactor = getScaleValue(img);

        img.set({
          scaleX: scaleFactor,
          scaleY: scaleFactor,
        });

        // Clear the canvas
        canvas.clear();

        // Set the canvas dimensions to match the image dimensions
        canvas.setWidth(img.width * scaleFactor);
        canvas.setHeight(img.height * scaleFactor);

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

        // Set CSS dimensions of the canvas for consistency
        const canvasElement = canvasRef.current;
        if (canvasElement) {
          canvasElement.style.width = '100%';
          canvasElement.style.height = 'auto';
        }

        canvas.renderAll();
        // Enabled Delete and Save buttons
        setEnableButtons(true);
      });
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
  if (uploadedImageUrl) {
    return (
      <ViewMeme uploadedImageUrl={uploadedImageUrl} />

      // <Router>
      //   <Routes>
      //     {/* <Route path='/' element={<Layout />}>
      //       <Route index element={<CreateMeme />} />
      //       <Route path='/create' element={<CreateMeme />} />
      //       <Route path='louvre' element={<Louvre />} />
      //     </Route> */}
      //     <Route path='/' element={<CreateMeme />} />
      //     <Route path='/louvre' element={<Louvre />} />
      //     {/* <Route index element={<CreateMeme />} /> */}
      //     <Route path='/create' element={<CreateMeme />} />
      //   </Routes>
      // </Router>
    );
  } else {
    return (
      <>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        {!enableButtons ? <UploadPanel onDrop={onDrop} /> : null}
        {enableButtons ? (
          <DownloadPanel
            enabled={enableButtons}
            canvas={canvas}
            exportCanvas={exportCanvas}
            setUploadedImageUrl={setUploadedImageUrl}
            setLoading={setLoading}
          />
        ) : null}
        <StickerPanel canvas={canvas} />
        <CanvasTools enabled={enableButtons} canvas={canvas} />
        <Container>
          <CanvasWrapper>
            {!enableButtons ? (
              <Title
                order={2}
                style={{ margin: '20px', alignContent: 'center' }}
              >
                Upload image to start the magic
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
      </>
    );
  }
};
export default CreateMeme;
