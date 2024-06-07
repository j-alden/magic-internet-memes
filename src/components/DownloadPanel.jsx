import React from 'react';
import { Button, Paper, Title } from '@mantine/core';
import { IconWand } from '@tabler/icons-react';

// Helper function
//import downloadEditedImage from '../helpers/downloadEditedImage';
import saveTempImage from '../helpers/downloadEditedImage';

const DownloadPanel = ({
  canvas,
  exportCanvas,
  enabled,
  setUploadedImageUrl,
  setLoading,
}) => {
  const downloadImage = async () => {
    setLoading(true);
    const blob_url = await saveTempImage(canvas, exportCanvas);
    setUploadedImageUrl(blob_url);
    setLoading(false);
    // axios
    //   .get('https://www.magicinternet.meme/api/hello')
    //   .then((response) => console.log(response));

    //downloadEditedImage(canvas, exportCanvas);
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
