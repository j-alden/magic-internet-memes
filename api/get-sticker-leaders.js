import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { rows } =
    await sql`select created_by, count(*) as stickers_created from stickers
    where visible = true
    group by created_by 
    order by 2 desc
    ;`;
  console.log(rows);
  return response.send(rows);
}
