import { Component, inject, OnInit } from '@angular/core';

import { Game } from '../interfaces/gameInterface';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GameService],
})
export class HomeComponent implements OnInit {
  topLikedGames: Game[] = [];
  topCommentedGames: Game[] = [];

  private gameService = inject(GameService);

  ngOnInit(): void {
    // Зареждане на топ 3 харесвани игри
    this.gameService.getTopLikedGames(3).subscribe({
      next: (games) => (this.topLikedGames = games),
      error: (err) => console.error('Error fetching top liked games:', err),
    });

    // Зареждане на топ 3 коментирани игри
    this.gameService.getTopCommentedGames(3).subscribe({
      next: (games) => (this.topCommentedGames = games),
      error: (err) => console.error('Error fetching top commented games:', err),
    });
  }

  // Пренасочване към страницата с детайлите за играта
  viewGameDetails(gameId: string): void {
    console.log(`Navigate to game details for ID: ${gameId}`);
    // Реализирай логиката за пренасочване (Router.navigate() или друга логика)
  }
}
