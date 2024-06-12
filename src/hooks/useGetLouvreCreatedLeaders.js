import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useGetLouvreCreatedLeaders = () =>
  useQuery({
    queryKey: ['louvre_created_leaders'],
    staleTime: Infinity,
    queryFn: async () => {
      const res = await axios.get(`${apiBaseUrl}/api/get-louvre-leaders`);
      return res.data;
    },
  });
