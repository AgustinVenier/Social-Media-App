export interface User {
  id: string;
  username: string;
  urlPhoto: string | null;
}

export interface Comment {
  id: string | number;
  username: string;
  idPost: number;
  idUser: string;
  description: string;
  urlPhoto: string;
  date: string;
}
export interface Post {
  description: string;
  photoUrl: string;
}
