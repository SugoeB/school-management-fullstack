import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import {
  CreateSchoolRequest,
  School,
  SchoolService,
} from '../../core/services/school.service';

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.scss',
})
export class SchoolsComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly schoolService = inject(SchoolService);
  private readonly snackBar = inject(MatSnackBar);

  schools: School[] = [];

  displayedColumns: string[] = [
    'id',
    'name',
    'address',
  ];

  form = this.fb.group({
    name: [
      '',
      [
        Validators.required,
      ],
    ],

    address: [
      '',
      [
        Validators.required,
      ],
    ],
  });

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.schoolService.findAll().subscribe({
      next: (schools: School[]) => {
        this.schools = schools;
      },

      error: () => {
        this.snackBar.open(
          'Erro ao carregar escolas.',
          'Fechar',
          { duration: 3000 },
        );
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.snackBar.open(
        'Preencha todos os campos.',
        'Fechar',
        { duration: 3000 },
      );

      return;
    }

    const data: CreateSchoolRequest =
      this.form.getRawValue();

    this.schoolService.create(data).subscribe({
      next: () => {
        this.snackBar.open(
          'Escola cadastrada com sucesso!',
          'Fechar',
          { duration: 3000 },
        );

        this.form.reset();
        this.loadSchools();
      },

      error: () => {
        this.snackBar.open(
          'Erro ao cadastrar escola.',
          'Fechar',
          { duration: 3000 },
        );
      },
    });
  }
}