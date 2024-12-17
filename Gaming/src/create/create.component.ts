import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Game } from '../interfaces/gameInterface';
import { GameService } from '../service/game.service';
import { AuthService } from '../service/request.service'; // Добавяме AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game',
  imports: [ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  gameForm: FormGroup;
  userID: string = ''; // За съхранение на текущото userID

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private authService: AuthService, // Взимаме AuthService
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

    // Взимаме текущото userID от AuthService
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userID = user.uid ?? ''// Запазваме userID
      }
    });
  }

  onSubmit(): void {
    if (this.gameForm.valid && this.userID) {
      const game: Game = {
        ...this.gameForm.value,
        createdBy: this.userID, // Добавяме userID на създателя
      };

      this.gameService.addGame(game).subscribe(
        (docRef) => {
          console.log('Играта беше успешно добавена:', docRef);
          this.router.navigate(['']); // Пренасочваме към началната страница
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
