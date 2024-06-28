import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { includeCommunity } = req.query;

  if (includeCommunity === 'true') {
    let { rows } =
      await sql`SELECT * FROM stickers WHERE visible = true and created_by != 'bbd';`;
    res.status(200).json(rows);
  } else {
    let { rows } =
      await sql`SELECT * FROM stickers WHERE visible = true and type='default' and created_by != 'bbd';`;
    res.status(200).json(rows);
  }
}
