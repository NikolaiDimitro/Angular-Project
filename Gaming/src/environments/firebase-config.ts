import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

// Инициализация на Firebase приложението за потребители
export const firebaseAppUsers = initializeApp(environment.firebaseConfigUsers, 'usersApp');

// Инициализация на Firebase приложението за игри
export const firebaseAppGames = initializeApp(environment.firebaseConfigGames, 'gamesApp');
