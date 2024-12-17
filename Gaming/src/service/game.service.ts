import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, arrayUnion, increment, getFirestore, DocumentReference, orderBy, query, getDocs } from 'firebase/firestore';
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
    const gamesQuery = query(this.gamesCollectionRef, orderBy('name')); // Можеш да сортираш по каквото искаш (тук по 'name')
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
    console.log('Adding game:', game); // Дебъг
    return from(
      addDoc(this.gamesCollectionRef, {
        ...game,
        likesCount: 0,
        likedByUsers: [],
        commentsCount: 0,
        comments: [],
      })
    ).pipe(
      map((res) => {
        console.log('Game added successfully:', res);
        return res;
      }),
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
    );
  }

  addComment(gameId: string, comment: UserComment): Observable<void> {
    const gameDocRef = doc(this.firestore, 'games', gameId);
    return from(
      updateDoc(gameDocRef, {
        comments: arrayUnion(comment),
        commentsCount: increment(1),
      })
    );
  }
}
