import React from 'react';
import { Button, Paper, Title } from '@mantine/core';
import { IconWand } from '@tabler/icons-react';
import dataURLtoBlob from 'blueimp-canvas-to-blob';

// Helper function
//import downloadEditedImage from '../helpers/downloadEditedImage';
//import saveTempImage from '../helpers/downloadEditedImage';

const DownloadPanel = ({
  canvas,
  exportCanvas,
  enabled,
  setUploadedImageUrl,
  setLoading,
  setEditedBlob,
}) => {
  // Scales objects from working canvas to exported canvas
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

  const saveTempImage = () => {
    if (exportCanvas) {
      prepExportCanvas(canvas, exportCanvas);

      // Prep blob to be stored
      const dataUrl = exportCanvas.toDataURL({ format: 'jpeg', quality: 0.9 });
      const blob = dataURLtoBlob(dataUrl);
      //const url = URL.createObjectURL(blob);
      return blob;
    }
  };

  const downloadImage = async () => {
    setLoading(true);
    const blob = saveTempImage(canvas, exportCanvas);
    setEditedBlob(blob);
    const blob_url = URL.createObjectURL(blob);
    setUploadedImageUrl(blob_url);
    setLoading(false);
  };

  return (
    <Button
      //onClick={onDownload}
      onClick={downloadImage}
      rightSection={<IconWand size={14} />}
      mt='xs'
      color='green'
      variant='outline'
      disabled={!enabled}
      fullWidth
    >
      Generate Image
    </Button>
  );
};
export default DownloadPanel;
