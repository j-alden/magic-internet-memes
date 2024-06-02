import React from 'react';

import { AppShell, Image, Stack } from '@mantine/core';

const Header = () => {
  return (
    <AppShell.Header
      style={{
        position: 'absolute', // fixed will keep it pinned to top while scrolling
        top: 0,
      }}
    >
      <Stack h={'100%'} justify='center'>
        <Image src='/mim-banner.png' mah='100px' fit='contain' />
      </Stack>
    </AppShell.Header>
  );
};

export default Header;
