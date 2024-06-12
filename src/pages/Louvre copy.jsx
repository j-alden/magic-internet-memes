import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce'; // Import debounce from lodash
import {
  MantineProvider,
  Container,
  AppShell,
  Grid,
  Paper,
  LoadingOverlay,
  Title,
  Button,
  Image,
  Text,
  Card,
  Anchor,
  Group,
  Flex,
  TextInput,
  Box,
  Stack,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import UploadCustomLouvreMeme from '../components/UploadCustomLouvreMeme';
import LikeButton from '../components/LikeButton';

// React query
import { useQueryClient } from '@tanstack/react-query';
import { useGetMemes } from '../hooks/useGetMemes';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Louvre = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const memes = useGetMemes();
  console.log(memes);

  useEffect(() => {
    setFilteredImages(memes);
  }, []);

  // useEffect(() => {
  //   setLoading(true);

  //   async function getMemes() {
  //     const data = useGetMemes();
  //     setImages(data);
  //     setFilteredImages(data); // Initialize with full list

  //     setLoading(false);
  //   }

  //   getMemes();

  //   // async function fetchImages() {
  //   //   try {
  //   //     const response = await axios.get(`${apiBaseUrl}/api/get-louvre-images`);
  //   //     setImages(response.data);
  //   //     setFilteredImages(response.data); // Initialize with full list
  //   //   } catch (err) {
  //   //     setError(err.message);
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }
  //   // }
  //   // fetchImages();
  // }, []);

  // Regular function to filter images
  const filterImages = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = images.filter(
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

      setFilteredImages(
        images.filter(
          (image) =>
            (image.title ? image.title.toLowerCase() : '').includes(
              lowerCaseQuery
            ) ||
            (image.createdBy ? image.createdBy.toLowerCase() : '').includes(
              lowerCaseQuery
            )
        )
      );
    }, 300),
    [images]
  );

  // Debounced version of the filterImages function
  const debouncedFilterImages = useCallback(debounce(filterImages, 300), [
    images,
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

  if (filteredImages) {
    return <div>Loading</div>;
  }

  return (
    <Paper>
      <Stack mb='md' align='center' w='100%'>
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
        <Group>
          <TextInput
            placeholder='Search by title or creator'
            value={searchQuery}
            onChange={handleSearchChange}
            ml='xl'
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
            key={image.title}
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

              <LikeButton
                meme={image}
                setImages={setImages}
                setFilteredImages={setFilteredImages}
              />
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
