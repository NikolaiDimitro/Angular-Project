import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

export const firebaseAppUsers = initializeApp(environment.firebaseConfigUsers, 'usersApp');
export const firebaseAppGames = initializeApp(environment.firebaseConfigGames, 'gamesApp');