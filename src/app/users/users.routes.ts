import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { authGuard } from '../auth/auth.guard';

export const usersRoutes: Routes = [
  { path: '', component: UserListComponent, canActivate: [authGuard] },
  { path: 'create', component: UserFormComponent, canActivate: [authGuard] }
];
