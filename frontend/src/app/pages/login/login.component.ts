import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  Router,
  RouterLink,
} from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import {
  AuthService,
  LoginResponse,
} from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  form = this.fb.group({
    cpf: [
      '',
      [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ],
    ],

    password: [
      '',
      [
        Validators.required,
      ],
    ],
  });

  submit(): void {
    if (this.form.invalid) {
      this.snackBar.open(
        'Preencha CPF e senha corretamente.',
        'Fechar',
        { duration: 3000 },
      );

      return;
    }

    this.authService
      .login(this.form.getRawValue())
      .subscribe({
        next: (response: LoginResponse) => {
          this.authService.saveSession(response);

          this.snackBar.open(
            'Login realizado com sucesso!',
            'Fechar',
            { duration: 3000 },
          );

          this.router.navigate(['/dashboard']);
        },

        error: () => {
          this.snackBar.open(
            'CPF ou senha inválidos.',
            'Fechar',
            { duration: 3000 },
          );
        },
      });
  }
}