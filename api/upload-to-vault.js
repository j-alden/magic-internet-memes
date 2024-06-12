import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, // Disables Vercel's default body parser to handle the raw form data
  },
};

export default async function upload(req, res) {
  const form = formidable({ multiples: false }); // Create an instance of formidable

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Failed to parse form data', details: err.message });
      return;
    }

    try {
      // Parse meme metadata from form
      let { blob_url, title, createdBy } = fields;
      blob_url = blob_url[0];
      title = title[0];
      createdBy = createdBy[0];

      // Access the uploaded file
      const file = files.file[0];

      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const fileData = await fs.promises.readFile(file.filepath);

      // Upload the file to blob storage
      const blob = await put(`the-louvre/${uuidv4()}.jpg`, fileData, {
        access: 'public',
      });

      // Massage data for insert
      if (title == 'undefined') {
        title = '';
      }

      if (createdBy == 'undefined') {
        createdBy = '';
      }

      // Insert into postgres
      const { rows } = await sql`
      INSERT INTO memes (title, created_by, blob_url)
      VALUES (${title}, ${createdBy}, ${blob.url})
      RETURNING *;`;

      // Return the blob response
      res.status(200).json(rows);
    } catch (uploadError) {
      res.status(500).json({
        error: 'Failed to upload file to blob storage',
        details: uploadError.message,
      });
    }
  });
}
