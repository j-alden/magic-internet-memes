import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { rows } =
    await sql`select created_by, count(*) as memes_created from memes
    where visible = true
    and created_by not in ('', 'bbd')
    group by created_by 
    order by 2 desc
    ;`;

  return response.send(rows);
}
