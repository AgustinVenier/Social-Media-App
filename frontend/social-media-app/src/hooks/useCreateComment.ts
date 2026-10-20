import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Comment } from "@/models";

function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["comments", postId],
    mutationFn: (comment: Comment) => {
      return axios
        .post<{
          message: string;
          commentId: string;
        }>(`/api/comments/create`, comment)
        .then((res) => res.data);
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const oldComment = queryClient.getQueryData<Comment[]>([
        "comments",
        postId,
      ]);

      queryClient.setQueryData(["comments", postId], (old: Comment[] = []) => [
        newComment,
        ...old,
      ]);

      return oldComment;
    },
    onSuccess: (savedComment, newComment) => {
      queryClient.setQueryData<Comment[]>(
        ["comments", postId],
        (old: Comment[] = []) => {
          return old.map((comment) =>
            comment === newComment
              ? { ...comment, id: savedComment.commentId }
              : comment,
          );
        },
      );
    },
    onError: (_error, _newComment, context) => {
      queryClient.setQueryData(["comments", postId], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export default useCreateComment;
