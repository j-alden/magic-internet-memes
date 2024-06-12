import React from 'react';
import { Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { FileButton } from '@mantine/core';

const UploadStickerPanel = ({ canvas }) => {
  const onDropSticker = (acceptedFiles) => {
    const reader = new FileReader();
    //const file = acceptedFiles[0];
    const file = acceptedFiles;

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

  return (
    <FileButton onChange={onDropSticker} accept='image/*'>
      {(props) => (
        <Button {...props} mt='xs' rightSection={<IconUpload size={14} />}>
          Upload One-Off Sticker
        </Button>
      )}
    </FileButton>

    // <div {...getRootProps()}>
    //   <input {...getInputProps()} />
    //   <Button rightSection={<IconUpload size={14} />} mt='xs'>
    //     Add One-Off Sticker
    //   </Button>
    // </div>
  );
};

export default UploadStickerPanel;
