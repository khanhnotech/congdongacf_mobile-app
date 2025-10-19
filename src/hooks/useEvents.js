import { useMemo } from 'react';
import {
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { eventsService } from '../services/events.service';
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from '../utils/constants';
import { resolvePagination } from './usePosts';

const buildListKey = (filters = {}, pageSize) => {
  const entries = Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  return [
    ...QUERY_KEYS.EVENTS.LIST,
    pageSize,
    ...entries.flatMap(([key, value]) => [key, value]),
  ];
};

export const useEvents = (
  eventId,
  { pageSize = DEFAULT_PAGE_SIZE, filters = {} } = {},
) => {
  const listKey = useMemo(
    () => buildListKey(filters, pageSize),
    [filters, pageSize],
  );

  const listQuery = useInfiniteQuery({
    queryKey: listKey,
    queryFn: ({ pageParam = 1 }) =>
      eventsService.listEvents({
        page: pageParam,
        limit: pageSize,
        ...filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const { hasNextPage, nextPage, currentPage } = resolvePagination(
        lastPage?.meta,
        pageSize,
      );
      if (nextPage) return nextPage;
      if (hasNextPage === false) return undefined;
      if (hasNextPage === true) {
        return (currentPage ?? allPages.length) + 1;
      }
      if ((lastPage?.items ?? []).length < pageSize) {
        return undefined;
      }
      return (currentPage ?? allPages.length) + 1;
    },
    select: (data) => {
      const pages = data?.pages ?? [];
      const items = pages.flatMap((page) => page?.items ?? []);
      const lastMeta = pages.length ? pages[pages.length - 1]?.meta : undefined;
      return {
        ...data,
        items,
        meta: lastMeta,
      };
    },
  });

  const detailQuery = useQuery({
    queryKey: eventId ? QUERY_KEYS.EVENTS.DETAIL(eventId) : [],
    queryFn: () => eventsService.getEvent(eventId),
    enabled: Boolean(eventId),
  });

  return {
    listQuery,
    detailQuery,
  };
};
