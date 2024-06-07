//import { createWriteStream } from 'fs';
//import { v4 as uuidv4 } from 'uuid';
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
  //const uuid = crypto.randomUUID();
  const form = await request.formData();
  const file = form.get('file');
  const filePath = `temp-memes/${'asdfasdf'}.jpg`;
  const blob = await put(filePath, file, { access: 'public' });

  return Response.json(blob);
}

//   export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };

//   const blobServiceClient = new BlobServiceClient(
//     process.env.BLOB_READ_WRITE_TOKEN
//   );

//   export default async (req, res) => {
//     if (req.method !== 'POST') {
//       return res.status(405).json({ message: 'Method not allowed' });
//     }

//     const filePath = `/tmp/${uuidv4()}.png`;
//     const writeStream = createWriteStream(filePath);

//     req.pipe(writeStream);

//     req.on('end', async () => {
//       try {
//         const containerClient = blobServiceClient.getContainerClient(
//           'your-container-name'
//         );
//         const blockBlobClient = containerClient.getBlockBlobClient(uuidv4());

//         await blockBlobClient.uploadFile(filePath, {
//           blobHTTPHeaders: {
//             blobContentType: 'image/png',
//           },
//         });

//         const blobUrl = blockBlobClient.url;
//         res.status(200).json({ url: blobUrl });
//       } catch (error) {
//         console.error('Error uploading to blob storage', error);
//         res.status(500).json({ message: 'Internal server error' });
//       }
//     });
//   };
