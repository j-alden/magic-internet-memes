import React, { useState, useEffect } from 'react';
import { ActionIcon, Text, Button } from '@mantine/core';
import { IconFlame } from '@tabler/icons-react';
import axios from 'axios';

const LikeButton = ({ meme, setImages, setFilteredImages }) => {
  //console.log(meme);

  const [userReacted, setUserReacted] = useState(false);

  const handleUpvote = (id) => {
    axios
      .post(`/api/upvote-meme?id=${id}`)
      .then((response) => {
        // Update the local state to reflect the upvote
        const updatedVotes = response.data.votes;
        console.log(updatedVotes);
        setImages((prevImages) =>
          prevImages.map((meme) => {
            meme?.meme_id === id ? { ...meme, votes: updatedVotes } : meme;
          })
        );
        // setFilteredImages((prevFilteredImages) =>
        //   prevFilteredImages.map((meme) =>
        //     meme?.meme_id === id ? { ...meme, votes: updatedVotes } : meme
        //   )
        // );
        setUserReacted(true);
      })
      .catch((error) => console.error('Error upvoting image:', error));
  };

  return (
    <Button
      onClick={() => handleUpvote(meme.meme_id)}
      disabled={userReacted}
      leftSection={<IconFlame size={20} />}
      variant='outline'
      color='red'
      size='compact-sm'
      radius='xl'
    >
      {meme.votes || 0}
    </Button>
  );
};
export default LikeButton;
