import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Group,
  Stack,
  TextInput,
  rem,
  Title,
  Text,
  Paper,
  Image,
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconAt, IconPhoto, IconPhotoUp } from '@tabler/icons-react';

// API Calls
import axios from 'axios';
import { Link } from 'react-router-dom';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const UploadtoVaultForm = ({ blob, blob_url, isGif }) => {
  const [visible, { toggle }] = useDisclosure(false);
  const [showLoader, setShowLoader] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
  const framedPicture = <Image src='./' />;

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

  const uploadToLouvre = async (formValues) => {
    setShowLoader(true); // make loader visible
    let fileName = '';
    if (isGif) {
      fileName = 'magic-meme.gif';
    } else {
      fileName = 'magic-meme.jpg';
    }

    const formData = new FormData();
    formData.append('file', blob, fileName);
    formData.append('blob_url', blob_url);
    formData.append('title', formValues.title);
    formData.append('createdBy', formValues.createdBy);

    try {
      const response = await axios.post(
        // `${apiBaseUrl}/api/copy-to-vault`,
        `${apiBaseUrl}/api/upload-to-vault`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setShowLoader(false); // disable loader
      setImageUploaded(true);
      return response.data;
    } catch (error) {
      setUploadError(error);
      console.error('Error uploading image to blob storage', error);
      setShowLoader(false); // disable loader
      throw error;
    }
  };

  return (
    <Paper withBorder p='sm' align='flex-end'>
      <Stack>
        <Title order={2} justify='flex-start'>
          {`Hang it in the Louvre `}
          <Image
            src='./framed-picture.png'
            h='25'
            w='auto'
            align='center'
            float='right'
            style={{ display: 'inline-block' }}
          />
        </Title>
        <Text>
          The Louvre is where your masterpiece is displayed for the world,
          allowing wizardios everywhere to see it. Title and Twitter handle are
          optional, but make your meme easier to find and give some internet
          clout.
        </Text>

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
            leftSection={icon}
            placeholder='buyborrowdie'
            key={form.key('createdBy')}
            {...form.getInputProps('createdBy')}
          />

          {/* <Checkbox
        mt='md'
        label='I agree to sell my privacy'
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      /> */}

          <Group justify='flex-end' mt='md'>
            {showLoader ? <Loader color='green' /> : null}
            {imageUploaded ? (
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
      </Stack>
    </Paper>
  );
};

export default UploadtoVaultForm;
