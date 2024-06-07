import React from 'react';
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

const ViewMeme = ({ uploadedImageUrl }) => {
  const resetImage = () => {
    //setUploadedImageUrl(null);
    //setEnableButtons(false);
    window.location.reload(); // Refresh page to restart
  };

  if (uploadedImageUrl) {
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
            <Image
              src={uploadedImageUrl}
              w='auto'
              maw='100%'
              mah='100%'
              fit='contain'
            />
            <Button //onClick={onDownload}
              //onClick={downloadImage}
              rightSection={<IconPhotoDown size={14} />}
              //mt='xs'
              //variant='outline'
              //disabled={!enabled}
              fullWidth
              href={`${uploadedImageUrl}?download=1`}
              component='a'
            >
              Download Image
            </Button>
          </Stack>
          <UploadToVaultForm uploadedImageUrl={uploadedImageUrl} />
        </Flex>
      </Paper>
      // <Paper withBorder p='sm' m='sm'>
    );
  }
};

export default ViewMeme;
