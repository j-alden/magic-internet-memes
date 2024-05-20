let imageSRCs = [
  'wizard1.png',
  'wizard1-flipped.png',
  'full-face.png',
  'full-face-flipped.png',
  'face-wsb.png',
  'face-wsb-flipped.png',
  'metal-hat-face.png',
  'metal-hat-face-flipped.png',
  'hat1.png',
  'hat1-flipped.png',
  'hat2.png',
  'hat2-flipped.png',
  'beard1.png',
  'beard1-flipped.png',
  'beard2.png',
  'beard2-flipped.png',
  'cta-join-us.png',
  'cta-save-us.png',
  'cta-dilute-us.png',
  'cta-ruin-us.png',
  'pill1.png',
  'pill2.png',
  'staff-btc.png',
  'staff-pill.png',
  'text-mim.png',
  'text-mim-green.png',
  'text-very-satisfied.png',
  'text-waiting-for-clarification.png',
];

let stickers = [];

for (const i in imageSRCs) {
  stickers.push({
    id: i,
    src: `/stickers/${imageSRCs[i]}`,
    name: imageSRCs[i],
  });
}

export default stickers;
