import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useGetStickers = (includeCommunity) =>
  useQuery({
    queryKey: ['stickers', includeCommunity],
    staleTime: Infinity,
    queryFn: async () => {
      const res = await axios.get(`${apiBaseUrl}/api/get-stickers`, {
        params: {
          includeCommunity: includeCommunity,
        },
      });
      return res.data;
    },
  });
