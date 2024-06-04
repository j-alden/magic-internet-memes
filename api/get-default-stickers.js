import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { rows } = await sql`SELECT * FROM stickers WHERE type = 'default';`;
  //const { name = 'World' } = request.query;

  //return response.status(200).json({ message: 'Hello, World!' });
  return response.send(rows);
}
