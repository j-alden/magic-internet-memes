import React from 'react';
import { Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { FileButton } from '@mantine/core';

const UploadImage = ({ onDrop }) => {
  return (
    <FileButton onChange={onDrop} accept='image/*'>
      {(props) => (
        <Button
          {...props}
          variant='outline'
          mt='xs'
          fullWidth
          rightSection={<IconUpload size={14} />}
        >
          Upload Image
        </Button>
      )}
    </FileButton>
  );
};

export default UploadImage;
