import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { rows } =
    await sql`SELECT * FROM memes WHERE visible = true and created_by != 'bbd' order by created_date desc;`;
  console.log(rows);
  return response.send(rows);
}
