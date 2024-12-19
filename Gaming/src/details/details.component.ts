import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../service/game.service';
import { Game } from '../interfaces/gameInterface';
import { AuthService } from '../service/request.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  game: Game | null | undefined;
  newComment: string = ''; 
  userId: string | null = null; 
  isOwner: boolean = false;
  userName: string = '';
  videoUrl: SafeResourceUrl = '';

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.gameService.getGameById(gameId).subscribe((game) => {
        this.game = game;
        this.isOwner = this.game?.createdBy === this.userId; 
  
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

    this.userService.currentUser$.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;  
        console.log(this.userId); 
      }
    });
  }

  likeGame(): void {
    if (this.game?.id && this.userId) {
      if (!this.game.likedByUsers.includes(this.userId)) {
        this.gameService.likeGame(this.game.id, this.userId).subscribe(() => {
          if (this.game && this.userId) {
            this.game.likesCount++; 
            this.game.likedByUsers.push(this.userId);
          }
        });
      }
    }
  }
  

  editGame(): void {

    if (this.game?.id) {
      this.router.navigate(['/edit', this.game.id]);
    }
  }

  deleteGame(): void {
    if (this.game?.id) {
      this.gameService.deleteGame(this.game.id).subscribe(() => {
        this.router.navigate(['/catalog']);
      });
    }
  }

  onInputChange(event: Event): void {
    this.newComment = (event.target as HTMLTextAreaElement).value;
  }
}
