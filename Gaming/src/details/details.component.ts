import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../service/game.service';
import { Game } from '../interfaces/gameInterface';
import { UserComment } from '../interfaces/comment';
import { AuthService } from '../service/request.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Импортиране на DomSanitizer

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  game: Game | null | undefined;
  newComment: string = '';  // Това е променливата за новия коментар
  userId: string = 'someUserId';  // Това трябва да бъде действителният user ID от сесията или Firebase
  isOwner: boolean = false;  // Това трябва да се реши според логиката на приложението (например проверка за съвпадение на ownerId)
  userName: string = '';  // Това ще съдържа името на потребителя
  videoUrl: SafeResourceUrl = ''; // Променлива за безопасния видеолинк

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: AuthService,  // Сървиза за потребители
    private sanitizer: DomSanitizer  // Инжектиране на DomSanitizer
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id'); // Вземане на gameId от URL параметрите

    if (gameId) {
      // Ако gameId е валидно, извикваме сървиса за играта
      this.gameService.getGameById(gameId).subscribe((game) => {
        this.game = game;
        this.isOwner = this.game?.createdBy === this.userId;  // Проверка дали потребителят е собственик на играта

        // Ако има видеолинк, го санитизираме и проверяваме дали е от правилния тип
        if (this.game?.videoLink) {
          // Проверяваме дали видеото е YouTube
          const videoUrl = this.game.videoLink;
          if (videoUrl.includes('youtube.com')) {
            // Ако е YouTube линк, правим го безопасен за вграждане
            const embedUrl = videoUrl.replace('watch?v=', 'embed/');
            this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl); // Санитизиране на URL-а
          } else {
            console.error('Невалиден видеолинк');
          }
        }
      });
    } else {
      // Ако gameId е null или undefined, хвърляме грешка или предприемаме съответното действие
      console.error('Game ID не е предоставен');
    }

    // Вземаме името на потребителя от сървиза
    this.userService.getUserNameById(this.userId).subscribe((name) => {
      this.userName = name;
    });
  }

  likeGame(): void {
    if (this.game?.id && this.userId) {
      // Проверка дали потребителят вече е харесал играта
      if (!this.game.likedByUsers.includes(this.userId)) {
        this.gameService.likeGame(this.game.id, this.userId).subscribe(() => {
          if (this.game) {
            this.game.likesCount++; // Увеличава броя на харесванията в локалната променлива
            this.game.likedByUsers.push(this.userId); // Добавя потребителя в масива с харесалите
          }
        });
      }
    }
  }

  editGame(): void {
    // Редактиране на играта (пренасочване към форма за редактиране)
    if (this.game?.id) {
      this.router.navigate(['/edit', this.game.id]);
    }
  }

  deleteGame(): void {
    if (this.game?.id) {
      this.gameService.deleteGame(this.game.id).subscribe(() => {
        this.router.navigate(['/']);  // Пренасочване към началната страница след изтриването
      });
    }
  }

  addComment(): void {
    if (this.game?.id && this.newComment) {
      const comment: UserComment = {
        id: '',  // Може да е празно, ако сървърът генерира id
        content: this.newComment,
        timestamp: new Date().toISOString(), // Преобразуване на датата в ISO формат
        userId: this.userId,  // Това трябва да е действителният потребителен ID
        userName: this.userName  // Използваме потребителското име вместо ID
      };
      this.gameService.addCommentToGame(this.game.id, comment).subscribe(() => {
        this.newComment = ''; // Почиства полето за коментар
        // Обновяване на коментарите без нужда от рефрешване на страницата
        this.game?.comments.push(comment); 
      });
    }
  }

  onInputChange(event: Event): void {
    this.newComment = (event.target as HTMLTextAreaElement).value;
  }
}
