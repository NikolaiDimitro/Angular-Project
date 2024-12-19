import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Импортиране на Router
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
  private gameService = inject(GameService);
  private router = inject(Router);  // Инжектиране на Router

  ngOnInit(): void {
    // Зареждаме топ 3 харесвани игри
    this.gameService.getTopLikedGames(3).subscribe({
      next: (games) => (this.topLikedGames = games),
      error: (err) => console.error('Error fetching top liked games:', err),
    });
  }

  // Пренасочване към страницата с детайлите за играта
  viewGameDetails(gameId: string): void {
    console.log(`Navigating to game details for ID: ${gameId}`);
    // Използваме програмна навигация
    this.router.navigate(['/details', gameId]);
  }
}
