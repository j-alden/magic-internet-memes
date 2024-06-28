import { gifToSprites } from './gif.utils';

const [PLAY, PAUSE, STOP] = [0, 1, 2];

export async function fabricGif(
  gif: string | File,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ image: fabric.Image }> {
  const {
    framesPerSprite,
    sprites,
    frames,
    frameWidth,
    frameHeight,
    totalFrames,
  } = await gifToSprites(gif, maxWidth, maxHeight);

  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = frameWidth;
  frameCanvas.height = frameHeight;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const frameCtx = frameCanvas.getContext('2d')!;

  frameCtx.drawImage(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sprites[0]!,
    0,
    0,
    frameWidth,
    frameHeight
  );

  return new Promise((resolve) => {
    window.fabric.Image.fromURL(frameCanvas.toDataURL(), (image) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const firstFrame = frames[0]!;
      let framesIndex = 0;
      let start = performance.now();
      let status: number;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let accumulatedDelay = firstFrame.delay;

      image.width = frameWidth;
      image.height = frameHeight;
      image._render = function (ctx) {
        if (status === PAUSE || (status === STOP && framesIndex === 0)) return;
        const now = performance.now();
        const delta = now - start;
        if (delta > accumulatedDelay) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          accumulatedDelay += frames[framesIndex]!.delay;
          framesIndex++;
        }
        if (framesIndex === totalFrames || status === STOP) {
          framesIndex = 0;
          start = now;
          accumulatedDelay = firstFrame.delay;
        }

        const spriteIndex = Math.floor(framesIndex / framesPerSprite);
        ctx.drawImage(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          sprites[spriteIndex]!,
          frameWidth * (framesIndex % framesPerSprite),
          0,
          frameWidth,
          frameHeight,
          -frameWidth / 2,
          -frameHeight / 2,
          frameWidth,
          frameHeight
        );
      };

      const methods = {
        play: () => {
          status = PLAY;
          image.dirty = true;
        },
        pause: () => {
          status = PAUSE;
          image.dirty = false;
        },
        stop: () => {
          status = STOP;
          image.dirty = false;
        },
        getStatus: () => ['Playing', 'Paused', 'Stopped'][status],
      };

      methods.play();

      resolve({
        ...methods,
        image,
      });
    });
  });
}
