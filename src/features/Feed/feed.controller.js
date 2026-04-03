//luego preguntar a la ia donde me conviene teener estos import por el tema del acoplamiento
import { getAllFollowersByUserId } from "../Follower/follower.service.js";
import { getAllPostById } from "../Post/post.service.js";

export async function getFeed(req, res) {
    const {id} = req.body
    try {
    const followersId[] = getAllFollowersByUserId(id)
    followersId.forEach(ids => {
        res.json(getAllPostById(ids));// en realidad aca obtengo el id de cada post, luego esto lo tengog que buscar en la tabla de posts y recien ahi obtengo la informacion de todo el post
        //creo que me conviene hacer todo esto en post, no se si es necesario tener un componente feed
        //fijarse de implementar estas consulta con un inner join 
    });
    } catch (error) {
        res.status(500).send({message: "Error al obtener el feed"})
    }
}

