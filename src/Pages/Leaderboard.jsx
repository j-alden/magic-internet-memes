import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Title, Table, Group } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Leaderboard = () => {
  const [stickerLeaders, setStickerLeaders] = useState([]);
  const [louvreLeaders, setLouvreLeaders] = useState([]);
  const [voteLeaders, setVoteLeaders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchStickerLeaders() {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/get-sticker-leaders`
        );
        setStickerLeaders(response.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStickerLeaders();
  }, []);

  useEffect(() => {
    setLoading(true);
    async function fetchLouvreLeaders() {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/get-louvre-leaders`
        );
        setLouvreLeaders(response.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLouvreLeaders();
  }, []);

  useEffect(() => {
    setLoading(true);
    async function fetchVoteLeaders() {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/leaderboard-get-louvre-votes`
        );
        setVoteLeaders(response.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVoteLeaders();
  }, []);

  const stickerRows = stickerLeaders.map((element, index) => (
    <Table.Tr key={element.created_by}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>
        {element.created_by == '' ? 'Satoshi Nakamoto' : element.created_by}
      </Table.Td>
      <Table.Td>{element.stickers_created}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  const louvreRows = louvreLeaders.map((element, index) => (
    <Table.Tr key={element.index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>
        {element.created_by == '' ? 'Satoshi Nakamoto' : element.created_by}
      </Table.Td>
      <Table.Td>{element.memes_created}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  const voteRows = voteLeaders.map((element, index) => (
    <Table.Tr key={element.index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>
        {element.created_by == '' ? 'Satoshi Nakamoto' : element.created_by}
      </Table.Td>
      <Table.Td>{element.meme_votes}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  if (loading) {
    return <Title align='center'>Loading Leaderboard</Title>;
  } else if (error) {
    return <Title align='center'>Error loading Leaderboard</Title>;
  }
  {
    return (
      <div>
        <Group justify='center' align='center'>
          <Title>Leaderboard</Title>
          <IconChartBar size={35} />
        </Group>

        <Paper withBorder p='md' m='md'>
          <Title order={2} mb='sm'>
            The Louvre Leaderboard
          </Title>

          <Group m='xs'>
            {' '}
            <Paper withBorder p='sm'>
              <Title order={6}>Meme Reactions</Title>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Rank</Table.Th>
                    <Table.Th>Created By</Table.Th>
                    <Table.Th>Reactions</Table.Th>
                    {/* <Table.Th></Table.Th>
              <Table.Th></Table.Th> */}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{voteRows}</Table.Tbody>
              </Table>
            </Paper>
            <Paper withBorder p='sm'>
              <Title order={6}>Memes Created</Title>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Rank</Table.Th>
                    <Table.Th>Created By</Table.Th>
                    <Table.Th>Created</Table.Th>
                    {/* <Table.Th></Table.Th>
              <Table.Th></Table.Th> */}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{louvreRows}</Table.Tbody>
              </Table>
            </Paper>
          </Group>
        </Paper>

        <Paper withBorder p='md' m='md'>
          <Title order={2} mb='sm'>
            Sticker Leaderboard
          </Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Rank</Table.Th>
                <Table.Th>Created By</Table.Th>
                <Table.Th>Stickers Created</Table.Th>
                {/* <Table.Th></Table.Th>
              <Table.Th></Table.Th> */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{stickerRows}</Table.Tbody>
          </Table>
        </Paper>
      </div>
    );
  }
};
export default Leaderboard;
