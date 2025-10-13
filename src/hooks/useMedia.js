import { useQuery } from '@tanstack/react-query';
import { mediaService } from '../services/media.service';
import { QUERY_KEYS } from '../utils/constants';

export const useMedia = (mediaId) => {
  const listQuery = useQuery({
    queryKey: QUERY_KEYS.MEDIA.LIST,
    queryFn: mediaService.listMedia,
  });

  const detailQuery = useQuery({
    queryKey: mediaId ? QUERY_KEYS.MEDIA.DETAIL(mediaId) : [],
    queryFn: () => mediaService.getMedia(mediaId),
    enabled: Boolean(mediaId),
  });

  return {
    listQuery,
    detailQuery,
  };
};
