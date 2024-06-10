import React, { useState } from 'react';
import {
  Anchor,
  Title,
  Image,
  Paper,
  Button,
  Group,
  Stack,
  Flex,
} from '@mantine/core';

import {
  IconDownload,
  IconPhotoDown,
  IconArrowBack,
  IconArrowBigLeft,
} from '@tabler/icons-react';
import UploadToVaultForm from './UploadToVaultForm';

const ViewMeme = ({ uploadedImageUrl, editedBlob }) => {
  const blob_url = URL.createObjectURL(editedBlob); // url to display image

  const resetImage = () => {
    //setUploadedImageUrl(null);
    //setEnableButtons(false);
    window.location.reload(); // Refresh page to restart
  };

  if (blob_url) {
    return (
      <Paper>
        <Button
          variant='transparent'
          leftSection={<IconArrowBigLeft size={14} />}
          onClick={resetImage}
        >
          Start Over
        </Button>
        <Flex
          mih={50}
          gap='md'
          justify='center'
          align='flex-start'
          direction='row'
          wrap='wrap'
        >
          <Stack maw='100%'>
            <Anchor href={blob_url} target='_blank'>
              <Image
                src={blob_url}
                w='auto'
                maw='100%'
                mah='100%'
                fit='contain'
              />
            </Anchor>
            <Anchor
              href={blob_url}
              download={'edited-meme.jpg'}
              underline='never'
            >
              <Button //onClick={onDownload}
                //onClick={downloadImage}
                rightSection={<IconPhotoDown size={14} />}
                //mt='xs'
                //variant='outline'
                //disabled={!enabled}
                fullWidth
                // href={`${uploadedImageUrl}?download=1`}
                // component='a'
              >
                Download Image
              </Button>
            </Anchor>
          </Stack>
          <UploadToVaultForm blob={editedBlob} blob_url={blob_url} />
        </Flex>
      </Paper>
      // <Paper withBorder p='sm' m='sm'>
    );
  }
};

export default ViewMeme;
