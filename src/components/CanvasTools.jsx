import React from 'react';
import { Group, Button } from '@mantine/core';
import { IconWand, IconTrash, IconSwitchHorizontal } from '@tabler/icons-react';

// Helper function
import downloadEditedImage from '../helpers/downloadEditedImage';

// Axios to call serverless functions
import axios from 'axios';

const CanvasTools = ({ canvas, exportCanvas, enabled }) => {
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

  const downloadImage = () => {
    // axios
    //   .get('https://www.magicinternet.meme/api/hello')
    //   .then((response) => console.log(response));
    downloadEditedImage(canvas, exportCanvas);
  };

  return (
    <Group grow>
      <Button
        //onClick={onDeleteObject}
        onClick={deleteActiveObject}
        rightSection={<IconTrash size={14} />}
        variant='outline'
        color='red'
        mt='xs'
        disabled={!enabled}
      >
        Remove Sticker
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
        Flip Sticker
      </Button>
      <Button
        //onClick={onDownload}
        onClick={downloadImage}
        rightSection={<IconWand size={14} />}
        mt='xs'
        color='green'
        variant='outline'
        disabled={!enabled}
      >
        Save Image
      </Button>
    </Group>
  );
};
export default CanvasTools;
