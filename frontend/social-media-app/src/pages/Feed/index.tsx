import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Post } from "@/models";
type Props = {};

function Feed({}: Props) {
  const pageSize = 10; // Número de posts por página
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `https://api.example.com/posts?page=${pageParam}`;
      const res = await axios.get(url, {
        params: { _start: (pageParam - 1) * pageSize, _limit: pageSize },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flat() || [];

  return (
    <div>
      <h1>Feed</h1>
      <div>
        {posts.map((post: Post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
}

export default Feed;
