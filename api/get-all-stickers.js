import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { rows } =
    await sql`SELECT * FROM stickers WHERE visible = true and created_by != 'bbd';`;
  return response.send(rows);
}
