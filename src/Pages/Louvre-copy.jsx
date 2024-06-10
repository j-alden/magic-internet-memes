import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MantineProvider,
  AppShell,
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
} from '@mantine/core';
import { Link } from 'react-router-dom';
import UploadCustomLouvreMeme from '../components/UploadCustomLouvreMeme';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Louvre = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchImages() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/get-louvre-images`);
        setImages(response.data);
        console.log(images);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  if (loading) {
    return <Title>Loading art</Title>;
  } else if (error) {
    <Title>Error loading art</Title>;
  } else {
    return (
      <Paper>
        <UploadCustomLouvreMeme />
        <Flex
          gap='xs'
          justify='flex-start'
          align='flex-start'
          direction='row'
          wrap='wrap'
        >
          {images.map((image) => (
            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              //m='sm'
              //maw='33%'
              withBorder
            >
              <Card.Section align='center'>
                <Link to={image.blob_url} target='_blank'>
                  <Image
                    src={image.blob_url}
                    mah={400}
                    maw={400}
                    alt={image.title}
                    w='auto'
                    fit='contain'
                  />
                </Link>
              </Card.Section>
              <Text fw={500} size='lg' mt='xs'>
                {image.title ? image.title : 'Unknown'}
              </Text>
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
            </Card>
          ))}
        </Flex>
      </Paper>
    );
  }
};
export default Louvre;
