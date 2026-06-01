import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export interface School {
  id: number;
  name: string;
  address: string;
  created_at: string;
}

export interface CreateSchoolRequest {
  name: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private readonly apiUrl =
    `${environment.apiUrl}/schools`;

  constructor(
    private readonly http: HttpClient,
  ) {}

  findAll() {
    return this.http.get<School[]>(
      this.apiUrl,
    );
  }

  create(data: CreateSchoolRequest) {
    return this.http.post<School>(
      this.apiUrl,
      data,
    );
  }
}