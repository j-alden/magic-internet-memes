import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { includeCommunity } = req.query;
  console.log(includeCommunity);
  console.log(typeof includeCommunity);
  if (includeCommunity === 'true') {
    console.log('getting all stickers...');
    let { rows } =
      await sql`SELECT * FROM stickers WHERE visible = true and created_by != 'bbd';`;
    res.status(200).json(rows);
  } else {
    console.log('getting default stickers...');
    let { rows } =
      await sql`SELECT * FROM stickers WHERE visible = true and type='default' and created_by != 'bbd';`;
    res.status(200).json(rows);
  }
}
