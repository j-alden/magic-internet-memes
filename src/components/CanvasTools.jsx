import React, { useState } from 'react';
import {
  Group,
  Button,
  Paper,
  Title,
  Switch,
  Slider,
  Text,
  Stack,
} from '@mantine/core';
import {
  IconTrash,
  IconSwitchHorizontal,
  IconStackForward,
  IconStackBackward,
} from '@tabler/icons-react';

const CanvasTools = ({ canvas, enabled, isGif }) => {
  const [advancedTools, setAdvancedTools] = useState(false);

  // Delete selected sticker
  const deleteActiveObject = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.fire('custom:stickerremoved', { target: activeObject });
      canvas.remove(activeObject);
    }
  };

  // Horizontally flip selected sticker
  const flipActiveObject = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.flipX = !activeObject.flipX;
      activeObject.setCoords();
      canvas.fire('custom:stickerflipped', { target: activeObject });
      canvas.renderAll();
    }
  };

  // Bring selected sticker forward
  const bringOjectForward = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringForward(activeObject);
      canvas.fire('custom:stickerlayerchanged', { target: activeObject });
      canvas.renderAll();
    }
  };

  // Bring selected sticker forward
  const sendObjectBackwards = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendBackwards(activeObject);
      canvas.fire('custom:stickerlayerchanged', { target: activeObject });
      canvas.renderAll();
    }
  };

  const skewObjectX = (value) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('skewX', value);
      canvas.fire('custom:stickerskewed', { target: activeObject });
      canvas.renderAll();
    }
  };
  const skewObjectY = (value) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('skewY', value);
      canvas.fire('custom:stickerskewed', { target: activeObject });
      canvas.renderAll();
    }
  };

  return (
    <Paper withBorder p='xs' mt='xs'>
      <Switch
        checked={advancedTools}
        onChange={(event) => setAdvancedTools(event.currentTarget.checked)}
        label='Advanced Tools'
        style={{
          //display: 'inline-block',
          float: 'right',
        }}
      />
      <Title order={3}>Sticker Tools</Title>

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
          disabled={!enabled || isGif}
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
          disabled={!enabled || isGif}
        >
          Send Backward
        </Button>
      </Group>
      {advancedTools ? (
        <Group mt='xs'>
          <Text>Skew (H)</Text>
          <Slider
            color='blue'
            size='sm'
            min={-50}
            max={50}
            defaultValue={0}
            onChange={(value) => skewObjectX(value)}
            style={{ width: 150 }}
          />
          <Text>Skew (V)</Text>

          <Slider
            color='blue'
            size='sm'
            min={-50}
            max={50}
            defaultValue={0}
            onChange={(value) => skewObjectY(value)}
            style={{ width: 150 }}
          />
        </Group>
      ) : null}
    </Paper>
  );
};
export default CanvasTools;
