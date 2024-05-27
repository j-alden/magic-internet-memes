import React, { useState } from 'react';
import { fabric } from 'fabric';
import { Tabs } from '@mantine/core';
import stickers from '../helpers/stickers.js';

import { TextInput, Button, Group, Textarea } from '@mantine/core';

// Get sticker categories
const stickerCategories = [
  ...new Set(stickers.map((sticker) => sticker.category)),
];

const StickerPanel = ({ canvas }) => {
  const [inputText, setInputText] = useState(''); // State for the text input

  // Return JSX to display stickers for a given category
  const displayStickerCategory = (category) => {
    let categoryStickers = stickers.filter((sticker) => {
      return sticker.category === category;
    });

    return (
      <Tabs.Panel value={category} key={category}>
        {categoryStickers.map((sticker) => (
          <img
            key={sticker.id}
            src={sticker.src}
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
            onClick={() => addSticker(sticker.src)}
          />
        ))}
        {category == 'Text' ? (
          <Textarea
            label='Custom Text'
            onChange={(e) => setInputText(e.target.value)}
            value={inputText}
            inputContainer={(children) => (
              <Group align='flex-start'>
                {children}
                <Button onClick={addText} style={{}}>
                  Add Text
                </Button>
              </Group>
            )}
          />
        ) : null}
      </Tabs.Panel>
    );
  };

  // Add sticker to canvas
  const addSticker = (src) => {
    fabric.Image.fromURL(src, (img) => {
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
    });
  };

  // Add text to canvas
  const addText = () => {
    const text = new fabric.Text(inputText, {
      left: 100,
      top: 100,
      fill: 'black',
      fontSize: 30,
      selectable: true,
      stroke: '#2bf907',
      strokeWidth: 1,
      fontFamily: 'Poppin',
      //fontFamily: 'WizardFont',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  return (
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
      </Tabs.List>
      {stickerCategories.map((category) => displayStickerCategory(category))}
    </Tabs>
  );
};

export default StickerPanel;
