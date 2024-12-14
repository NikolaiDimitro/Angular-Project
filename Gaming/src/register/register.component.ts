import { Component } from '@angular/core';
import { User } from '../types/userType';
import { AuthService } from '../service/request.service';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

// Хардкоднати данни на потребителя
private user: User = {
  username: 'Ivancho',
  email: 'ivancho@abv.bg',
  password: '2222'
};

constructor(private authService: AuthService) {}

// Регистриране на потребител
register() {
  this.authService.registerUser(this.user).subscribe({
    next: (uid) => {
      console.log('Регистриран потребител с UID:', uid);
      // Допълнителни действия след регистрация
    },
    error: (err) => {
      console.error('Грешка при регистрация:', err);
    }
  });
}

}