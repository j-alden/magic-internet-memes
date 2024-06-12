import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useGetStickerLeaders = () =>
  useQuery({
    queryKey: ['sticker_leaders'],
    staleTime: Infinity,
    queryFn: async () => {
      const res = await axios.get(`${apiBaseUrl}/api/get-sticker-leaders`);
      return res.data;
    },
  });
