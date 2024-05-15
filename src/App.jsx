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

const App = () => {
  const canvasRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const [canvas, setCanvas] = useState(null);


  // Initialize Fabric canvas only once
  useEffect(() => {
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
  }, []);


  // TRYING WITHOUT THIS
  // useEffect(() => {
  //   if (imageDimensions.width > 0 && imageDimensions.height > 0) {
  //     scaleCanvasToFitViewport(imageDimensions.width, imageDimensions.height);
  //     canvas.renderAll();
  //   }
  // }, [imageDimensions]);

  // Handle image upload
  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];

    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {

        
        //IGNORING FOR NOW
        //setImageDimensions({ width: img.width, height: img.height });
        
        //img.scaleToWidth(500);
        //img.scaleToHeight(500);
        canvas.setWidth(img.width);
        canvas.setHeight(img.height);
        canvas.clear();
        canvas.setBackgroundImage(img, () => scaleCanvasToFitViewport(img.width, img.height));
        //canvas.backgroundImage = img;

        //setTimeout( function() {canvas.renderAll(); }, 50 );

        //setTimeout( function() {scaleCanvasToFitViewport(img.width, img.height)}, 100 );
        //scaleCanvasToFitViewport(img.width, img.height);
        //scaleCanvasToFitViewport(img.width, img.height);
        // Update the state with the image dimensions
        canvas.renderAll();
        // TRYING THIS EARLIER
        //setImageDimensions({ width: img.width, height: img.height });
      });
    };
    reader.readAsDataURL(file);
  };


  const scaleCanvasToFitViewport = (imgWidth, imgHeight) => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    console.log(`img height: ${imgHeight}`);
    console.log(`img width: ${imgWidth}`)
    console.log(`max height: ${maxHeight}`);
    console.log(`max width: ${maxWidth}`)

    // Only scale if image width or height is too large
    if(imgWidth > maxWidth || imgHeight > maxHeight) {
      // Calculate the scaling factor to fit the viewport
      const scaleWidth = maxWidth / imgWidth;
      const scaleHeight = maxHeight / imgHeight;
      const scale = Math.min(scaleWidth, scaleHeight);

      // Scale CSS of canvas based on window size. Retains original image size
      canvas.setDimensions({width: `${imgWidth * scale}px`, height: `${imgHeight * scale}px`}, {cssOnly: true})
      console.log(canvas);
      canvas.setBackgroundImage(canvas.backgroundImage, console.log(canvas), {
        scaleX: scale,
        scaleY: scale
    });


      // IGNORING FOR NOW
      //canvas.renderAll();

      // Set the canvas style dimensions
      // const canvasElement = document.getElementById('canvas');
    
      // if (canvasElement) {
      //   console.log(`height: ${imgHeight * scale}p`);
      //   console.log(`width: ${imgWidth * scale}p`)
      //   // Set the canvas style dimensions
      //   canvasElement.style.width = `${imgWidth * scale}px`;
      //   canvasElement.style.height = `${imgHeight * scale}px`;
      // } else {
      //   console.error('Canvas element not found');
      // }

    }


  };

  // Add sticker to canvas
  const addSticker = (src) => {
    fabric.Image.fromURL(src, (img) => {
      // Removed sticker scaling for now
      // img.scaleToWidth(100);
      // img.scaleToHeight(100);
      img.set({
        left: 100,
        top: 100,
        angle: 0,
        borderColor: 'red',
        cornerColor: 'red',
        cornerSize: 8,
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

  // Save selected sticker
  const downloadEditedImage = () => {
    const dataURL  = canvas.toDataURL({ format: 'png' });

    const blob = dataURLToBlob(dataURL);
    const url = URL.createObjectURL(blob);

   // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'edited-image.png';
    const a = document.createElement('a');
    a.href = url;

    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
      a.target = '_blank';
    } else {

      a.href = url;
      a.download = 'meme.png';
    }
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

// Blob url 
const dataURLToBlob = (dataURL) => {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
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