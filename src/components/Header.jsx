import React, { useContext } from 'react';

import {
  AppShell,
  Image,
  Stack,
  Group,
  //NavLink,
  Anchor,
  Tabs,
} from '@mantine/core';
import { IconHome2, IconGauge, IconChevronRight } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <AppShell.Header
      style={{
        position: 'absolute', // fixed will keep it pinned to top while scrolling
        top: 0,
      }}
    >
      <Stack justify='center'>
        <Image src='/mim-banner.png' mah='75px' fit='contain' />
      </Stack>
      <Group justify='center'>
        <Tabs
          defaultValue='Faces'
          mt='xs'
          // styles={{
          //   root: {
          //     width: '100%',
          //     display: 'inline-block',
          //     gap: '10px',
          //     marginTop: '10px',
          //     //height: '150px',
          //   },
          //   list: {},
          //   panel: {
          //     cursor: 'pointer',
          //     display: 'inline-block',
          //     marginTop: '10px',
          //   },
          // }}
        >
          <Tabs.List>
            <Tabs.Tab value='create' key='create' component={NavLink} to=''>
              Create Meme
            </Tabs.Tab>
            <Tabs.Tab
              value='louvre'
              key='louvre'
              component={NavLink}
              to='louvre'
            >
              The Louvre
            </Tabs.Tab>
            <Tabs.Tab
              value='leaderboard'
              key='leaderboard'
              component={NavLink}
              to='leaderboard'
            >
              Leaderboard
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        {/* 
        <NavLink
          to='/'
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'active' : ''
          } />
        >
          Create Meme
        </NavLink>
        <NavLink
          to='/louvre'
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'active' : ''
          }
        >
          The Louvre
        </NavLink>
        <NavLink
          to='/leaderboard'
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'active' : ''
          }
        >
          Leaderboard
        </NavLink> */}
      </Group>
    </AppShell.Header>
  );
};

export default Header;
