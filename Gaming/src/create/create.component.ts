import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Game } from '../interfaces/gameInterface';
import { GameService } from '../service/game.service';
import { AuthService } from '../service/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game',
  imports: [ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  gameForm: FormGroup;
  userID: string = '';

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private authService: AuthService,
    private router: Router
  ) {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      studio: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      genre: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      videoLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userID = user.uid ?? ''
      }
    });
  }

  onSubmit(): void {
    if (this.gameForm.valid && this.userID) {
      const game: Game = {
        ...this.gameForm.value,
        createdBy: this.userID,
      };

      this.gameService.addGame(game).subscribe(
        (docRef) => {
          console.log('Играта беше успешно добавена:', docRef);
          this.router.navigate(['']);
        },
        (error) => {
          console.error('Грешка при добавянето на играта:', error);
        }
      );
    } else {
      console.error('Формата е невалидна или userID липсва.');
    }
  }
}
