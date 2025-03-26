import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthStore } from '../store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = '/api/auth';

  private http = inject(HttpClient);
  private router = inject(Router);
  private authStore = inject(AuthStore);
  private snackBar = inject(MatSnackBar);

  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http
      .post(`${this.API_URL}/signin`, formData, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.authStore.login(username);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', username);
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/home']);
        }),
        catchError((error) => {
          this.snackBar.open('Login failed', 'Close', { duration: 3000 });
          return throwError(error);
        })
      );
  }

  register(username: string, password: string) {
    return this.http.post(`${this.API_URL}/signup`, { username, password });
  }

  logout() {
    return this.http
      .post(
        `${this.API_URL}/signout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.authStore.logout();
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('username');
          this.snackBar.open('Logout successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/auth']);
        }),
        catchError((error) => {
          this.snackBar.open('Logout failed', 'Close', { duration: 3000 });
          return throwError(error);
        })
      );
  }
}
