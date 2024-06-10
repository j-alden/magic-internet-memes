import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fabric } from 'fabric';
import {
  Button,
  Paper,
  Textarea,
  Radio,
  Stack,
  Group,
  Text,
  Title,
  Tabs,
  Switch,
} from '@mantine/core';
//import stickers from '../helpers/stickers.js';
import UploadStickerPanel from './UploadStickerPanel.jsx';
import UploadCommunitySticker from './UploadCommunitySticker.jsx';
import CreateStickerModal from './CreateStickerModal.jsx';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Get sticker categories
// const stickerCategories = [
//   ...new Set(stickers.map((sticker) => sticker.category)),
// ];

const StickerPanel = ({ canvas }) => {
  const [inputText, setInputText] = useState(''); // State for the text input
  const [textColor, setTextColor] = useState('#2bf907');
  const [stickers, setStickers] = useState([]); // stickers to display
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stickerCategories, setStickerCategories] = useState([]); // stickers to display
  const [showCommunityStickers, setShowCommunityStickers] = useState(false);

  // Initialize Fabric canvas only once
  // useEffect(() => {
  //   setLoading(true);
  //   async function fetchStickers() {
  //     try {
  //       const response = await axios.get(
  //         `${apiBaseUrl}/api/get-default-stickers`
  //       );
  //       setStickers(response.data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchStickers();
  // }, []);
  useEffect(() => {
    setLoading(true);
    async function fetchStickers() {
      try {
        let requestUrl;
        if (showCommunityStickers) {
          requestUrl = `${apiBaseUrl}/api/get-all-stickers`;
        } else {
          requestUrl = `${apiBaseUrl}/api/get-default-stickers`;
        }
        const response = await axios.get(requestUrl);
        setStickers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStickers();
  }, [showCommunityStickers]);

  useEffect(() => {
    setStickerCategories([
      ...new Set(stickers.map((sticker) => sticker.category)),
    ]);
  }, [stickers]);

  // Return JSX to display stickers for a given category
  const displayStickerCategory = (category) => {
    let categoryStickers = stickers.filter((sticker) => {
      return sticker.category === category;
    });

    return (
      <Tabs.Panel value={category} key={category}>
        {categoryStickers.map((sticker) => (
          <img
            key={sticker.sticker_id}
            src={sticker.blob_url}
            alt={sticker.name}
            height={
              sticker.category == 'Buttons' || sticker.category == 'Text'
                ? null
                : 70
            }
            width={
              sticker.category == 'Buttons' || sticker.category == 'Text'
                ? 70
                : null
            }
            onClick={() => addSticker(sticker.blob_url)}
          />
        ))}
        {category == 'Text' ? (
          <Paper withBorder p='sm' mt='xs' maw='50%'>
            <Textarea
              label='Add Custom Text'
              //size='lg'
              //height='100%'
              resize='both'
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
              inputContainer={(children) => (
                // <Group align='flex-start'>
                <div>
                  {children}
                  <Radio.Group
                    name='color'
                    label='Text Color'
                    value={textColor}
                    onChange={setTextColor}
                    align='flex-start'
                    mt='xs'
                  >
                    <Group mb='xs'>
                      <Radio value='#2bf907' label='Green' checked />
                      <Radio value='#78e5eb' label='Blue' />
                      <Button onClick={addText} style={{}}>
                        Add Text
                      </Button>
                    </Group>
                  </Radio.Group>
                </div>
              )}
            />
          </Paper>
        ) : null}
      </Tabs.Panel>
    );
  };

  // Add sticker to canvas
  const addSticker = (src) => {
    fabric.Image.fromURL(
      src,
      (img) => {
        // // Hack to avoid
        // img.setSrc(src, null, {
        //   crossOrigin: 'anonymous',
        // });

        // Removed sticker scaling for now
        img.scaleToWidth(125);
        //img.scaleToHeight(150);
        img.set({
          left: 100,
          top: 100,
          angle: 0,
          borderColor: 'red',
          cornerColor: 'red',
          cornerSize: 9,
          transparentCorners: false,
          hasControls: true,
          selectable: true,
          lockScalingFlip: true,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
      },
      // cross origin to anomyous is a hack to get around error
      // When I switched to pulling from vercel blob store, got CORS error
      // Should look into updating Access-Control-Allow-Origin
      // https://stackoverflow.com/questions/31038027/why-does-adding-crossorigin-break-fabric-image-fromurl
      { crossOrigin: 'anonymous' }
    );
  };

  // Add text to canvas
  const addText = () => {
    const text = new fabric.Text(inputText, {
      left: 100,
      top: 100,
      fill: 'black',
      fontSize: 30,
      bold: true,
      //charSpacing: -50,
      selectable: true,
      paintFirst: 'stroke',
      stroke: textColor,
      strokeWidth: 4,
      fontFamily: 'MagicInternetMoney',
      //fontFamily: 'WizardFont',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  if (loading) {
    return (
      <Paper withBorder p='xs' mt='xs'>
        <Title order={3}>Loading Stickers...</Title>
      </Paper>
    );
  } else {
    return (
      <Paper withBorder p='xs' mt='xs'>
        <Group justify='space-between'>
          <Group>
            <Title order={3}>Choose Stickers</Title>
            <CreateStickerModal stickerCategories={stickerCategories} />
          </Group>

          <Switch
            checked={showCommunityStickers}
            onChange={(event) =>
              setShowCommunityStickers(event.currentTarget.checked)
            }
            label='Include Community Stickers'
            // style={{
            //   //display: 'inline-block',
            //   float: 'right',
            // }}
          />
        </Group>

        <Tabs
          defaultValue='Faces'
          styles={{
            root: {
              width: '100%',
              display: 'inline-block',
              gap: '10px',
              marginTop: '10px',
              //height: '150px',
            },
            list: {},
            panel: {
              cursor: 'pointer',
              display: 'inline-block',
              marginTop: '10px',
            },
          }}
        >
          <Tabs.List>
            {stickerCategories.map((category) => (
              <Tabs.Tab value={category} key={category}>
                {category}
              </Tabs.Tab>
            ))}
            <Tabs.Tab value='Add Custom' key='custom'>
              Add Custom
            </Tabs.Tab>
          </Tabs.List>
          {stickerCategories.map((category) =>
            displayStickerCategory(category)
          )}
          <Tabs.Panel value={'Add Custom'} key='custom'>
            <Text>
              Upload an image to use as a one-off sticker. If you want it to be
              re-usable, upload to the community below.
            </Text>
            <UploadStickerPanel canvas={canvas} />
            {/* <UploadCommunitySticker /> */}
          </Tabs.Panel>
        </Tabs>
      </Paper>
    );
  }
};

export default StickerPanel;
