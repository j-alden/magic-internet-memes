//import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };

export const config = {
  runtime: 'edge',
};

export default async function upload(request) {
  const form = await request.formData();
  const file = form.get('file');
  const filePath = `temp-stickers/${uuidv4()}.png`;
  const blob = await put(filePath, file, { access: 'public' });
  console.log(blob);

  return Response.json(blob);
}
