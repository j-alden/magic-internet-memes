// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import axios from 'axios';

// Styling
import '@mantine/core/styles.css';
import { MantineProvider, AppShell } from '@mantine/core';
import { theme } from './theme';

// Custom wizard font
import './assets/WizardFont.otf';

// Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ViewMeme from './components/ViewMeme.jsx';

// Routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Louvre from './Pages/Louvre.jsx';
import CreateMeme from './Pages/CreateMeme.jsx';
import Leaderboard from './Pages/Leaderboard.jsx';

// React Query
import { useGetMemes } from './hooks/useGetMemes.js';
import { useGetLouvreCreatedLeaders } from './hooks/useGetLouvreCreatedLeaders';
import { useGetLouvreVoteLeaders } from './hooks/useGetLouvreVoteLeaders';
import { useGetStickerLeaders } from './hooks/useGetStickerLeaders';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const MAX_IMAGE_DIMENSION = 2048; // Limit the maximum dimension of the image to 2048px

const App = () => {
  const canvasRef = useRef(null); // canvas for UI
  const exportCanvasRef = useRef(null); // canvas for exported image
  const [canvas, setCanvas] = useState(null);
  const [exportCanvas, setExportCanvas] = useState(null);
  const [editedBlob, setEditedBlob] = useState(null);

  // Pre fetch data for Louvre and Leaderboard
  useGetMemes();
  useGetLouvreCreatedLeaders();
  useGetLouvreVoteLeaders();
  useGetStickerLeaders();

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

  if (editedBlob) {
    return (
      <MantineProvider defaultColorScheme='auto' theme={theme}>
        <AppShell padding='md' header={{ height: 120 }}>
          <Header />
          <AppShell.Main
            style={{
              marginBottom: '-30px',
            }}
          >
            <ViewMeme editedBlob={editedBlob} />
          </AppShell.Main>
          <Footer />
        </AppShell>
      </MantineProvider>
    );
  } else {
    return (
      <MantineProvider defaultColorScheme='auto' theme={theme}>
        <AppShell padding='md' header={{ height: 120 }}>
          <Router>
            <Header />
            <AppShell.Main
              style={{
                marginBottom: '-30px',
              }}
            >
              <Routes>
                <Route
                  path='/'
                  element={editedBlob ? <ViewMeme /> : <CreateMeme />}
                />
                <Route path='/louvre' element={<Louvre />} />
                {/* <Route index element={<CreateMeme />} /> */}
                <Route path='/create' element={<CreateMeme />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
              </Routes>
            </AppShell.Main>
          </Router>
          <Footer />
        </AppShell>
      </MantineProvider>
    );
  }
};

export default App;
