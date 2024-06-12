import React, { useState, useEffect } from 'react';
import {
  Title,
  Button,
  Text,
  Group,
  Modal,
  TextInput,
  FileButton,
  Loader,
  Combobox,
  useCombobox,
  Stack,
  InputBase,
  Input,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { IconAt, IconPhoto, IconPhotoUp } from '@tabler/icons-react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const CreateStickerModal = ({ stickerCategories }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [uploadError, setUploadError] = useState(false);
  const [finalLoader, setFinalLoader] = useState(false);
  const [finalUpload, setFinalUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [stickerUploadLoader, setStickerUploadLoader] = useState(false);
  const [stickerBlob, setStickerBlob] = useState(null);
  const [stickerUploaded, setStickerUploaded] = useState(false);
  const [category, setCategory] = useState(null);

  const stickerCombobox = useCombobox({
    onDropdownClose: () => stickerCombobox.resetSelectedOption(),
  });

  const options = stickerCategories.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

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
  useEffect(() => {
    //setLoading(true);

    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('name', formValues.name);
      formData.append('createdBy', formValues.createdBy);
      formData.append('category', category);

      async function uploadSticker() {}
      uploadSticker();
    }
  }, [file]);

  const uploadSticker = async (formValues) => {
    setFinalLoader(true);
    const formData = new FormData();
    formData.append('blob_url', stickerBlob.url);
    formData.append('name', formValues.name);
    formData.append('createdBy', formValues.createdBy);
    formData.append('category', category);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/upload-sticker`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      setFinalUpload(true);
      return response.data;
    } catch (err) {
      console.log(err);
      //setError(err.message);
    } finally {
      setFinalLoader(false);
      setCategory(null);
      setStickerBlob(null);
      setStickerUploaded(false);
      form.reset();
    }
  };

  const uploadTempSticker = async (uploadedFile) => {
    setStickerUploadLoader(true);
    console.log(uploadedFile);
    const formData = new FormData();
    formData.append('file', uploadedFile, uploadedFile.name);
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/upload-temp-sticker`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setStickerBlob(response.data);
      setStickerUploaded(true);
      setStickerUploadLoader(false);

      console.log(stickerBlob);
      return response.data;
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setStickerUploadLoader(false);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title={'Upload Community Sticker'}>
        <Stack>
          <Text>
            Upload a sticker for the community to re-use. Please don't abuse
            this or I'll take it away.
          </Text>
          <Group>
            <FileButton
              rightSection={<IconPhotoUp size={14} />}
              onChange={uploadTempSticker}
              accept='image/png'
            >
              {(props) => <Button {...props}>Select Image (PNG)</Button>}
            </FileButton>
            {stickerUploadLoader ? <Loader /> : null}
            {stickerUploaded ? <Text>Sticker seems legit...</Text> : null}
            {uploadError ? <Text>Error saving</Text> : null}
          </Group>

          <form onSubmit={form.onSubmit((values) => uploadSticker(values))}>
            <TextInput
              required
              label='Sticker Name'
              placeholder='Beard'
              key={form.key('name')}
              {...form.getInputProps('name')}
            />
            <TextInput
              label='Created By'
              leftSectionPointerEvents='none'
              placeholder='buyborrowdie'
              key={form.key('createdBy')}
              {...form.getInputProps('createdBy')}
            />
            <Combobox
              label='Category'
              required
              store={stickerCombobox}
              withinPortal={false}
              onOptionSubmit={(val) => {
                setCategory(val);
                stickerCombobox.closeDropdown();
              }}
            >
              <Combobox.Target>
                <InputBase
                  component='button'
                  type='button'
                  pointer
                  rightSection={<Combobox.Chevron />}
                  onClick={() => stickerCombobox.toggleDropdown()}
                  rightSectionPointerEvents='none'
                >
                  {category || (
                    <Input.Placeholder>Pick value</Input.Placeholder>
                  )}
                </InputBase>
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>

            <Group justify='flex-end' mt='md'>
              {finalLoader ? <Loader /> : null}
              {finalUpload ? <Text>Sticker added!</Text> : null}
              <Button
                type='submit'
                color='green'
                rightSection={<IconPhotoUp size={14} />}
              >
                Save Community Sticker
              </Button>
            </Group>
          </form>
        </Stack>
      </Modal>

      <Button variant='outline' onClick={open}>
        Create Sticker
      </Button>
    </>
  );
};
export default CreateStickerModal;
