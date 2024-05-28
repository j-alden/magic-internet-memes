import { VercelRequest, VercelResponse } from '@vercel/node';

// //Should run on edge runtime
// export const edge = true;

// // Always add those header to this endpoint
// export const headers = {
//   'Some-Header': 'some value',
// };

// // Stream the response
// export const streaming = true;

// // Enable Incremental Static Regeneration for this endpoint
// export const isr = {
//   expiration: 30,
// };

// export default async function handler() {
//   return new Response('Edge Function: OK', {
//     status: 200,
//   });
// }

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  return response.send('OK');
}
