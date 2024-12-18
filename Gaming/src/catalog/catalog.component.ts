import { Component, inject } from '@angular/core';
import { GameService } from '../service/game.service';
import { Game } from '../interfaces/gameInterface';
import { Router } from '@angular/router'; // Импортираме Router

@Component({
  selector: 'app-catalog',
  standalone: true,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent {
  private gameService = inject(GameService);
  private router = inject(Router);  // Внедряваме Router
  games: Game[] = [];

  constructor() {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe((games: Game[]) => {
      this.games = games;
    });
  }

  // Метод за навигация към страницата с подробности за игра
  viewDetails(gameId: string): void {
    this.router.navigate(['/details/', gameId]); // Навигиране към детайлите на играта
  }
}
