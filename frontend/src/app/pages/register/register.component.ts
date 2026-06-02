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

import {
  birthDateValidator,
  cpfMask,
  onlyCpfNumbers,
  onlyLettersValidator,
} from '../../core/utils/form-validators';

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
    name: [
      '',
      [
        Validators.required,
        onlyLettersValidator(),
      ],
    ],

    cpf: [
      '',
      [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
      ],
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
      ],
    ],

    birthDate: [
      '',
      [
        Validators.required,
        birthDateValidator(18, 100),
      ],
    ],
  });

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maskedCpf = cpfMask(input.value);

    input.value = maskedCpf;
    this.form.controls.cpf.setValue(maskedCpf);
  }

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const onlyLetters = input.value.replace(/[0-9]/g, '');

    input.value = onlyLetters;
    this.form.controls.name.setValue(onlyLetters);
  }

  submit(): void {
    if (this.form.invalid) {
      this.snackBar.open(
        'Preencha todos os campos corretamente.',
        'Fechar',
        { duration: 3000 },
      );

      return;
    }

    const rawData = this.form.getRawValue();

    const data: RegisterRequest = {
      name: rawData.name,
      cpf: onlyCpfNumbers(rawData.cpf),
      password: rawData.password,
      birthDate: rawData.birthDate,
    };

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