import { useQuery } from '@tanstack/react-query';
import { topicsService } from '../services/topics.service';
import { QUERY_KEYS } from '../utils/constants';

export const useTopics = () => {
  const listQuery = useQuery({
    queryKey: QUERY_KEYS.TOPICS.LIST,
    queryFn: topicsService.listTopics,
  });

  return {
    listQuery,
  };
};
