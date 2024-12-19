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
  searchTerm: string = '';
  games: Array<any> = [];
  filteredGames: Array<any> = [];

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe(
      (games) => {
        this.games = games;
        this.filteredGames = [...this.games];
      },
      (error) => {
        console.error('Грешка при зареждането на игрите:', error);
      }
    );
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.onSearch();
  }

  onSearch(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredGames = this.games.filter(game =>
        game.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredGames = [...this.games];
    }
  }

  viewGameDetails(gameId: string): void {
    this.router.navigate(['/details', gameId]);
  }
}