import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export interface Student {
  id: number;
  name: string;
  cpf: string;
  birth_date: string;
  teacher_id: number;
  teacher_name: string;
  school_id: number;
  school_name: string;
}

export interface CreateStudentRequest {
  name: string;
  cpf: string;
  birthDate: string;
  teacherId: number;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly apiUrl =
    `${environment.apiUrl}/students`;

  constructor(
    private readonly http: HttpClient,
  ) {}

  findAll() {
    return this.http.get<Student[]>(
      this.apiUrl,
    );
  }

  create(data: CreateStudentRequest) {
    return this.http.post<Student>(
      this.apiUrl,
      data,
    );
  }
}