import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

export interface LoginRequest {
  cpf: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  cpf: string;
  password: string;
  birthDate: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    cpf: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data,
    );
  }

  register(data: RegisterRequest) {
    return this.http.post(
      `${this.apiUrl}/users`,
      data,
    );
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}