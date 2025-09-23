import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, CreateUserRequest } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}
  getUsers(): Observable<User[]> { return this.http.get<User[]>(this.apiUrl); }
  createUser(user: CreateUserRequest): Observable<User> { return this.http.post<User>(this.apiUrl, user); }
}
