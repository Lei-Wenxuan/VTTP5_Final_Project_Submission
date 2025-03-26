import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  private route = inject(ActivatedRoute);

  private http = inject(HttpClient);

  getOAuthUrl() {
    return this.http
      .get<{ url: string }>('/api/oauth/url', { withCredentials: true })
      .pipe(map((response) => response.url));
  }

  exchangeCodeForToken(code: string): Observable<string> {
    return this.http.post('/api/oauth/token', code, {
      responseType: 'text',
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
      }),
      withCredentials: true,
    });
  }
}
