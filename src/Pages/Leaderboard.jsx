import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Title, Table, Group } from '@mantine/core';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Leaderboard = () => {
  const [stickerLeaders, setStickerLeaders] = useState([]);
  const [louvreLeaders, setLouvreLeaders] = useState([]);
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
        console.log(stickerLeaders);
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
        console.log(louvreLeaders);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLouvreLeaders();
  }, []);

  const stickerRows = stickerLeaders.map((element) => (
    <Table.Tr key={element.created_by}>
      <Table.Td>
        {element.created_by == '' ? 'Satoshi Nakamoto' : element.created_by}
      </Table.Td>
      <Table.Td>{element.stickers_created}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  const louvreRows = louvreLeaders.map((element) => (
    <Table.Tr key={element.created_by}>
      <Table.Td>
        {element.created_by == '' ? 'Satoshi Nakamoto' : element.created_by}
      </Table.Td>
      <Table.Td>{element.memes_created}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  if (loading) {
    return <Title>Loading Leaderboard</Title>;
  } else if (error) {
    return <Title>Error loading Leaderboard</Title>;
  }
  {
    return (
      <div>
        <Paper withBorder p='md' m='md'>
          <Title order={2} mb='sm'>
            The Louvre Leaderboard
          </Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Created By</Table.Th>
                <Table.Th>Memes Created</Table.Th>
                {/* <Table.Th></Table.Th>
              <Table.Th></Table.Th> */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{louvreRows}</Table.Tbody>
          </Table>
        </Paper>
        <Paper withBorder p='md' m='md'>
          <Title order={2} mb='sm'>
            Sticker Leaderboard
          </Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
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
