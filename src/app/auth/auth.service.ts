import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(response => { this.setToken(response.token); }));
  }

  logout(): void { localStorage.removeItem('token'); this.tokenSubject.next(null); }
  getToken(): string | null { return this.tokenSubject.value; }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch { return false; }
  }

  private setToken(token: string): void { localStorage.setItem('token', token); this.tokenSubject.next(token); }
  private getStoredToken(): string | null { return localStorage.getItem('token'); }
}
