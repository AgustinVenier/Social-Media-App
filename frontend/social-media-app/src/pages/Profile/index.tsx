import { useSelector } from "react-redux";
import type { AppStore } from "@/redux/store";
import PostList from "@/components/PostList";

function Profile() {
  const userId = useSelector((state: AppStore) => state.user.id);

  return (
    <PostList
      url={`http://localhost:3000/api/posts/user/${userId}`}
      queryKey={["posts", "user", userId]}
    />
  );
}

export default Profile;
