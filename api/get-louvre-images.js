import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { sortBy } = req.query;
  // console.log(sortBy);
  // const { rows } =
  //   await sql`SELECT * FROM memes WHERE visible = true and created_by != 'bbd' order by ${sortBy} desc;`;
  // console.log(rows);
  // return res.send(rows);
  if (sortBy === 'New') {
    let { rows } =
      await sql`SELECT * FROM memes WHERE visible = true and created_by != 'bbd' order by created_date desc;`;
    res.status(200).json(rows);
  } else if (sortBy === 'Hot') {
    console.log('getting default stickers...');
    let { rows } =
      await sql`SELECT * FROM memes WHERE visible = true and created_by != 'bbd' order by votes desc;`;
    res.status(200).json(rows);
  } else {
    res.status(500).json({ error: 'No sort order provided' });
  }
}
