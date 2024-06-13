import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useGetMemes = (sortBy) =>
  useQuery({
    queryKey: ['memes', sortBy],
    staleTime: Infinity,
    queryFn: async () => {
      const res = await axios.get(`${apiBaseUrl}/api/get-louvre-images`, {
        params: {
          sortBy: sortBy,
        },
      });
      return res.data;
    },
  });
