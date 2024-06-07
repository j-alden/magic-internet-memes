import React, { useState, useEffect } from 'react';
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
  Modal,
  TextInput,
  FileButton,
  Loader,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { IconAt, IconPhoto, IconPhotoUp } from '@tabler/icons-react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const UploadCustomLouvreMeme = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [memeUploadLoader, setMemeUploadLoader] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [memeBlob, setMemeBlob] = useState(null);
  const [memeUploaded, setMemeUploaded] = useState(false);
  const [finalUpload, setFinalUpload] = useState(false);
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      //   title: 'Hearing Things',
      //   termsOfService: false,
      //createdBy: 'buy',
    },
    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  const uploadTemptToLouvre = async (uploadedFile) => {
    setMemeUploadLoader(true);
    console.log(uploadedFile);
    const formData = new FormData();
    formData.append('file', uploadedFile, uploadedFile.name);
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/upload-meme`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMemeBlob(response.data);
      setMemeUploaded(true);
      setMemeUploadLoader(false);
      return response.data;
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setMemeUploadLoader(false);
    }
  };
  const uploadToLouvre = async (formValues) => {
    setShowLoader(true); // make loader visible
    console.log(formValues);
    const formData = new FormData();
    formData.append('blob_url', memeBlob.url);
    formData.append('title', formValues.title);
    formData.append('createdBy', formValues.createdBy);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/copy-to-vault`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setShowLoader(false); // disable loader
      setFinalUpload(true);
      console.log(response.data);
      return response.data;
    } catch (error) {
      setUploadError(error);
      console.error('Error uploading image to blob storage', error);
      setShowLoader(false); // disable loader
      throw error;
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title='Hang it in the Louvre'>
        <Group>
          <FileButton
            rightSection={<IconPhotoUp size={14} />}
            onChange={uploadTemptToLouvre}
            // accept='image/png,image/jpeg'
            accept='image/jpeg'
          >
            {(props) => <Button {...props}>Select Image (JPG)</Button>}
          </FileButton>
          {memeUploadLoader ? <Loader /> : null}
          {memeUploaded ? <Text>Meme seems legit...</Text> : null}
          {uploadError ? <Text>Error saving</Text> : null}
        </Group>
        <form onSubmit={form.onSubmit((values) => uploadToLouvre(values))}>
          <TextInput
            label='Meme Title'
            placeholder='Hearing Things...'
            key={form.key('title')}
            {...form.getInputProps('title')}
          />
          <TextInput
            label='Created By'
            leftSectionPointerEvents='none'
            placeholder='buyborrowdie'
            key={form.key('createdBy')}
            {...form.getInputProps('createdBy')}
          />
          <Group justify='flex-end' mt='md'>
            {showLoader ? <Loader color='green' /> : null}
            {finalUpload ? (
              <Text>
                Image hung in{' '}
                <Link to='/louvre' target='_blank'>
                  The Louvre
                </Link>
              </Text>
            ) : null}

            {uploadError ? <Text>Error saving</Text> : null}
            <Button
              type='submit'
              color='green'
              rightSection={<IconPhotoUp size={14} />}
            >
              Hang It
            </Button>
          </Group>
        </form>
      </Modal>

      <Button variant='subtle' onClick={open} mb='xs'>
        Hang Your Meme
      </Button>
    </>
  );
};
export default UploadCustomLouvreMeme;
