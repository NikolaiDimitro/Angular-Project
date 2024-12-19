import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../interfaces/gameInterface';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [ReactiveFormsModule],
})
export class EditComponent implements OnInit {
  gameForm: FormGroup;
  gameId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private gameService: GameService,
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
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id') || '';
    this.gameService.getGameById(this.gameId).subscribe((game: Game | null) => {
      if (game) {
        this.gameForm.patchValue(game);
      } else {
        console.error('Играта не беше намерена.');
        this.router.navigate(['/catalog']);
      }
    });
  }

  onSubmit(): void {
    if (this.gameForm.valid) {
      const updatedGame: Game = {
        ...this.gameForm.value,
      };

      this.gameService.updateGame(this.gameId, updatedGame).subscribe(
        () => {
          console.log('Играта беше успешно обновена.');
          this.router.navigate(['/details', this.gameId]);
        },
        (error) => {
          console.error('Грешка при обновяването на играта:', error);
        }
      );
    } else {
      console.error('Формата е невалидна.');
    }
  }
}
