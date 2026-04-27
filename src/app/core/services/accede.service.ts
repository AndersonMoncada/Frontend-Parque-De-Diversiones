import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api-url';
import { AccedeCreate, AccedeRead } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AccedeService {
  private readonly base = `${API_URL}/accede`;

  constructor(private readonly http: HttpClient) {}

  getByEntrada(idEntrada: string): Observable<AccedeRead[]> {
    return this.http.get<AccedeRead[]>(`${this.base}/entrada/${idEntrada}`);
  }

  getByAtraccion(idAtraccion: string): Observable<AccedeRead[]> {
    return this.http.get<AccedeRead[]>(`${this.base}/atraccion/${idAtraccion}`);
  }

  create(body: AccedeCreate): Observable<AccedeRead> {
    return this.http.post<AccedeRead>(this.base, body);
  }

  delete(idEntrada: string, idAtraccion: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${idEntrada}/${idAtraccion}`);
  }
}