import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  getFirestore,
  DocumentReference,
  orderBy,
  query,
  getDocs,
  limit,
  deleteDoc,
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Game } from '../interfaces/gameInterface';
import { UserComment } from '../interfaces/comment';
import { firebaseAppGames } from '../environments/firebase-config';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private firestore: Firestore = getFirestore(firebaseAppGames); // Firestore от Firebase приложението за игри
  private gamesCollectionRef = collection(this.firestore, 'games');

  constructor() {}

  getAllGames(): Observable<Game[]> {
    const gamesQuery = query(this.gamesCollectionRef, orderBy('name'));
    return from(getDocs(gamesQuery)).pipe(
      map((querySnapshot) => {
        const games: Game[] = [];
        querySnapshot.forEach((docSnap) => {
          games.push({ id: docSnap.id, ...docSnap.data() } as Game);
        });
        return games;
      }),
      catchError((error) => {
        console.error('Error getting games:', error);
        throw error;
      })
    );
  }

  addGame(game: Game): Observable<DocumentReference> {
    return from(
      addDoc(this.gamesCollectionRef, {
        ...game,
        likesCount: 0,
        likedByUsers: [],
        commentsCount: 0,
        comments: [],
      })
    ).pipe(
      map((res) => res),
      catchError((error) => {
        console.error('Error adding game:', error);
        throw error;
      })
    );
  }

  getGameById(gameId: string): Observable<Game | null> {
    const gameDocRef = doc(this.firestore, 'games', gameId);
    return from(getDoc(gameDocRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Game;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error getting game by ID:', error);
        throw error;
      })
    );
  }

  likeGame(gameId: string, userId: string): Observable<void> {
    const gameDocRef = doc(this.firestore, 'games', gameId);
    return from(
      updateDoc(gameDocRef, {
        likedByUsers: arrayUnion(userId),
        likesCount: increment(1),
      })
    ).pipe(
      catchError((error) => {
        console.error('Error liking game:', error);
        throw error;
      })
    );
  }

  addCommentToGame(gameId: string, comment: UserComment): Observable<void> {
    const gameDocRef = doc(this.firestore, 'games', gameId);
    return from(
      updateDoc(gameDocRef, {
        comments: arrayUnion(comment),
        commentsCount: increment(1),
      })
    ).pipe(
      catchError((error) => {
        console.error('Error adding comment to game:', error);
        throw error;
      })
    );
  }

  getCommentsForGame(gameId: string): Observable<UserComment[]> {
    const gameDocRef = doc(this.firestore, 'games', gameId);
    return from(getDoc(gameDocRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const gameData = docSnap.data() as Game;
          return gameData.comments || [];
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error getting comments for game:', error);
        throw error;
      })
    );
  }

  deleteGame(gameId: string): Observable<void> {
    const gameDocRef = doc(this.firestore, 'games', gameId);
    return from(deleteDoc(gameDocRef)).pipe(
      catchError((error) => {
        console.error('Error deleting game:', error);
        throw error;
      })
    );
  }

  getTopLikedGames(limitNumber: number): Observable<Game[]> {
    const gamesQuery = query(
      this.gamesCollectionRef,
      orderBy('likesCount', 'desc'),
      limit(limitNumber)
    );
    return from(getDocs(gamesQuery)).pipe(
      map((querySnapshot) => {
        const games: Game[] = [];
        querySnapshot.forEach((docSnap) => {
          games.push({ id: docSnap.id, ...docSnap.data() } as Game);
        });
        return games;
      }),
      catchError((error) => {
        console.error('Error getting top liked games:', error);
        throw error;
      })
    );
  }

  getTopCommentedGames(limitNumber: number): Observable<Game[]> {
    const gamesQuery = query(
      this.gamesCollectionRef,
      orderBy('commentsCount', 'desc'),
      limit(limitNumber)
    );
    return from(getDocs(gamesQuery)).pipe(
      map((querySnapshot) => {
        const games: Game[] = [];
        querySnapshot.forEach((docSnap) => {
          games.push({ id: docSnap.id, ...docSnap.data() } as Game);
        });
        return games;
      }),
      catchError((error) => {
        console.error('Error getting top commented games:', error);
        throw error;
      })
    );
  }

  updateGame(gameId: string, updatedData: Partial<Game>): Observable<void> {
    const gameDocRef = doc(this.firestore, 'games', gameId);
    return from(updateDoc(gameDocRef, updatedData)).pipe(
      catchError((error) => {
        console.error('Error updating game:', error);
        throw error;
      })
    );
  }
  

}
