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
import { IconWand, IconPhoto, IconChartBar } from '@tabler/icons-react';
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
            <Tabs.Tab
              value='create'
              key='create'
              component={NavLink}
              to=''
              rightSection={<IconWand size={14} />}
            >
              Create
            </Tabs.Tab>
            <Tabs.Tab
              value='louvre'
              key='louvre'
              component={NavLink}
              to='louvre'
              rightSection={<IconPhoto size={14} />}
            >
              The Louvre
            </Tabs.Tab>
            <Tabs.Tab
              value='leaderboard'
              key='leaderboard'
              component={NavLink}
              to='leaderboard'
              rightSection={<IconChartBar size={14} />}
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
