let imageSRCs = [
  { file: 'full-face.png', category: 'Faces' },
  { file: 'full-face-3.png', category: 'Faces', artist: 'mavensbot' },
  { file: 'full-face2.png', category: 'Faces' },
  { file: 'face-wsb.png', category: 'Faces' },
  { file: 'metal-hat-face.png', category: 'Faces', artist: 'Daya_MsPaintBos' },
  {
    file: 'full-face-satisfied.png',
    category: 'Faces',
    artist: 'Daya_MsPaintBos',
  },
  { file: 'hat1.png', category: 'Hats' },
  { file: 'hat2.png', category: 'Hats' },
  { file: 'hat3.png', category: 'Hats' },
  { file: 'hat4.png', category: 'Hats' },
  { file: 'hat5.png', category: 'Hats', artist: 'Daya_MsPaintBos' },
  { file: 'hat-mzga.png', category: 'Hats', artist: 'Daya_MsPaintBos' },
  { file: 'beard4.png', category: 'Beards', artist: 'Daya_MsPaintBos' },
  { file: 'beard1.png', category: 'Beards' },
  { file: 'beard2.png', category: 'Beards', artist: 'smolpotat0_x' },
  { file: 'beard3.png', category: 'Beards', artist: 'smolpotat0_x' },
  { file: 'beard5.png', category: 'Beards', artist: 'smolpotat0_x' },
  { file: 'beard6.png', category: 'Beards', artist: 'smolpotat0_x' },
  { file: 'wizard1.png', category: 'Wizards', artist: 'mavensbot' },
  { file: 'wizard2.png', category: 'Wizards', artist: 'Daya_MsPaintBos' },
  {
    file: 'wizard-patient.png',
    category: 'Wizards',
    artist: 'Daya_MsPaintBos',
  },
  {
    file: 'wizard-prorata.png',
    category: 'Wizards',
    artist: 'Daya_MsPaintBos',
  },
  {
    file: 'wizard-pointing1.png',
    category: 'Wizards',
    artist: 'Daya_MsPaintBos',
  },
  {
    file: 'wizard-pointing2.png',
    category: 'Wizards',
    artist: 'Daya_MsPaintBos',
  },
  {
    file: 'wizard-mavenstate.png',
    category: 'Wizards',
    artist: 'Daya_MsPaintBos',
  },
  { file: 'gladiator.png', category: 'Wizards', artist: 'Daya_MsPaintBos' },
  { file: 'text-mim.png', category: 'Text', artist: 'buyborrowdie' },
  { file: 'text-mim-green.png', category: 'Text', artist: 'buyborrowdie' },
  { file: 'text-mim2.png', category: 'Text', artist: 'Daya_MsPaintBos' },
  { file: 'text-mim-green2.png', category: 'Text', artist: 'Daya_MsPaintBos' },
  {
    file: 'text-very-satisfied.png',
    category: 'Text',
    artist: 'Daya_MsPaintBos',
  },
  {
    file: 'text-waiting-for-clarification.png',
    category: 'Text',
    artist: 'Daya_MsPaintBos',
  },
  { file: 'text-do-something.png', category: 'Text', artist: 'buyborrowdie' },
  { file: 'text-wen.png', category: 'Text', artist: 'Daya_MsPaintBos' },
  { file: 'text-migration.png', category: 'Text', artist: 'Daya_MsPaintBos' },
  { file: 'fivestars.png', category: 'Text', artist: 'Daya_MsPaintBos' },
  { file: 'cta-join-us.png', category: 'Buttons', artist: 'mavensbot' },
  { file: 'cta-save-us.png', category: 'Buttons', artist: 'Daya_MsPaintBos' },
  { file: 'cta-dilute-us.png', category: 'Buttons', artist: 'Daya_MsPaintBos' },
  { file: 'cta-ruin-us.png', category: 'Buttons', artist: 'Daya_MsPaintBos' },
  { file: 'cta-help-us.png', category: 'Buttons', artist: 'Daya_MsPaintBos' },
  { file: 'cta-hihihaha.png', category: 'Buttons', artist: 'Daya_MsPaintBos' },
  { file: 'cta-rug-us.png', category: 'Buttons', artist: 'Daya_MsPaintBos' },
  { file: 'cta-zero.png', category: 'Buttons' },
  {
    file: 'cta-unbothered.png',
    category: 'Buttons',
    artist: 'Daya_MsPaintBos',
  },
  { file: 'pill1.png', category: 'Pills' },
  { file: 'pill2.png', category: 'Pills' },
  { file: 'staff-btc.png', category: 'Staffs' },
  //{ file: 'staff-btc2.png', category: 'Staff' },
  { file: 'staff-pill.png', category: 'Staffs', artist: 'mavensbot' },
  { file: 'mavenstate.png', category: 'Misc', artist: 'Daya_MsPaintBos' },
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
