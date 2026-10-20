import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";

type Props = {
  url: string;
  queryKey: unknown[];
};

function PostList({ url, queryKey }: Props) {
  const pageSize = 10; // Número de posts por página
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(url, {
        params: { page: pageParam, limit: pageSize },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flat() || [];

  return (
    <Box maxW="600px" mx="auto" py={8} px={4}>
      <Stack gap={8}>
        {posts?.map((post) => (
          <Box
            key={post.id}
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            p={4}
          >
            <Stack direction="row" align="center" gap={2} mb={4}>
              {post.urlPhoto === "null" ? (
                <Avatar.Root size="md">
                  <Avatar.Image
                    src={post.urlPhoto}
                    alt="Profile"
                    boxSize="40px"
                    borderRadius="full"
                  />
                </Avatar.Root>
              ) : (
                <Avatar.Root size="md">
                  <Avatar.Fallback name={post.username}></Avatar.Fallback>
                </Avatar.Root>
              )}
              <Heading size="md">
                <a href="/profile">{post.username}</a>
              </Heading>
            </Stack>
            <Center>
              <Image
                src={post.photoUrl}
                alt="Post"
                boxSize="400px"
                objectFit="cover"
                borderRadius="md"
                width="100%"
              />
            </Center>
            <Stack mt={4} gap={2}>
              {post.description}
              <Stack direction="row" gap={4} align="center">
                <LikeButton postId={post.id} />
                <CommentButton postId={post.id} />
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
      {hasNextPage && (
        <Center mt={6}>
          <Button onClick={() => fetchNextPage()}>Load More</Button>
        </Center>
      )}
    </Box>
  );
}

export default PostList;
