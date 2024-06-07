import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

const UploadPanel = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*',
    // accept: {
    //   'image/jpeg': ['.jpg', '.jpeg'],
    //   'image/png': [],
    // },
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

export default UploadPanel;
