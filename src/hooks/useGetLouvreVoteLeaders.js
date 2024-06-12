import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useGetLouvreVoteLeaders = () =>
  useQuery({
    queryKey: ['louvre_vote_leaders'],
    staleTime: Infinity,
    queryFn: async () => {
      const res = await axios.get(
        `${apiBaseUrl}/api/leaderboard-get-louvre-votes`
      );
      return res.data;
    },
  });
