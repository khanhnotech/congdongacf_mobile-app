import { useQuery } from '@tanstack/react-query';
import { activitiesService } from '../services/activities.service';
import { QUERY_KEYS } from '../utils/constants';

export const useActivities = (activityId) => {
  const listQuery = useQuery({
    queryKey: QUERY_KEYS.ACTIVITIES.LIST,
    queryFn: activitiesService.listActivities,
  });

  const detailQuery = useQuery({
    queryKey: activityId ? QUERY_KEYS.ACTIVITIES.DETAIL(activityId) : [],
    queryFn: () => activitiesService.getActivity(activityId),
    enabled: Boolean(activityId),
  });

  return {
    listQuery,
    detailQuery,
  };
};
