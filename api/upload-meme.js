// import { put } from '@vercel/blob';

// export const config = {
//   runtime: 'edge',
// };

// export default async function upload(request) {
//   const form = await request.formData();
//   const file = form.get('file');
//   //const filePath = `temp-memes/${file.name}.jpg`;
//   const filePath = `temp-memes/${file.name}`;
//   const blob = await put(filePath, file, { access: 'public' });

//   return Response.json(blob);
// }
import { put } from '@vercel/blob';
import formidable from 'formidable';
import fs from 'fs';

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
      // Access the uploaded file
      const file = files.file[0];

      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Determine the filename and ensure it is not null or undefined
      const filename =
        file.originalFilename || file.newFilename || 'uploaded-file';

      const fileData = await fs.promises.readFile(file.filepath);

      // Upload the file to blob storage
      const blob = await put(`temp-memes/${filename}`, fileData, {
        access: 'public',
      });
      // Return the blob response
      res.status(200).json(blob);
    } catch (uploadError) {
      res.status(500).json({
        error: 'Failed to upload file to blob storage',
        details: uploadError.message,
      });
    }
  });
}
