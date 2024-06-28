import { createCanvas, loadImage } from 'canvas';
import { put } from '@vercel/blob';
import GIFEncoder from 'gifencoder';
import { promisify } from 'util';
import formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const writeFileAsync = promisify(fs.writeFile);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = formidable({ multiples: false }); // Create an instance of formidable

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the form data' });
      return;
    }

    const stickers = JSON.parse(fields.stickers);
    console.log(stickers);

    const frameFiles = Object.keys(files)
      .filter((key) => key.startsWith('frame-'))
      .sort((a, b) => {
        const indexA = parseInt(a.split('-')[1], 10);
        const indexB = parseInt(b.split('-')[1], 10);
        return indexA - indexB;
      })
      .map((key) => files[key][0]);

    if (frameFiles.length === 0) {
      res.status(400).json({ error: 'No frames provided' });
      return;
    }

    // Assuming the first frame gives us the dimensions
    const firstFrameImage = await loadImage(frameFiles[0].filepath);
    const width = firstFrameImage.width;
    const height = firstFrameImage.height;

    // Get frame delay
    const delay = fields.delay[0];

    // Create a GIF encoder
    const encoder = new GIFEncoder(width, height);
    encoder.start();
    encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
    encoder.setDelay(delay); // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Process each frame
    for (let i = 0; i < frameFiles.length; i++) {
      const frameFile = frameFiles[i];
      const frameImage = await loadImage(frameFile.filepath);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(frameImage, 0, 0, width, height);

      // Draw each sticker on the frame
      for (let sticker of stickers[i] || []) {
        console.log(sticker.src);
        const stickerImage = await loadImage(sticker.src);
        ctx.save();

        // Apply the transformation matrix
        const [a, b, c, d, e, f] = sticker.transformMatrix;
        ctx.setTransform(a, b, c, d, e, f);

        // Draw the sticker
        ctx.drawImage(
          stickerImage,
          0,
          0, // No offset needed since the matrix includes translation
          sticker.width, // The original width of the image
          sticker.height // The original height of the image
        );

        ctx.restore();

        // Calculate the unrotated position for the sticker
        // const { unrotatedLeft, unrotatedTop } = calculateUnrotatedPosition(
        //   sticker.left,
        //   sticker.top,
        //   sticker.width,
        //   sticker.height,
        //   sticker.angle,
        //   sticker.scaleX,
        //   sticker.scaleY
        // );

        // console.log('originalLeft', unrotatedLeft);
        // console.log('originalTop', unrotatedTop);

        // ctx.save();

        // // Translate to the new calculated top-left position
        // ctx.translate(unrotatedLeft, unrotatedTop);

        // // Apply scaling
        // ctx.scale(sticker.scaleX, sticker.scaleY);

        // // Translate to the center for rotation
        // ctx.translate(sticker.width / 2, sticker.height / 2);

        // // Rotate the sticker
        // ctx.rotate((sticker.angle * Math.PI) / 180);

        // // Draw the sticker centered at the translated origin
        // ctx.drawImage(
        //   stickerImage,
        //   -sticker.width / 2, // Centering the image at the translated origin
        //   -sticker.height / 2, // Centering the image at the translated origin
        //   sticker.width, // The original width of the image
        //   sticker.height // The original height of the image
        // );

        // ctx.restore();
      }
      // Add the canvas image to the GIF encoder
      encoder.addFrame(ctx);
    }

    encoder.finish();

    // Store or return the generated GIF
    const buffer = encoder.out.getData();

    // Store in temp blob storage
    // Upload the file to blob storage
    const gifBlob = await put(`tmp-gifs/${uuidv4()}.gif`, buffer, {
      access: 'public',
    });

    console.log(gifBlob);
    const gifBlobUrl = gifBlob.url;

    // const gifPath = `/tmp/generated-${Date.now()}.gif`; // Temporary storage
    // await writeFileAsync(gifPath, buffer);

    res.status(200).json(gifBlobUrl);
  });
}

// Function to calculate unrotated position
function calculateUnrotatedPosition(
  left,
  top,
  width,
  height,
  angle,
  scaleX,
  scaleY
) {
  // Convert the angle to radians
  const radians = (angle * Math.PI) / 180;

  // Calculate the scaled dimensions
  const scaledWidth = width * scaleX;
  const scaledHeight = height * scaleY;

  // Calculate the center point of the rotated and scaled object
  const centerX = left + scaledWidth / 2;
  const centerY = top + scaledHeight / 2;

  // Compute the original top-left corner of the object before rotation
  const offsetX = scaledWidth / 2;
  const offsetY = scaledHeight / 2;

  // Reverse the rotation transformation
  const unrotatedLeft =
    centerX - offsetX * Math.cos(radians) + offsetY * Math.sin(radians);
  const unrotatedTop =
    centerY - offsetX * Math.sin(radians) - offsetY * Math.cos(radians);

  return { unrotatedLeft, unrotatedTop };
}
// Utility function to load an image from a file path
// const loadImage = (filepath) => {
//   return new Promise((resolve, reject) => {
//     const image = new window.Image();
//     image.onload = () => resolve(image);
//     image.onerror = (err) => reject(err);
//     image.src = filepath;
//   });
// };
