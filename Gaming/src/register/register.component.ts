// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/request.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  handleSubmit() {
    if (this.registerForm.valid) {
      this.register();
    } else {
      console.log('Формата е невалидна!');
    }
  }

  register() {
    const user = this.registerForm.value;
    this.authService.registerUser(user).subscribe({
      next: (user) => {
        console.log('Регистриран потребител с UID:', user.uid); // user е тип User
        // Може да извършиш допълнителни действия след регистрация
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Грешка при регистрация:', err);
      },
    });
  }
}

