import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  ngOnInit(): void {

    this.gameService.getTopLikedGames(3).subscribe({
      next: (games) => (this.topLikedGames = games),
      error: (err) => console.error('Error fetching top liked games:', err),
    });
  }

  viewGameDetails(gameId: string): void {

    this.router.navigate(['/details', gameId]);
    
  }
}
