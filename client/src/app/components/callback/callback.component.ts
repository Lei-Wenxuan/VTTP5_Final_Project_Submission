import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from '../../services/oauth.service';

@Component({
  selector: 'app-callback',
  standalone: false,
  template: '',
})
export class CallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oAuthService = inject(OAuthService);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const error = params['error'];

      if (code) {
        this.oAuthService.exchangeCodeForToken(code).subscribe({
          next: (tokens) => {
            localStorage.setItem('credential', tokens);
            this.router.navigate(['/calendar']);
          },
          error: (err) => {
            console.error('Token exchange failed:', err);
            this.router.navigate(['/']);
          },
        });
      } else if (error) {
        console.error('OAuth error:', error);
        this.router.navigate(['/']);
      }
    });
  }
}
