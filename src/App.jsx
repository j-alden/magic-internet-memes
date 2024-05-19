// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

// Styling
import '@mantine/core/styles.css';
import {
  MantineProvider,
  Button,
  Space,
  AppShell,
  Image,
  Stack,
  Group,
} from '@mantine/core';
import { IconUpload, IconWand, IconTrash } from '@tabler/icons-react';
import styled from 'styled-components';
import { theme } from './theme';

// Antd (removing)
//import { Layout, Button, Space } from 'antd';

//import 'antd/dist/reset.css';

//import 'antd/dist/antd.min.css';
import { UploadOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';

// Converts canvas to blob w/ broader browser support
import dataURLtoBlob from 'blueimp-canvas-to-blob';

//const { Content } = Layout;

import stickers from './stickers.js';

// Styled components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

const StickerPanel = styled.div`
  display: inline-block;
  gap: 10px;
  margin-top: 10px;
`;

const CanvasWrapper = styled.div`
  border: 2px solid #d9d9d9;
  position: relative;
`;

const MAX_IMAGE_DIMENSION = 2048; // Limit the maximum dimension of the image to 2048px

const App = () => {
  const canvasRef = useRef(null); // canvas for UI
  const exportCanvasRef = useRef(null); // canvas for exported image

  const [canvas, setCanvas] = useState(null);
  const [exportCanvas, setExportCanvas] = useState(null);
  const [enableButtons, setEnableButtons] = useState(false);

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

  // Add sticker to canvas
  const addSticker = (src) => {
    fabric.Image.fromURL(src, (img) => {
      // Removed sticker scaling for now
      img.scaleToWidth(125);
      //img.scaleToHeight(150);
      img.set({
        left: 100,
        top: 100,
        angle: 0,
        borderColor: 'red',
        cornerColor: 'red',
        cornerSize: 9,
        transparentCorners: false,
        hasControls: true,
        selectable: true,
        lockScalingFlip: true,
      });
      canvas.add(img);
      canvas.setActiveObject(img);
    });
  };

  // Delete selected sticker
  const deleteActiveObject = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  };

  // Add and scale objects from canvas to exportCanvas
  const prepExportCanvas = () => {
    const exportWidth = exportCanvas.width;
    const exportHeight = exportCanvas.height;

    let scaleX = exportWidth / canvas.width;
    let scaleY = exportHeight / canvas.height;

    let objects = canvas.getObjects();

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

  // Save selected sticker
  const downloadEditedImage = () => {
    prepExportCanvas();

    // Prep blob to be downloaded
    const dataUrl = exportCanvas.toDataURL({ format: 'jpeg', quality: 0.9 });
    const blob = dataURLtoBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Open in new tab on mobile, download on desktop
    if (navigator.userAgent.match(/Tablet|iPad/i)) {
      a.target = '_blank';
      // do tablet stuff
    } else if (
      navigator.userAgent.match(
        /Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i
      )
    ) {
      a.target = '_blank';
      // do mobile stuff
    } else {
      a.download = 'meme.jpg';
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    // <MantineProvider theme={theme}>
    <MantineProvider defaultColorScheme='auto'>
      {/* <Layout> */}
      {/* <Content> */}
      <AppShell
        padding='md'
        header={{ height: 100 }}
        // navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      >
        {/* <Container> */}
        <AppShell.Header>
          <Stack h={'100%'} justify='center'>
            <Image src='/mim-banner.png' mah='100px' fit='contain' />
          </Stack>
          {/* <BannerPhoto src="/mim-banner.png" /> */}
        </AppShell.Header>
        <AppShell.Main>
          <UploadPanel onDrop={onDrop} />
          <Group grow>
            <Button
              onClick={deleteActiveObject}
              rightSection={<IconTrash size={14} />}
              variant='outline'
              color='red'
              mt='xs'
              disabled={!enableButtons}
            >
              Delete Sticker
            </Button>

            <Button
              onClick={downloadEditedImage}
              rightSection={<IconWand size={14} />}
              mt='xs'
              color='green'
              variant='outline'
              disabled={!enableButtons}
            >
              Save Image
            </Button>
          </Group>
          <Container style={{ padding: 0 }}>
            <StickerPanel>
              {stickers.map((sticker) => (
                <img
                  key={sticker.id}
                  src={sticker.src}
                  alt={sticker.name}
                  width={50}
                  style={{ cursor: 'pointer', display: 'inline-block' }}
                  onClick={() => addSticker(sticker.src)}
                />
              ))}
            </StickerPanel>
          </Container>

          <Container>
            <CanvasWrapper>
              <canvas ref={canvasRef} id='canvas' />
            </CanvasWrapper>
          </Container>
        </AppShell.Main>

        {/* <CanvasWrapper>
            <canvas ref={exportCanvasRef} id="exportCanvas" />
          </CanvasWrapper> */}
        {/* </Container> */}
      </AppShell>
      {/* </Content> */}
      {/* </Layout> */}
    </MantineProvider>
  );
};

const UploadPanel = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button
        rightSection={<IconUpload size={14} />}
        fullWidth
        variant='outline'
        mt='xs'
      >
        Upload Image
      </Button>
    </div>
  );
};

export default App;
