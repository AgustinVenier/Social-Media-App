import { FaHeart } from "react-icons/fa";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  postId: number;
};

const getLikesCount = async (postId: number): Promise<number> => {
  const res = await axios.get(
    `http://localhost:3000/api/likes/count/${postId}`,
  );
  return res.data.count;
};

const getLikedStatus = async (postId: number): Promise<boolean> => {
  const res = await axios.get(
    `http://localhost:3000/api/likes/checklike/${postId}`,
  );
  return res.data.liked;
};

function LikeButton({ postId }: Props) {
  const queryClient = useQueryClient();

  const { data: likes = 0 } = useQuery({
    queryKey: ["likes", postId],
    queryFn: () => getLikesCount(postId),
  });

  const { data: liked = false } = useQuery({
    queryKey: ["liked", postId],
    queryFn: () => getLikedStatus(postId),
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => {
      const endpoint = liked ? "unlike" : "like";
      return axios.post(`http://localhost:3000/api/likes/${endpoint}`, {
        idPost: postId,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likes", postId] });
      await queryClient.cancelQueries({ queryKey: ["liked", postId] });

      const previousLikes = queryClient.getQueryData<number>(["likes", postId]);
      const previousLiked = queryClient.getQueryData<boolean>([
        "liked",
        postId,
      ]);

      queryClient.setQueryData(["likes", postId], (old: number = 0) =>
        liked ? old - 1 : old + 1,
      );
      queryClient.setQueryData(["liked", postId], !liked);

      return { previousLikes, previousLiked };
    },
    onError: (error, _vars, context) => {
      console.error("Error toggling like:", error);
      queryClient.setQueryData(["likes", postId], context?.previousLikes);
      queryClient.setQueryData(["liked", postId], context?.previousLiked);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
      queryClient.invalidateQueries({ queryKey: ["liked", postId] });
    },
  });

  return (
    <HStack gap={1} align="center">
      <IconButton
        aria-label="like"
        variant="ghost"
        colorPalette="red"
        cursor="pointer"
        onClick={() => toggleLike()}
      >
        <FaHeart size={20} color={liked ? "red" : undefined} />
      </IconButton>
      <Text fontSize="sm">{likes}</Text>
    </HStack>
  );
}

export default LikeButton;
