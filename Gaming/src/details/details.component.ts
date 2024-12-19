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
  userId: string | null = null;  // Позволява стойности null или string
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
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.gameService.getGameById(gameId).subscribe((game) => {
        this.game = game;
        this.isOwner = this.game?.createdBy === this.userId; // Проверяваме дали създателят на играта е същият като текущия потребител
        console.log(this.game?.createdBy);
        console.log(this.userId);
        console.log(this.isOwner);
  
        // Логика за видеото (ако има)
        if (this.game?.videoLink) {
          const videoUrl = this.game.videoLink;
          if (videoUrl.includes('youtube.com')) {
            const embedUrl = videoUrl.replace('watch?v=', 'embed/');
            this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
          } else {
            console.error('Невалиден видеолинк');
          }
        }
      });
    }

    // Вземане на текущия потребител и извличане на UID
    this.userService.currentUser$.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;  // Присвояваме UID само ако не е null или undefined
        console.log(this.userId);  // Това е тестова проверка
      }
    });
  }

  likeGame(): void {
    if (this.game?.id && this.userId) {
      // Проверка дали потребителят вече е харесал играта
      if (!this.game.likedByUsers.includes(this.userId)) {
        this.gameService.likeGame(this.game.id, this.userId).subscribe(() => {
          if (this.game && this.userId) { // Проверка за userId преди да добавим
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
        this.router.navigate(['/catalog']);  // Пренасочване към началната страница след изтриването
      });
    }
  }

  addComment(): void {
    if (this.game?.id && this.newComment) {
      const comment: UserComment = {
        id: '',  // Може да е празно, ако сървърът генерира id
        content: this.newComment,
        timestamp: new Date().toISOString(), // Преобразуване на датата в ISO формат
        userId: this.userId ?? '',  // Ако userId е null, използваме празен стринг
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
