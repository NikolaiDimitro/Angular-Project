import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/request.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuth: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('Is authenticated:', isAuthenticated);
      this.isAuth = isAuthenticated;
    });
  }

  // Метод за логаут
  logout(): void {
    this.authService.logoutUser().subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Грешка при логаут:', err);
      },
    });
  }
}