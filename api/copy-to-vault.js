import { copy } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

// export const config = {
//   runtime: 'edge',
// };

export default async function toVault(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  //const form = new formidable.IncomingForm();
  const form = await req.formData();
  const blob_url = form.get('blob_url');
  let title = form.get('title');
  let createdBy = form.get('createdBy');

  try {
    // Copy the existing blob to a new location
    const newBlobPath = `the-louvre/${uuidv4()}.jpg`;
    const copyResult = await copy(blob_url, newBlobPath, { access: 'public' });
    const newBlobUrl = copyResult.url;

    if (title == 'undefined') {
      title = '';
    }

    if (createdBy == 'undefined') {
      createdBy = '';
    }

    // Insert a new record into the memes table

    const { rows } = await sql`
    INSERT INTO memes (title, created_by, blob_url)
    VALUES (${title}, ${createdBy}, ${newBlobUrl})
    RETURNING *;
  `;
    // return res.status(200).json({ meme: rows });
    return Response.json(rows);
  } catch (error) {
    console.error('Error saving meme', error);
    return Response.json(error);
    //return res.status(500).json({ message: 'Internal server error' });
  }

  //   form.parse(req, async (err, fields, files) => {
  //     if (err) {
  //       console.error('Error parsing form data', err);
  //       return res.status(500).json({ message: 'Internal server error' });
  //     }

  //     const { blob_url, title = '', createdBy = '' } = fields;

  //   });
}
