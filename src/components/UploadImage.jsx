import React from 'react';
import { useDropzone } from 'react-dropzone';
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

    // <div {...getRootProps()}>
    //   <input {...getInputProps()} />
    //   <Button
    //     rightSection={<IconUpload size={14} />}
    //     fullWidth
    //     variant='outline'
    //     mt='xs'
    //   >
    //     Upload Image
    //   </Button>
    // </div>
  );
};

export default UploadImage;
