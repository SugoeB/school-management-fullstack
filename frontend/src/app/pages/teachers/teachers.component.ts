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
import { MatSelectModule } from '@angular/material/select';

import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { MatTableModule } from '@angular/material/table';

import {
  School,
  SchoolService,
} from '../../core/services/school.service';

import {
  CreateTeacherRequest,
  Teacher,
  TeacherService,
} from '../../core/services/teacher.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss',
})
export class TeachersComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly schoolService = inject(SchoolService);
  private readonly teacherService = inject(TeacherService);
  private readonly snackBar = inject(MatSnackBar);

  schools: School[] = [];
  teachers: Teacher[] = [];

  displayedColumns: string[] = [
    'id',
    'name',
    'cpf',
    'birth_date',
    'school',
  ];

  form = this.fb.group({
    name: [
      '',
      [
        Validators.required,
      ],
    ],

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

    birthDate: [
      '',
      [
        Validators.required,
      ],
    ],

    schoolId: [
      0,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
  });

  ngOnInit(): void {
    this.loadSchools();
    this.loadTeachers();
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

  loadTeachers(): void {
    this.teacherService.findAll().subscribe({
      next: (teachers: Teacher[]) => {
        this.teachers = teachers;
      },

      error: () => {
        this.snackBar.open(
          'Erro ao carregar professores.',
          'Fechar',
          { duration: 3000 },
        );
      },
    });
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

    const data: CreateTeacherRequest =
      this.form.getRawValue();

    this.teacherService.create(data).subscribe({
      next: () => {
        this.snackBar.open(
          'Professor cadastrado com sucesso!',
          'Fechar',
          { duration: 3000 },
        );

        this.form.reset({
          name: '',
          cpf: '',
          password: '',
          birthDate: '',
          schoolId: 0,
        });

        this.loadTeachers();
      },

      error: (error) => {
        this.snackBar.open(
          error.error?.message ||
            'Erro ao cadastrar professor.',
          'Fechar',
          { duration: 3000 },
        );
      },
    });
  }
}