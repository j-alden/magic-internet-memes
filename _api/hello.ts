// import type { VercelRequest, VercelResponse } from '@vercel/node';

// export default async function handler(
//   request: VercelRequest,
//   response: VercelResponse
// ) {
//   return response.send('OK');
// }

export default function handler(req, res) {
  res.status(200).json({ message: 'Hello, World!' });
}
