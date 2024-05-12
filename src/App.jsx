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
  display: flex;
  gap: 10px;
`;

const CanvasWrapper = styled.div`
  border: 2px solid #d9d9d9;
  position: relative;
`;
//  max-width: 500px;
//height: 500px;

const App = () => {
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);

  // Initialize Fabric canvas only once
  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true
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

  // Handle image upload
  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];

    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        //img.scaleToWidth(500);
        //img.scaleToHeight(500);
        canvas.setWidth(img.width);
        canvas.setHeight(img.height);
        canvas.clear();
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    };
    reader.readAsDataURL(file);
  };

  // Add sticker to canvas
  const addSticker = (src) => {
    fabric.Image.fromURL(src, (img) => {
      img.scaleToWidth(80);
      img.scaleToHeight(80);
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
    const link = document.createElement('a');
    link.href = canvas.toDataURL({ format: 'png' });
    link.download = 'meme.png';
    link.click();
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
                style={{ cursor: 'pointer' }}
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
            <canvas ref={canvasRef} width={500} height={500} />
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