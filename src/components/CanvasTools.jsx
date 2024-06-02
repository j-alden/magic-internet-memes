import React from 'react';
import { Group, Button, Paper, Title, Slider, Text } from '@mantine/core';
import {
  IconTrash,
  IconSwitchHorizontal,
  IconStackForward,
  IconStackBackward,
} from '@tabler/icons-react';

const CanvasTools = ({ canvas, enabled }) => {
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

  // Bring selected sticker forward
  const bringOjectForward = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringForward(activeObject);
      canvas.renderAll();
    }
  };

  // Bring selected sticker forward
  const sendObjectBackwards = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendBackwards(activeObject);
      canvas.renderAll();
    }
  };

  const skewObjectX = (value) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('skewX', value);
      canvas.renderAll();
    }
  };

  return (
    <Paper withBorder p='xs' mt='xs'>
      <Title order={4}>Sticker Tools</Title>
      <Group>
        <Button
          //onClick={onDeleteObject}
          onClick={deleteActiveObject}
          rightSection={<IconTrash size={14} />}
          variant='outline'
          color='red'
          mt='xs'
          disabled={!enabled}
        >
          Remove
        </Button>
        <Button
          onClick={flipActiveObject}
          //onClick={onFlipObject}
          rightSection={<IconSwitchHorizontal size={14} />}
          variant='outline'
          color='yellow'
          mt='xs'
          disabled={!enabled}
        >
          Flip
        </Button>
        <Button
          onClick={bringOjectForward}
          //onClick={onFlipObject}
          rightSection={<IconStackForward size={14} />}
          variant='outline'
          //color='yellow'
          mt='xs'
          disabled={!enabled}
        >
          Bring Forward
        </Button>
        <Button
          onClick={sendObjectBackwards}
          //onClick={onFlipObject}
          rightSection={<IconStackBackward size={14} />}
          variant='outline'
          //color='yellow'
          mt='xs'
          disabled={!enabled}
        >
          Send Backward
        </Button>
        {/* <Slider
          color='blue'
          size='sm'
          min={-50}
          max={50}
          defaultValue={0}
          onChange={(value) => skewObjectX(value)}
          style={{ width: 200 }}
        /> */}
      </Group>
    </Paper>
  );
};
export default CanvasTools;
