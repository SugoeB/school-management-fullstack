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

import {
  birthDateValidator,
  cpfMask,
  onlyCpfNumbers,
  onlyLettersValidator,
} from '../../core/utils/form-validators';

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

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maskedCpf = cpfMask(input.value);

    input.value = maskedCpf;

    this.form.controls.cpf.setValue(maskedCpf, {
      emitEvent: false,
    });
  }

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const onlyLetters = input.value.replace(/[0-9]/g, '');

    input.value = onlyLetters;

    this.form.controls.name.setValue(onlyLetters, {
      emitEvent: false,
    });
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

    const rawData = this.form.getRawValue();

    const data: CreateTeacherRequest = {
      name: rawData.name,
      cpf: onlyCpfNumbers(rawData.cpf),
      password: rawData.password,
      birthDate: rawData.birthDate,
      schoolId: rawData.schoolId,
    };

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