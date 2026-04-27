import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api-url';
import { EntradaCreate, EntradaUpdate, EntradaRead } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class EntradaService {
  private readonly base = `${API_URL}/entradas`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<EntradaRead[]> {
    return this.http.get<EntradaRead[]>(`${this.base}/`);
  }

  get(id: string): Observable<EntradaRead> {
    return this.http.get<EntradaRead>(`${this.base}/${id}`);
  }

  listarPorTitular(id: string): Observable<EntradaRead[]> {
    return this.http.get<EntradaRead[]>(`${this.base}/titular/${id}`);
  }

  create(body: EntradaCreate): Observable<EntradaRead> {
    return this.http.post<EntradaRead>(this.base, body);
  }

  update(id: string, body: EntradaUpdate): Observable<EntradaRead> {
    return this.http.put<EntradaRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}