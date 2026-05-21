// src/app/core/services/titular.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TitularCreate, TitularRead, TitularUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class TitularService {
  private readonly base = `${environment.apiUrl}/titulares`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<TitularRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<TitularRead[]>(`${this.base}`, { params });
  }

  get(id: string): Observable<TitularRead> {
    return this.http.get<TitularRead>(`${this.base}/${id}`);
  }

  create(body: TitularCreate): Observable<TitularRead> {
    return this.http.post<TitularRead>(`${this.base}`, body);
  }

  update(id: string, body: TitularUpdate): Observable<TitularRead> {
    return this.http.put<TitularRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}