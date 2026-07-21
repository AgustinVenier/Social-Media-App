import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Post } from "@/models";

type Props = {}

function CreatePost({}: Props) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            await axios.post<Post>("http://localhost:3000/api/posts/create", {
                idUser: 
                description: "Contenido del nuevo post",
                photoUrl: "URL de la foto",
            }).then(res => res.data);
        }
            )
  return (

  )
}

export default CreatePost;