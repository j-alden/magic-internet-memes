import React, { useState } from 'react';
import { fabric } from 'fabric';
import { Button, Tabs, TextInput } from '@mantine/core';

let imageSRCs = [
  { file: 'full-face.png', category: 'Faces' },
  { file: 'full-face2.png', category: 'Faces' },
  { file: 'face-wsb.png', category: 'Faces' },
  { file: 'metal-hat-face.png', category: 'Faces' },
  { file: 'full-face-satisfied.png', category: 'Faces' },
  { file: 'hat1.png', category: 'Hats' },
  { file: 'hat2.png', category: 'Hats' },
  { file: 'hat3.png', category: 'Hats' },
  { file: 'hat4.png', category: 'Hats' },
  { file: 'hat-mzga.png', category: 'Hats' },
  { file: 'beard1.png', category: 'Beards' },
  { file: 'beard2.png', category: 'Beards' },
  { file: 'beard3.png', category: 'Beards' },
  { file: 'wizard1.png', category: 'Wizards' },
  { file: 'wizard2.png', category: 'Wizards' },
  { file: 'wizard-patient.png', category: 'Wizards' },
  { file: 'wizard-prorata.png', category: 'Wizards' },
  { file: 'wizard-pointing1.png', category: 'Wizards' },
  { file: 'wizard-pointing2.png', category: 'Wizards' },
  { file: 'wizard-mavenstate.png', category: 'Wizards' },
  { file: 'gladiator.png', category: 'Wizards' },
  { file: 'cta-join-us.png', category: 'Buttons' },
  { file: 'cta-save-us.png', category: 'Buttons' },
  { file: 'cta-dilute-us.png', category: 'Buttons' },
  { file: 'cta-ruin-us.png', category: 'Buttons' },
  { file: 'cta-help-us.png', category: 'Buttons' },
  { file: 'cta-hihihaha.png', category: 'Buttons' },
  { file: 'cta-rug-us.png', category: 'Buttons' },
  { file: 'cta-zero.png', category: 'Buttons' },
  { file: 'pill1.png', category: 'Pills' },
  { file: 'pill2.png', category: 'Pills' },
  { file: 'staff-btc.png', category: 'Staffs' },
  //{ file: 'staff-btc2.png', category: 'Staff' },
  { file: 'staff-pill.png', category: 'Staffs' },
  { file: 'text-mim.png', category: 'Text' },
  { file: 'text-mim-green.png', category: 'Text' },
  { file: 'text-mim2.png', category: 'Text' },
  { file: 'text-mim-green2.png', category: 'Text' },
  { file: 'text-very-satisfied.png', category: 'Text' },
  { file: 'text-waiting-for-clarification.png', category: 'Text' },
  { file: 'text-do-something.png', category: 'Text' },
  { file: 'text-wen.png', category: 'Text' },
  { file: 'fivestars.png', category: 'Text' },
  { file: 'mavenstate.png', category: 'Misc' },
  { file: 'hand.png', category: 'Misc' },
];

let stickers = [];

for (const i in imageSRCs) {
  stickers.push({
    id: i,
    src: `/stickers/${imageSRCs[i].file}`,
    name: imageSRCs[i].file,
    category: imageSRCs[i].category,
  });
}

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
        {/* {category == 'Text' ? (
          <div>
            <TextInput
              label='Enter custom text'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button onClick={addText}>Add Text</Button>
          </div>
        ) : null} */}
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
      fontSize: 20,
      selectable: true,
      fontFamily: 'WizardFont',
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
