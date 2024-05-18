// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { Layout, Button, Space } from 'antd';
import styled from 'styled-components';
import 'antd/dist/reset.css';

//import 'antd/dist/antd.min.css';
import { UploadOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';

// Converts canvas to blob w/ broader browser support
import dataURLtoBlob from 'blueimp-canvas-to-blob';


const { Content } = Layout;

const stickers = [
  { id: 1, src: '/stickers/full-face.png', name: 'Wizard Face' },
  { id: 2, src: '/stickers/metal-hat-face.png', name: 'Crazy Wizard' },
  { id: 3, src: '/stickers/hat1.png', name: 'Wizard Hat' },
  { id: 4, src: '/stickers/hat2.png', name: 'Wizard Hat 2' },
  { id: 5, src: '/stickers/beard1.png', name: 'Wizard Beard' },
  { id: 6, src: '/stickers/text-mim.png', name: 'Magic Internet Money' },
  { id: 7, src: '/stickers/text-mim-green.png', name: 'Magic Interney Money (Green)' },
  { id: 8, src: '/stickers/text-waiting-for-clarification.png', name: 'Waiting For Clarification' },
  { id: 9, src: '/stickers/text-very-satisfied.png', name: 'Very Satisfied' },
  { id: 10, src: '/stickers/cta-join-us.png', name: 'Join Us' },
  { id: 11, src: '/stickers/cta-save-us.png', name: 'Save Us' },
  { id: 12, src: '/stickers/cta-dilute-us.png', name: 'Dilute Us' },
  { id: 13, src: '/stickers/pill.png', name: 'Pill' },
  { id: 14, src: '/stickers/staff-pill.png', name: 'Staff - Pill' },
];

// Styled components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

const BannerPhoto = styled.img`
height: auto;
max-width: 100%;
`;

const StickerPanel = styled.div`
  display: inline-block;
  gap: 10px;
`;

const CanvasWrapper = styled.div`
  border: 2px solid #d9d9d9;
  position: relative;
`;

const MAX_IMAGE_DIMENSION = 2048;  // Limit the maximum dimension of the image to 2048px

const App = () => {
  const canvasRef = useRef(null); // canvas for UI
  const exportCanvasRef = useRef(null); // canvas for exported image

  const [canvas, setCanvas] = useState(null);
  const [exportCanvas, setExportCanvas] = useState(null);

  // Initialize Fabric canvas only once
  useEffect(() => {
    
    // UI canvas
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
      allowTouchScrolling: true
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
      preserveObjectStacking: true
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
        if (exportImg.width > MAX_IMAGE_DIMENSION || exportImg.height > MAX_IMAGE_DIMENSION) {
          scaleFactor = MAX_IMAGE_DIMENSION / Math.max(exportImg.width, exportImg.height);
        }

        exportImg.scale(scaleFactor);

        exportCanvas.clear();
        exportCanvas.setWidth(exportImg.width * scaleFactor);
        exportCanvas.setHeight(exportImg.height * scaleFactor);

        exportCanvas.setBackgroundImage(exportImg, exportCanvas.renderAll.bind(exportCanvas));

        exportCanvas.renderAll();
      });

      // Maintain a smaller canvas on UI that is scaled to window size
      fabric.Image.fromURL(e.target.result, (img) => {
        let scaleFactor = getScaleValue(img);
            
        img.set({
          scaleX: scaleFactor,
          scaleY: scaleFactor
        });

        // Clear the canvas
        canvas.clear();

        // Set the canvas dimensions to match the image dimensions
        canvas.setWidth(img.width *  scaleFactor);
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

  const scaleCanvasToFitViewport = (imgWidth, imgHeight) => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // Only scale if image width or height is too large
    if(imgWidth > maxWidth || imgHeight > maxHeight) {
      // Calculate the scaling factor to fit the viewport
      const scaleWidth = maxWidth / imgWidth;
      const scaleHeight = maxHeight / imgHeight;
      const scale = Math.min(scaleWidth, scaleHeight);

      // Scale CSS of canvas based on window size. Retains original image size
      canvas.setDimensions({width: `${imgWidth * scale}px`, height: `${imgHeight * scale}px`}, {cssOnly: true})
      

    }
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
        lockScalingFlip: true
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

    if (canvas.width != exportCanvas.width) {
      let scaleX = exportWidth / canvas.width;
      let scaleY = exportHeight / canvas.height;

      let objects = canvas.getObjects();

      for (var i in objects) {
          let scaledObject = objects[i]
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
    }      
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
    } else if(navigator.userAgent.match(/Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i) ) {
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
    <Layout>
      <Content>
        <Container>
          <BannerPhoto src="/mim-banner.png" />
          <UploadPanel onDrop={onDrop} />
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
          <Space>
            <Button onClick={deleteActiveObject} danger>
              Delete Selected Sticker
            </Button>
            <Button onClick={downloadEditedImage}>
              Save Image
            </Button>
          </Space>
          <CanvasWrapper>
            <canvas ref={canvasRef} id="canvas" />
          </CanvasWrapper>
          {/* <CanvasWrapper>
            <canvas ref={exportCanvasRef} id="exportCanvas" />
          </CanvasWrapper> */}
        </Container>
      </Content>
    </Layout>
  );
};

const UploadPanel = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, accept: 'image/*' });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button icon={<UploadOutlined />}>Upload Image</Button>
    </div>
  );
};

export default App;