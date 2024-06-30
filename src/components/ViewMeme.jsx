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
  Text,
} from '@mantine/core';

import {
  IconPhotoDown,
  IconArrowBigLeft,
  IconDeviceMobile,
} from '@tabler/icons-react';
import UploadToVaultForm from './UploadToVaultForm';

const ViewMeme = ({ editedBlob, isGif }) => {
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
              download={isGif ? 'magic-meme.gif' : 'magic-meme.jpg'}
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
            <Group gap='5'>
              <IconDeviceMobile />
              <Text>Tip: Press and hold image to save it on mobile</Text>
            </Group>
          </Stack>
          <UploadToVaultForm
            blob={editedBlob}
            blob_url={blob_url}
            isGif={isGif}
          />
        </Flex>
      </Paper>
      // <Paper withBorder p='sm' m='sm'>
    );
  }
};

export default ViewMeme;
