import React from 'react';
import { Paper, Title, Table, Group } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';

// React Query
import { useGetLouvreCreatedLeaders } from '../hooks/useGetLouvreCreatedLeaders';
import { useGetLouvreVoteLeaders } from '../hooks/useGetLouvreVoteLeaders';
import { useGetStickerLeaders } from '../hooks/useGetStickerLeaders';

const Leaderboard = () => {
  const {
    isPending: isLcPending,
    isError: isLcError,
    data: lcLeaders,
    error: lcError,
  } = useGetLouvreCreatedLeaders();
  const {
    isPending: isLvPending,
    isError: isLvError,
    data: lvLeaders,
    error: lvError,
  } = useGetLouvreVoteLeaders();
  const {
    isPending: isStickersPending,
    isError: isStickersError,
    data: stickerLeaders,
    error: sError,
  } = useGetStickerLeaders();

  // Don't display if data isn't loaded
  if (isLcPending || isLvPending || isStickersPending) {
    return <Title align='center'>Loading Leaderboard</Title>;
  }

  const stickerRows = stickerLeaders.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>
        {element.created_by == '' ? 'Satoshi Nakamoto' : element.created_by}
      </Table.Td>
      <Table.Td>{element.stickers_created}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  const louvreRows = lcLeaders.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>
        {element.created_by == '' ? 'Satoshi Nakamoto' : element.created_by}
      </Table.Td>
      <Table.Td>{element.memes_created}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  const voteRows = lvLeaders.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>
        {element.created_by == '' ? 'Satoshi Nakamoto' : element.created_by}
      </Table.Td>
      <Table.Td>{element.meme_votes}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

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
};
export default Leaderboard;
