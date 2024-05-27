import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import styled from 'styled-components';

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
  Input,
  TextInput,
} from '@mantine/core';

const CanvasWrapperDiv = styled.div`
  border: 2px solid #d9d9d9;
  position: relative;
`;

const MAX_IMAGE_DIMENSION = 2048;

const CanvasWrapper = ({ onCanvasReady }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
      allowTouchScrolling: true,
    });

    newCanvas.on('object:modified', () => {
      newCanvas.renderAll();
    });
    newCanvas.on('object:added', () => {
      newCanvas.renderAll();
    });

    setCanvas(newCanvas);
    onCanvasReady(newCanvas);
  }, [onCanvasReady]);

  return (
    <CanvasWrapperDiv
      style={{
        marginBottom: '20px',
      }}
    >
      <canvas ref={canvasRef} id='canvas' />
    </CanvasWrapperDiv>
  );
};

export default CanvasWrapper;
