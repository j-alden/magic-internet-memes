import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce'; // Import debounce from lodash
import {
  Paper,
  Title,
  Image,
  Text,
  Card,
  Anchor,
  Group,
  Flex,
  TextInput,
  Stack,
  Select,
  Loader,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import UploadCustomLouvreMeme from '../components/UploadCustomLouvreMeme';
import LikeButton from '../components/LikeButton';

// React query
import { useGetMemes } from '../hooks/useGetMemes';

const Louvre = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState();
  const [sortBy, setSortBy] = useState('New'); // Handle image sorting
  const { isPending, isError, data: memes, error } = useGetMemes(sortBy);

  useEffect(() => {
    setFilteredImages(memes);
  }, [memes]);

  // Regular function to filter images
  const filterImages = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = memes.filter(
      (image) =>
        (image.title ? image.title.toLowerCase() : '').includes(
          lowerCaseQuery
        ) ||
        (image.createdBy ? image.createdBy.toLowerCase() : '').includes(
          lowerCaseQuery
        )
    );
    setFilteredImages(filtered);
  };

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((query) => {
      const lowerCaseQuery = query.toLowerCase();

      if (memes) {
        setFilteredImages(
          memes.filter(
            (image) =>
              (image.title ? image.title.toLowerCase() : '').includes(
                lowerCaseQuery
              ) ||
              (image.createdBy ? image.createdBy.toLowerCase() : '').includes(
                lowerCaseQuery
              )
          )
        );
      }
    }, 300),
    [memes]
  );

  // Debounced version of the filterImages function
  const debouncedFilterImages = useCallback(debounce(filterImages, 300), [
    memes,
  ]);

  // Update search query and debounced filtering
  const handleSearchChange = (event) => {
    const query = event.currentTarget.value;
    setSearchQuery(query);
    debouncedFilterImages(query);
  };

  useEffect(() => {
    debouncedFilter(searchQuery);
  }, [searchQuery, debouncedFilter]);

  if (filteredImages == null) {
    return (
      <Paper>
        <Stack mb='md' align='center' w='100%' justify='space-between'>
          <Group>
            <Title>The Louvre</Title>
            <Image
              src='./framed-picture.png'
              h='30'
              w='auto'
              // align='center'
              // float='right'
              // style={{ display: 'inline-block' }}
            />
          </Group>
          <Group align='flex-end' justify='space-between'>
            <Select
              data={['New', 'Hot']}
              value={sortBy}
              onChange={setSortBy}
              label='Sort by'
            />
            <TextInput
              placeholder='Search by title or creator'
              value={searchQuery}
              onChange={handleSearchChange}
              label='Search'
            />
            <UploadCustomLouvreMeme />
          </Group>
          <Loader />
        </Stack>
      </Paper>
    );
  }
  return (
    <Paper>
      <Stack mb='md' align='center' w='100%' justify='space-between'>
        <Group>
          <Title>The Louvre</Title>
          <Image
            src='./framed-picture.png'
            h='30'
            w='auto'
            // align='center'
            // float='right'
            // style={{ display: 'inline-block' }}
          />
        </Group>
        <Group align='flex-end' justify='space-between'>
          <Select
            data={['New', 'Hot']}
            value={sortBy}
            onChange={setSortBy}
            label='Sort by'
          />

          <TextInput
            placeholder='Search by title or creator'
            value={searchQuery}
            onChange={handleSearchChange}
            label='Search'
          />
          <UploadCustomLouvreMeme />
        </Group>
      </Stack>
      <Flex
        gap='xs'
        justify='center'
        align='center'
        direction='row'
        wrap='wrap'
      >
        {filteredImages.map((image) => (
          <Card
            shadow='sm'
            padding='lg'
            radius='md'
            //m='sm'
            //maw='33%'
            withBorder
            key={image.meme_id}
          >
            <Card.Section align='center'>
              <Link to={image.blob_url} target='_blank'>
                <Image
                  src={image.blob_url}
                  mah={350}
                  maw={350}
                  alt={image.title}
                  w='auto'
                  fit='contain'
                />
              </Link>
            </Card.Section>
            <Group mt='xs'>
              <Text fw={500} size='lg'>
                {image.title ? image.title : 'Unknown'}
              </Text>
            </Group>
            <Group justify='space-between'>
              <Text mt='xs' c='dimmed' size='sm'>
                {image.created_by ? (
                  <Anchor
                    underline='never'
                    href={`https://twitter.com/${image.created_by}`}
                  >
                    {`@${image.created_by}`}
                  </Anchor>
                ) : (
                  'Satoshi Nakamoto'
                )}
              </Text>

              <LikeButton meme={image} setFilteredImages={setFilteredImages} />
            </Group>
          </Card>
        ))}
      </Flex>
    </Paper>
  );

  // if (loading) {
  //   return <Title>Loading art</Title>;
  // } else if (error) {
  //   <Title>Error loading art</Title>;
  // } else {
  //   return (
  //     <Container>
  //       <Group justify='center'>
  //         <TextInput
  //           placeholder='Search by title or creator'
  //           value={searchQuery}
  //           onChange={handleSearchChange}
  //           mb='md'
  //         />
  //         <UploadCustomLouvreMeme />
  //       </Group>

  //       <Flex
  //         gap='xs'
  //         justify='flex-start'
  //         align='flex-start'
  //         direction='row'
  //         wrap='wrap'
  //       >
  //         {filteredImages.map((image) => (
  //           <Card
  //             shadow='sm'
  //             padding='lg'
  //             radius='md'
  //             //m='sm'
  //             //maw='33%'
  //             withBorder
  //             key={image.title}
  //           >
  //             <Card.Section>
  //               <Link to={image.blob_url} target='_blank'>
  //                 <Image
  //                   src={image.blob_url}
  //                   mah={350}
  //                   maw={350}
  //                   alt={image.title}
  //                   w='auto'
  //                   fit='contain'
  //                 />
  //               </Link>
  //             </Card.Section>
  //             <Group>
  //               <Text fw={500} size='lg' mt='xs'>
  //                 {image.title ? image.title : 'Unknown'}
  //               </Text>
  //               <LikeButton
  //                 meme={image}
  //                 setImage={setImages}
  //                 setFilteredImages={setFilteredImages}
  //               />
  //             </Group>

  //             <Text mt='xs' c='dimmed' size='sm'>
  //               {image.created_by ? (
  //                 <Anchor
  //                   underline='never'
  //                   href={`https://twitter.com/${image.created_by}`}
  //                 >
  //                   {`@${image.created_by}`}
  //                 </Anchor>
  //               ) : (
  //                 'Satoshi Nakamoto'
  //               )}
  //             </Text>
  //           </Card>
  //         ))}
  //       </Flex>
  //     </Container>
  //   );
  // }
};

export default Louvre;
