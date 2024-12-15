import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { User } from '../types/userType'; // Импортираме типа User
import { initializeApp } from 'firebase/app';

// Инициализиране на Firebase приложението
const firebaseApp = initializeApp(environment.firebaseConfigUsers);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(firebaseApp); // Използваме инициализираното приложение
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // За проследяване на състоянието на автентикацията

  constructor() {
    // Проверяваме дали има логнат потребител при зареждане на приложението
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuthenticatedSubject.next(true);
      } else {
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  // Обект за проследяване на състоянието на автентикацията
  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Регистрация на нов потребител
  registerUser(user: User): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, user.email, user.password)).pipe(
      map((userCredential) => {
        const registeredUser: User = {
          ...user, // Включваме username, email и password от подадения обект
          uid: userCredential.user.uid, // Добавяме UID на потребителя
        };
        return registeredUser; // Връщаме обекта с информация за потребителя
      }),
      catchError((error) => {
        console.error('Грешка при регистрация:', error);
        throw error; // Хвърляме грешката
      })
    );
  }

  // Логване на потребител
  loginUser(user: User): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, user.email, user.password)).pipe(
      map((userCredential) => {
        const loggedInUser: User = {
          ...user, // Включваме email и password от подадения обект
          uid: userCredential.user.uid, // Добавяме UID на логнатия потребител
        };
        this.isAuthenticatedSubject.next(true); // Променяме състоянието на автентикацията
        return loggedInUser; // Връщаме обекта с информация за потребителя
      }),
      catchError((error) => {
        console.error('Грешка при логване:', error);
        throw error; // Хвърляме грешката
      })
    );
  }

  // Логаут на потребител
  logoutUser(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.isAuthenticatedSubject.next(false); // Променяме състоянието на автентикацията
      }),
      catchError((error) => {
        console.error('Грешка при логаут:', error);
        throw error; // Хвърляме грешката
      })
    );
  }
}
