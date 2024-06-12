import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useGetMemes = () =>
  useQuery({
    queryKey: ['memes'],
    staleTime: Infinity,
    queryFn: async () => {
      const res = await axios.get(`${apiBaseUrl}/api/get-louvre-images`);
      return res.data;
    },
  });
