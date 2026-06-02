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
  Teacher,
  TeacherService,
} from '../../core/services/teacher.service';

import {
  CreateStudentRequest,
  Student,
  StudentService,
} from '../../core/services/student.service';

import {
  birthDateValidator,
  cpfMask,
  onlyCpfNumbers,
  onlyLettersValidator,
} from '../../core/utils/form-validators';

@Component({
  selector: 'app-students',
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
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly teacherService = inject(TeacherService);
  private readonly studentService = inject(StudentService);
  private readonly snackBar = inject(MatSnackBar);

  teachers: Teacher[] = [];
  students: Student[] = [];

  displayedColumns: string[] = [
    'id',
    'name',
    'cpf',
    'birth_date',
    'teacher_name',
    'school_name',
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

    birthDate: [
      '',
      [
        Validators.required,
        birthDateValidator(0, 100),
      ],
    ],

    teacherId: [
      0,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
  });

  ngOnInit(): void {
    this.loadTeachers();
    this.loadStudents();
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

  loadStudents(): void {
    this.studentService.findAll().subscribe({
      next: (students: Student[]) => {
        this.students = students;
      },

      error: () => {
        this.snackBar.open(
          'Erro ao carregar alunos.',
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

    const data: CreateStudentRequest = {
      name: rawData.name,
      cpf: onlyCpfNumbers(rawData.cpf),
      birthDate: rawData.birthDate,
      teacherId: rawData.teacherId,
    };

    this.studentService.create(data).subscribe({
      next: () => {
        this.snackBar.open(
          'Aluno cadastrado com sucesso!',
          'Fechar',
          { duration: 3000 },
        );

        this.form.reset({
          name: '',
          cpf: '',
          birthDate: '',
          teacherId: 0,
        });

        this.loadStudents();
      },

      error: (error) => {
        this.snackBar.open(
          error.error?.message ||
            'Erro ao cadastrar aluno.',
          'Fechar',
          { duration: 3000 },
        );
      },
    });
  }
}