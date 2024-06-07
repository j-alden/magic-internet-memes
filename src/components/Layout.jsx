import React from 'react';
import {
  MantineProvider,
  AppShell,
  Image,
  Paper,
  LoadingOverlay,
  Title,
  Button,
} from '@mantine/core';
import { theme } from '../theme';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <MantineProvider defaultColorScheme='auto' theme={theme}>
      <AppShell padding='md' header={{ height: 100 }}>
        <Header />
        <AppShell.Main
          style={{
            marginBottom: '-30px',
          }}
        ></AppShell.Main>
        <Footer />
      </AppShell>
    </MantineProvider>
  );
};
export default Layout;
