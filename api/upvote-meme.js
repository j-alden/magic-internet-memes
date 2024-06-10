// api/upvote-meme.js

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id } = req.query;

    try {
      // Ensure the id parameter is provided
      if (!id) {
        return res.status(400).json({ error: 'Meme ID is required' });
      }

      // Increment the votes for the specified meme
      const result = await sql`
        UPDATE memes
        SET votes = votes + 1
        WHERE meme_id = ${id}
        RETURNING votes
      `;

      console.log(result);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Meme not found' });
      }

      // Return the updated vote count
      const updatedVotes = result.rows[0].votes;

      console.log(updatedVotes);
      res.status(200).json({ success: true, votes: updatedVotes });
    } catch (error) {
      console.error('Error upvoting meme:', error);
      res.status(500).json({ error: 'Failed to upvote meme' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
