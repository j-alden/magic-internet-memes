import React from 'react';
import { Button } from '@mantine/core';
import { IconWand } from '@tabler/icons-react';

const DownloadPanel = ({ onDownload, enabled }) => {
  return (
    <Button
      onClick={onDownload}
      fullWidth
      rightSection={<IconWand size={14} />}
      mt='xs'
      color='green'
      variant='outline'
      disabled={!enabled}
    >
      Save Image
    </Button>
  );
};
export default DownloadPanel;
