export interface Game {
  id?: string;
  name: string;
  year: number;
  studio: string;
  image: string;
  genre: string;
  description: string;
  videoLink: string;
  userId: string
  likesCount: number;
  likedByUsers: string[];
  createdBy: string;
}