import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsService } from '../services/posts.service';
import { QUERY_KEYS } from '../utils/constants';

export const usePosts = (postId) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: QUERY_KEYS.POSTS.LIST,
    queryFn: postsService.listPosts,
  });

  const detailQuery = useQuery({
    queryKey: postId ? QUERY_KEYS.POSTS.DETAIL(postId) : [],
    queryFn: () => postsService.getPost(postId),
    enabled: Boolean(postId),
  });

  const createMutation = useMutation({
    mutationKey: ['posts', 'create'],
    mutationFn: postsService.createPost,
    onSuccess: (createdPost) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS.LIST });
      queryClient.setQueryData(
        QUERY_KEYS.POSTS.DETAIL(createdPost.id),
        createdPost,
      );
    },
  });

  return {
    listQuery,
    detailQuery,
    createPost: createMutation.mutateAsync,
    createStatus: createMutation.status,
  };
};
