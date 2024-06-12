import { v4 as uuidv4 } from 'uuid';
import { copy } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import formidable from 'formidable';

export default async function upload(req, res) {
  const form = formidable({ multiples: false }); // Create an instance of formidable

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Failed to parse form data', details: err.message });
      return;
    }

    // Parse out values from form
    let { blob_url, name, createdBy, category } = fields;
    blob_url = blob_url[0];
    name = name[0];
    createdBy = createdBy[0];
    category = category[0];

    try {
      const newBlobPath = `default-stickers/${uuidv4()}.png`;
      const copyResult = await copy(blob_url, newBlobPath, {
        access: 'public',
      });

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

      res.status(200).json(rows);
    } catch (uploadError) {
      res.status(500).json({
        error: 'Failed to upload file to blob storage',
        details: uploadError.message,
      });
    }
  });
}
