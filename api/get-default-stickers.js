import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { rows } = await sql`SELECT * FROM stickers WHERE type = 'default';`;
  return response.send(rows);
}
