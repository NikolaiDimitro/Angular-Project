import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../interfaces/userInterface';
import { firebaseAppUsers } from '../environments/firebase-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(firebaseAppUsers);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserSubject.next({
          uid: user.uid,
          email: user.email ?? '',
          username: '',
        });
        this.isAuthenticatedSubject.next(true);
      } else {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  registerUser(user: User): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, user.email, user.password!)).pipe(
      map((userCredential) => {
        const registeredUser: User = {
          uid: userCredential.user.uid,
          username: user.username,
          email: user.email,
        };
        this.currentUserSubject.next(registeredUser);
        return registeredUser;
      }),
      catchError((error) => {
        console.error('Грешка при регистрация:', error);
        throw error;
      })
    );
  }

  loginUser(user: User): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, user.email, user.password!)).pipe(
      map((userCredential) => {
        const loggedInUser: User = {
          uid: userCredential.user.uid,
          username: user.username,
          email: user.email,
        };
        this.currentUserSubject.next(loggedInUser);
        this.isAuthenticatedSubject.next(true);
        return loggedInUser;
      }),
      catchError((error) => {
        console.error('Грешка при логване:', error);
        throw error;
      })
    );
  }

  logoutUser(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }),
      catchError((error) => {
        console.error('Грешка при логаут:', error);
        throw error;
      })
    );
  }
}
