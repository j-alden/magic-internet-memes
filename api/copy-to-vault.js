import { copy } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import { URL } from 'url';
import path from 'path';

// export const config = {
//   runtime: 'edge',
// };

export default async function toVault(req, res) {
  const form = formidable({ multiples: false }); // Create an instance of formidable

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Failed to parse form data', details: err.message });
      return;
    }

    // Parse out values from form
    let { blob_url, title, createdBy } = fields;
    blob_url = blob_url[0];
    title = title[0];
    createdBy = createdBy[0];

    console.log(fields);

    try {
      // Get file extension
      const pathname = new URL(blob_url).pathname;
      const filename = path.basename(pathname);
      const fileExtension = path.extname(filename);

      const newBlobPath = `the-louvre/${uuidv4()}${fileExtension}`;
      const copyResult = await copy(blob_url, newBlobPath, {
        access: 'public',
      });

      const newBlobUrl = copyResult.url;
      console.log(newBlobUrl);

      // Massage data for insert
      if (title == 'undefined') {
        title = '';
      }

      if (createdBy == 'undefined') {
        createdBy = '';
      }

      const { rows } = await sql`
      INSERT INTO memes (title, created_by, blob_url)
      VALUES (${title}, ${createdBy}, ${newBlobUrl})
      RETURNING *;`;

      console.log(rows);

      res.status(200).json(rows);
    } catch (uploadError) {
      res.status(500).json({
        error: 'Failed to upload file to blob storage',
        details: uploadError.message,
      });
    }
  });
}
