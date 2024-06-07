import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { rows } =
    await sql`select created_by, count(*) as memes_created from memes
    where visible = true
    and created_by != 'bbd'
    group by created_by 
    order by 2 desc
    ;`;
  console.log(rows);
  return response.send(rows);
}
