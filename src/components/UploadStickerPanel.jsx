import React from 'react';
import { Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useDropzone } from 'react-dropzone';

const UploadStickerPanel = ({ canvas }) => {
  const onDropSticker = (acceptedFiles) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];

    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        img.scaleToWidth(125);
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
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropSticker,
    multiple: false,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button rightSection={<IconUpload size={14} />} mt='xs'>
        Upload Custom Sticker
      </Button>
    </div>
  );
};

export default UploadStickerPanel;
