import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export interface Teacher {
  id: number;
  name: string;
  cpf: string;
  birth_date: string;
  school_id: number;
  school: string;
}

export interface CreateTeacherRequest {
  name: string;
  cpf: string;
  password: string;
  birthDate: string;
  schoolId: number;
}

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private readonly apiUrl =
    `${environment.apiUrl}/teachers`;

  constructor(
    private readonly http: HttpClient,
  ) {}

  findAll() {
    return this.http.get<Teacher[]>(
      this.apiUrl,
    );
  }

  create(data: CreateTeacherRequest) {
    return this.http.post(
      this.apiUrl,
      data,
    );
  }
}