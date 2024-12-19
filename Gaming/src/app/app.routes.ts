import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { CreateComponent } from '../create/create.component';
import { CatalogComponent } from '../catalog/catalog.component';
import { DetailsComponent } from '../details/details.component';
import { EditComponent } from '../edit/edit.component';
import { ErrorComponent } from '../error/error.component';
import { SearchComponent } from '../search/search.component';
import { authGuard } from '../guard/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'create', component: CreateComponent, canActivate: [authGuard] },
    { path: 'details/:id', component: DetailsComponent },
    { path: 'edit/:id', component: EditComponent, canActivate: [authGuard] },
    { path: 'search', component: SearchComponent },
    { path: '404', component: ErrorComponent },
    { path: '**', redirectTo: '/404' },
];
