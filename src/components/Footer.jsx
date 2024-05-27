import React from 'react';

import { AppShell, Anchor, Text } from '@mantine/core';

const Footer = () => (
  <AppShell.Footer
    style={{
      position: 'relative',
      //bottom: 0,
      //height: '60px',
      //width: '100%',
      //display: 'block',
      // left: 0,
      // right: 0,
      //height: rem(20),
      //zIndex: 1000000,
      //transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
      //transition: 'transform 400ms ease',
    }}
  >
    <Text
      ta='center'
      //c='dimmed'
    >
      Made by{' '}
      <Anchor
        href='https://twitter.com/buyborrowdie'
        target='_blank'
        underline='never'
      >
        @buyborrowdie
      </Anchor>
    </Text>
  </AppShell.Footer>
);

export default Footer;
