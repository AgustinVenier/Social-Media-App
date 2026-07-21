export interface User {
  id: string;
  username: string;
  urlPhoto: string | null;
}

export interface Post {
  idUser: number;
  description: string;
  photoUrl: string;
}
