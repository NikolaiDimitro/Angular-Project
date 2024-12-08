import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { SearchComponent } from '../search/search.component';
import { CatalogComponent } from '../catalog/catalog.component';
import { DetailsComponent } from '../details/details.component';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { ErrorComponent } from "../error/error.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, HeaderComponent, FooterComponent, RegisterComponent, LoginComponent, SearchComponent, CatalogComponent, DetailsComponent, CreateComponent, EditComponent, ErrorComponent],
  templateUrl:'./app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Gaming';
}
