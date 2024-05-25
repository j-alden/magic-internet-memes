// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//import classes from './App.css';

// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

// Styling
import '@mantine/core/styles.css';
import {
  MantineProvider,
  Button,
  AppShell,
  Image,
  Stack,
  Group,
  Tabs,
  rem,
  Text,
  Anchor,
} from '@mantine/core';

//import { useHeadroom } from '@mantine/hooks';

import {
  IconUpload,
  IconWand,
  IconTrash,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
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

const iconStyle = { width: rem(12), height: rem(12) };

const MAX_IMAGE_DIMENSION = 2048; // Limit the maximum dimension of the image to 2048px

// Get sticker categories
const stickerCategories = [
  ...new Set(stickers.map((sticker) => sticker.category)),
];

const App = () => {
  const canvasRef = useRef(null); // canvas for UI
  const exportCanvasRef = useRef(null); // canvas for exported image

  const [canvas, setCanvas] = useState(null);
  const [exportCanvas, setExportCanvas] = useState(null);
  const [enableButtons, setEnableButtons] = useState(false);

  // Control if header is visible
  //const pinned = useHeadroom({ fixedAt: 60 });

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

  // Horizontally flip selected sticker
  const flipActiveObject = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.flipX = !activeObject.flipX;
      activeObject.setCoords();
      canvas.renderAll();
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

  // Return JSX to display stickers for a given category
  const displayStickerCategory = (category) => {
    let categoryStickers = stickers.filter((sticker) => {
      return sticker.category === category;
    });

    return categoryStickers.map((sticker) => (
      <Tabs.Panel
        value={sticker.category}
        key={Math.random(100)}
        // leftSection={<IconPhoto style={iconStyle} />}
      >
        <img
          key={sticker.id}
          src={sticker.src}
          alt={sticker.name}
          height={
            sticker.category == 'Buttons' || sticker.category == 'Text'
              ? null
              : 70
          }
          width={
            sticker.category == 'Buttons' || sticker.category == 'Text'
              ? 70
              : null
          }
          onClick={() => addSticker(sticker.src)}
        />
      </Tabs.Panel>
    ));
  };

  return (
    // <MantineProvider theme={theme}>
    <MantineProvider defaultColorScheme='auto' theme={theme}>
      {/* <Layout> */}
      {/* <Content> */}
      <AppShell
        padding='md'
        header={{ height: 100 }}
        // navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      >
        {/* <Container> */}
        <AppShell.Header
          style={{
            position: 'absolute', // fixed will keep it pinned to top while scrolling
            top: 0,
            // left: 0,
            // right: 0,
            //height: rem(60),
            //zIndex: 1000000,
            //transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
            //transition: 'transform 400ms ease',
          }}
        >
          <Stack h={'100%'} justify='center'>
            <Image src='/mim-banner.png' mah='100px' fit='contain' />
          </Stack>
          {/* <BannerPhoto src="/mim-banner.png" /> */}
        </AppShell.Header>
        <AppShell.Main
          style={{
            marginBottom: '-30px',
          }}
        >
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
              Remove Sticker
            </Button>
            <Button
              onClick={flipActiveObject}
              rightSection={<IconSwitchHorizontal size={14} />}
              variant='outline'
              color='yellow'
              mt='xs'
              disabled={!enableButtons}
            >
              Flip Sticker
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
            <Tabs
              defaultValue='Faces'
              styles={{
                root: {
                  width: '100%',
                  display: 'inline-block',
                  gap: '10px',
                  marginTop: '10px',
                  //height: '150px',
                },
                list: {},
                panel: {
                  cursor: 'pointer',
                  display: 'inline-block',
                  marginTop: '10px',
                },
              }}
            >
              <Tabs.List>
                {stickerCategories.map((category) => (
                  <Tabs.Tab
                    value={category}
                    key={Math.random(1000)}
                    // leftSection={<IconPhoto style={iconStyle} />}
                  >
                    {category}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              {stickerCategories.map((sticker) =>
                displayStickerCategory(sticker)
              )}
            </Tabs>
          </Container>
          <Container>
            <CanvasWrapper
              style={{
                marginBottom: '20px',
              }}
            >
              <canvas ref={canvasRef} id='canvas' />
            </CanvasWrapper>
          </Container>
        </AppShell.Main>
        <AppShell.Footer
          style={{
            position: 'relative',
            //bottom: 0,
            //height: '60px',
            //width: '100%',
            //display: 'block',
            // left: 0,
            // right: 0,
            //height: rem(20),
            //zIndex: 1000000,
            //transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
            //transition: 'transform 400ms ease',
          }}
        >
          <Text
            ta='center'
            //c='dimmed'
          >
            Made by{' '}
            <Anchor
              href='https://twitter.com/buyborrowdie'
              target='_blank'
              underline='never'
            >
              @buyborrowdie
            </Anchor>
          </Text>
        </AppShell.Footer>
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
