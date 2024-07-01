// src/App.js
import React, { useState } from 'react';

// Styling
import '@mantine/core/styles.css';
import { MantineProvider, AppShell } from '@mantine/core';
import { theme } from './theme';
import './App.css';

// Custom wizard font
import './assets/WizardFont.otf';

// Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ViewMeme from './components/ViewMeme.jsx';

// Routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Louvre from './Pages/Louvre.jsx';
import CreateMeme from './Pages/CreateMeme.jsx';
import Leaderboard from './Pages/Leaderboard.jsx';

// React Query
import { useGetMemes } from './hooks/useGetMemes.js';
import { useGetLouvreCreatedLeaders } from './hooks/useGetLouvreCreatedLeaders';
import { useGetLouvreVoteLeaders } from './hooks/useGetLouvreVoteLeaders';
import { useGetStickerLeaders } from './hooks/useGetStickerLeaders';

const App = () => {
  const [editedBlob, setEditedBlob] = useState(null);

  // Pre fetch data for Louvre and Leaderboard
  useGetMemes('New');
  useGetLouvreCreatedLeaders();
  useGetLouvreVoteLeaders();
  useGetStickerLeaders();

  if (editedBlob) {
    return (
      <MantineProvider defaultColorScheme='auto' theme={theme}>
        <AppShell padding='md' header={{ height: 120 }}>
          <Header />
          <AppShell.Main
            style={{
              marginBottom: '-30px',
            }}
          >
            <ViewMeme editedBlob={editedBlob} />
          </AppShell.Main>
          <Footer />
        </AppShell>
      </MantineProvider>
    );
  } else {
    return (
      <MantineProvider defaultColorScheme='auto' theme={theme}>
        <AppShell padding='md' header={{ height: 120 }}>
          <Router>
            <Header />
            <AppShell.Main
              style={{
                marginBottom: '-30px',
              }}
            >
              <Routes>
                <Route
                  path='/'
                  element={editedBlob ? <ViewMeme /> : <CreateMeme />}
                />
                <Route path='/louvre' element={<Louvre />} />
                {/* <Route index element={<CreateMeme />} /> */}
                <Route path='/create' element={<CreateMeme />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
              </Routes>
            </AppShell.Main>
          </Router>
          <Footer />
        </AppShell>
      </MantineProvider>
    );
  }
};

export default App;
