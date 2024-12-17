import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../service/game.service';
import { AuthService } from '../service/request.service';
import { Game } from '../interfaces/gameInterface';
import { UserComment } from '../interfaces/comment';

@Component({
  selector: 'app-game-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  game: Game | null = null;
  newComment: string = ''; // По подразбиране празен низ
  currentUserId: string | null | undefined = undefined;

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Вземаме текущия user ID
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserId = user.uid;
      } else {
        this.currentUserId = null;
      }
    });

    // Вземаме играта по ID от URL
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.gameService.getGameById(gameId).subscribe((game) => {
        this.game = game;
      });
    }
  }

  onLike(): void {
    if (this.game && this.game.id && this.currentUserId) {
      this.gameService.likeGame(this.game.id, this.currentUserId).subscribe(
        () => {
          if (this.game && this.currentUserId) {
            this.game.likesCount++;
            
            // Проверка дали текущият потребител вече е харесал играта
            if (this.game.likedByUsers && !this.game.likedByUsers.includes(this.currentUserId)) {
              this.game.likedByUsers.push(this.currentUserId); // Добавяме userId към списъка
            }
          }
        },
        (error) => {
          console.error('Грешка при лайкване:', error);
        }
      );
    }
  }
  
  onAddComment(): void {
    if (this.game && this.game.id && this.newComment.trim() && this.currentUserId) {
      const newComment: UserComment = {
        id: Date.now().toString(),
        userId: this.currentUserId,
        content: this.newComment,
        timestamp: new Date().toISOString(),
      };
  
      this.gameService.addComment(this.game.id, newComment).subscribe(
        () => {
          if (this.game) {
            this.game.comments.push(newComment);
            this.game.commentsCount++;
          }
          this.newComment = ''; // Изчистваме текстовото поле
        },
        (error) => {
          console.error('Грешка при добавяне на коментар:', error);
        }
      );
    }
  }
  
}
