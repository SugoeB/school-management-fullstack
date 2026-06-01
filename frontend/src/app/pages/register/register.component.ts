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
  RegisterRequest,
} from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  form = this.fb.group({
    name: ['', Validators.required],

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
        Validators.minLength(6),
      ],
    ],

    birthDate: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.snackBar.open(
        'Preencha todos os campos corretamente.',
        'Fechar',
        { duration: 3000 },
      );

      return;
    }

    const data: RegisterRequest = this.form.getRawValue();

    this.authService.register(data).subscribe({
      next: () => {
        this.snackBar.open(
          'Cadastro realizado com sucesso!',
          'Fechar',
          { duration: 3000 },
        );

        this.router.navigate(['/login']);
      },

      error: (error) => {
        this.snackBar.open(
          error.error?.message || 'Erro ao criar conta.',
          'Fechar',
          { duration: 3000 },
        );
      },
    });
  }
}