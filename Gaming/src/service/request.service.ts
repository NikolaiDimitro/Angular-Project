import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { User } from '../types/userType';  // Импортираме типа User
import { initializeApp } from 'firebase/app';

// Инициализиране на Firebase приложението
const firebaseApp = initializeApp(environment.firebaseConfigUsers);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(firebaseApp);  // Използваме инициализираното приложение

  constructor() {}

  /**
   * Регистриране на нов потребител
   * @param user - Обект с данни за потребителя (username, email и password)
   * @returns Observable<User> - Обект с информация за регистрирания потребител
   */
  registerUser(user: User): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, user.email, user.password)).pipe(
      map((userCredential) => {
        // Създаваме нов обект User, като добавяме UID към него
        const registeredUser: User = {
          ...user,           // Включваме username, email и password от подадения обект
          uid: userCredential.user.uid, // Добавяме UID на потребителя
        };
        return registeredUser; // Връщаме обекта с информация за потребителя
      }),
      catchError((error) => {
        console.error('Грешка при регистрация:', error);
        throw error; // Хвърляме грешката, за да може тя да бъде уловена от подписания наблюдател
      })
    );
  }

  /**
   * Логване на потребител
   * @param user - Обект с данни за потребителя (email и password)
   * @returns Observable<User> - Обект с информация за логнатия потребител
   */
  loginUser(user: User): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, user.email, user.password)).pipe(
      map((userCredential) => {
        // Създаваме нов обект User, като добавяме UID към него
        const loggedInUser: User = {
          ...user,           // Включваме email и password от подадения обект
          uid: userCredential.user.uid, // Добавяме UID на логнатия потребител
        };
        return loggedInUser; // Връщаме обекта с информация за потребителя
      }),
      catchError((error) => {
        console.error('Грешка при логване:', error);
        throw error; // Хвърляме грешката
      })
    );
  }

  /**
   * Логаут на текущо логнатия потребител
   * @returns Observable<void> - Успешен или неуспешен логаут
   */
  logoutUser(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        // Успешен логаут
      }),
      catchError((error) => {
        console.error('Грешка при логаут:', error);
        throw error; // Хвърляме грешката
      })
    );
  }
}
