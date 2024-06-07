//import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { copy } from '@vercel/blob';
import { sql } from '@vercel/postgres';

// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };

export const config = {
  runtime: 'edge',
};

export default async function upload(req) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = await req.formData();
  const blob_url = form.get('blob_url');
  let name = form.get('name');
  let createdBy = form.get('createdBy');
  let category = form.get('category');

  try {
    const newBlobPath = `default-stickers/${uuidv4()}.png`;
    const copyResult = await copy(blob_url, newBlobPath, { access: 'public' });
    const newBlobUrl = copyResult.url;

    // Massage data for insert
    if (name == 'undefined') {
      name = '';
    }

    if (createdBy == 'undefined') {
      createdBy = '';
    }

    if (category == 'undefined') {
      category = 'Misc';
    }

    const { rows } = await sql`
    INSERT INTO stickers (name, created_by, blob_url, category, type)
    VALUES (${name}, ${createdBy}, ${newBlobUrl}, ${category}, 'community')
    RETURNING *;
  `;

    return Response.json(rows);
  } catch (error) {
    console.error('Error saving meme', error);
    return Response.json(error);
    //return res.status(500).json({ message: 'Internal server error' });
  }
}
