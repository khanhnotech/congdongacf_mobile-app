import { useQuery } from '@tanstack/react-query';
import { legalService } from '../services/legal.service';
import { QUERY_KEYS } from '../utils/constants';

export const useLegal = (documentId) => {
  const listQuery = useQuery({
    queryKey: QUERY_KEYS.LEGAL.LIST,
    queryFn: legalService.listDocuments,
  });

  const detailQuery = useQuery({
    queryKey: documentId ? QUERY_KEYS.LEGAL.DETAIL(documentId) : [],
    queryFn: () => legalService.getDocument(documentId),
    enabled: Boolean(documentId),
  });

  return {
    listQuery,
    detailQuery,
  };
};
