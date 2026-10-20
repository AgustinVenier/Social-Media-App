import PostList from "@/components/PostList";

type Props = {};

function Feed({}: Props) {
  return (
    <PostList
      url="http://localhost:3000/api/posts/feed"
      queryKey={["posts", "feed"]}
    />
  );
}

export default Feed;
