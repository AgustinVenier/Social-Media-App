import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { Comment } from "@/models";
import axios from "axios";

function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["comments", postId],
    mutationFn: (comment: Comment) => {
      return axios
        .delete<{
          message: string;
        }>(`http://localhost:3000/api/comments/${comment.id}`)
        .then((res) => res.data);
    },
    onMutate: async (deletedComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const oldComments = queryClient.getQueryData<Comment[]>([
        "comments",
        postId,
      ]);

      queryClient.setQueryData<Comment[]>(
        ["comments", postId],
        (old: Comment[] = []) => {
          return old.filter((comment) => comment.id !== deletedComment.id);
        },
      );

      return oldComments;
    },
    onError: (error, deletedComment, context) => {
      queryClient.setQueryData(["comments", postId], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export default useDeleteComment;
