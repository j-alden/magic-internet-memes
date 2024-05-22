let imageSRCs = [
  { file: 'full-face.png', category: 'Faces' },
  { file: 'full-face2.png', category: 'Faces' },
  { file: 'face-wsb.png', category: 'Faces' },
  { file: 'metal-hat-face.png', category: 'Faces' },
  { file: 'hat1.png', category: 'Hats' },
  { file: 'hat2.png', category: 'Hats' },
  { file: 'hat3.png', category: 'Hats' },
  { file: 'hat4.png', category: 'Hats' },
  { file: 'hat-mzga.png', category: 'Hats' },
  { file: 'beard1.png', category: 'Beards' },
  { file: 'beard2.png', category: 'Beards' },
  { file: 'wizard1.png', category: 'Wizards' },
  { file: 'wizard2.png', category: 'Wizards' },
  { file: 'wizard-patient.png', category: 'Wizards' },
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

export default stickers;
