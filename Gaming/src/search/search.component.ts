import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';  // За съхранение на търсения термин
  games: Array<any> = [];  // За съхранение на всички игри
  filteredGames: Array<any> = [];  // За съхранение на филтрираните игри

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.loadGames();  // Зареждаме всички игри при инициализация на компонента
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe(
      (games) => {
        this.games = games;  // Записваме всички игри
        this.filteredGames = [...this.games];  // Начално показваме всички игри
      },
      (error) => {
        console.error('Грешка при зареждането на игрите:', error);
      }
    );
  }

  // Метод за обработка на търсенето
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.onSearch();  // Филтрираме игрите при промяна на търсения термин
  }

  onSearch(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredGames = this.games.filter(game =>
        game.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredGames = [...this.games];  // Ако няма търсене, показваме всички игри
    }
  }

  // Пренасочване към детайлите на играта
  viewGameDetails(gameId: string): void {
    this.router.navigate(['/details', gameId]);
  }
}
