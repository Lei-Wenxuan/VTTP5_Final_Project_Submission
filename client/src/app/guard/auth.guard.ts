import { inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthStore } from '../store/auth.store';

export class AuthGuard implements CanActivate {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.authStore.isAuthenticated$.pipe(
      take(1),
      map(
        (isAuthenticated) => isAuthenticated || this.router.parseUrl('/login'),
      ),
    );
  }
}
