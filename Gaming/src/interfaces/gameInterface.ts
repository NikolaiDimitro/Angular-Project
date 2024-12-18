import { UserComment } from './comment';

export interface Game {
  id?: string; // ID на играта
  name: string;
  year: number;
  studio: string;
  image: string;
  genre: string;
  description: string;
  videoLink: string;
  userId: string
  likesCount: number; // Променено на задължително число (не може да бъде undefined)
  likedByUsers: string[]; // Променено на празен масив по подразбиране
  commentsCount: number; // Променено на задължително число
  comments: UserComment[]; // Променено на масив от коментари
  createdBy: string; // ID на създателя
}