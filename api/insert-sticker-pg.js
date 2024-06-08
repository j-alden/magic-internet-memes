import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function upload(request) {
  console.log(request);
  if (request.method !== 'POST') {
    return request.status(405).json({ message: 'Method not allowed' });
  }

  const form = await request.formData();
  const blob_url = form.get('blob_url');
  let name = form.get('name');
  let createdBy = form.get('createdBy');
  let category = form.get('category');

  try {
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
    VALUES (${name}, ${createdBy}, ${blob_url}, ${category}, 'community')
    RETURNING *;
  `;

    return Response.json(rows);
  } catch (error) {
    console.error('Error saving meme', error);
    return Response.json(error);
  }
}
