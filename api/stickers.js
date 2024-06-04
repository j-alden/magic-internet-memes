import { list } from '@vercel/blob';

// export const config = {
//   runtime: 'edge',
// };

// export default async function blobs(request) {
//   const { blobs } = await list();

//   const blob_urls = blobs.map((blob) => blob.url);
//   return Response.json(blob_urls);
// }

export default async function handler(request, response) {
  //const { name = 'World' } = request.query;
  const { blobs } = await list();

  return response.send(blobs);
}
