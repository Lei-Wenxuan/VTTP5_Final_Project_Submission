import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs/operators';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  constructor() {
    super(initialState);
  }

  readonly isAuthenticated$ = this.select((state) => state.isAuthenticated);
  readonly user$ = this.select((state) => state.user);
  readonly username$ = this.select((state) => state.user?.username);

  readonly login = this.updater((state, username: string) => ({
    ...state,
    isAuthenticated: true,
    user: { username },
  }));

  readonly logout = this.updater((state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }));

  private loadFromLocalStorage() {
    const auth = localStorage.getItem('auth');
    if (auth) {
      this.setState(JSON.parse(auth));
    }
  }

  readonly persistToLocalStorage = this.effect<void>(($) =>
    $.pipe(
      tap(() => {
        localStorage.setItem('auth', JSON.stringify(this.get()));
      }),
    ),
  );

  readonly checkAuthStatus = this.effect<void>(($) =>
    $.pipe(
      tap(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (loggedIn) {
          const username = localStorage.getItem('username') || '';
          this.login(username);
        }
      }),
    ),
  );
}
