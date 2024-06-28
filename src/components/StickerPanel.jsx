import React, { useState, useEffect } from 'react';
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
  Loader,
} from '@mantine/core';
//import stickers from '../helpers/stickers.js';
import UploadStickerPanel from './UploadStickerPanel.jsx';
import CreateStickerModal from './CreateStickerModal.jsx';

// Import custom font
import WebFont from 'webfontloader';

// React query
import { useGetStickers } from '../hooks/useGetStickers.js';
import { v4 as uuidv4 } from 'uuid'; // Use uuid for unique sticker IDs

const StickerPanel = ({
  canvas,
  isGif,
  setStickers,
  currentFrameIndexRef,
  gifStickers,
  addGifSticker,
  framesRef,
}) => {
  const [inputText, setInputText] = useState(''); // State for the text input
  const [textColor, setTextColor] = useState('#2bf907');
  const [stickerCategories, setStickerCategories] = useState([]); // stickers to display
  const [showCommunityStickers, setShowCommunityStickers] = useState(false);
  const {
    isPending,
    isError,
    data: stickers,
    error: stickerError,
  } = useGetStickers(showCommunityStickers);

  useEffect(() => {
    if (stickers) {
      setStickerCategories([
        ...new Set(stickers.map((sticker) => sticker.category)),
      ]);
    }
  }, [stickers]);

  // Load font immediately to fix custom text being added with wrong font initially
  useEffect(() => {
    WebFont.load({
      custom: {
        families: ['MagicInternetMoney'],
        url: ['srcApp.css'],
      },
    });
  }, []);

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
    if (isGif) {
      // Ensure gifStickers is initialized
      const newStickers = { ...gifStickers.current };

      const stickerId = uuidv4(); // Generate a unique ID for the sticker

      // Iterate from the current frame index to the end
      for (
        let i = currentFrameIndexRef.current;
        i < framesRef.current.length;
        i++
      ) {
        // Initialize the stickers array for the frame if it doesn't exist
        if (!newStickers[i]) {
          newStickers[i] = [];
        }

        fabric.Image.fromURL(
          src,
          (img) => {
            img.scaleToWidth(125);
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
              id: stickerId,
            });
            newStickers[i].push(img);
            // If it's the current frame, add the sticker to the canvas as well
            if (i === currentFrameIndexRef.current) {
              canvas.add(img);
              canvas.renderAll(); // Ensure the canvas updates immediately
            }
          },
          { crossOrigin: 'anonymous' }
        );
      }
      setStickers(newStickers);
    } else {
      fabric.Image.fromURL(
        src,
        (img) => {
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
    }
  };

  // Add text to canvas
  const addText = () => {
    const text = new fabric.Text(inputText, {
      fontFamily: 'MagicInternetMoney',
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

      //fontFamily: 'WizardFont',
    });
    canvas.add(text);

    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  if (isPending) {
    return (
      <Paper withBorder p='xs' mt='xs'>
        {/* <Title order={3}>Loading Stickers...</Title> */}
        <Title order={3}>Choose Stickers</Title>
        <Loader />
      </Paper>
    );
  }

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
        {stickerCategories.map((category) => displayStickerCategory(category))}
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
};

export default StickerPanel;
