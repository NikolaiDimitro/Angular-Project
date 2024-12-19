import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../service/request.service';
import { User } from '../interfaces/userInterface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild('loginForm') form: NgForm | undefined;

  constructor(private api: AuthService, private router: Router) { }

  formSubmitHandler() {
    const form = this.form!;
    const user: User = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    };

    if (form?.invalid) {
      console.log('This form is invalid!');
      return;
    }

    this.api.loginUser(user).subscribe({
      next: () => {
        this.router.navigate(['']);
        form.reset();
      },
      error: (err) => {
        console.error('Грешка при логване:', err);
      },
    });
  }
}
