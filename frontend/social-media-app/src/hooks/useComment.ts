import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Comment } from "@/models";

function useComment(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async (): Promise<Comment[]> => {
      const res = await axios.get(
        `http://localhost:3000/api/comments/post/${postId}`,
      );
      return res.data;
    },
  });
}
export default useComment;
