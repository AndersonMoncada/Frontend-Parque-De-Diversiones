import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AccedeCreate, AccedeRead } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AccedeService {
  private readonly base = `${environment.apiUrl}/accede`;

  constructor(private readonly http: HttpClient) {}

  listarPorEntrada(id: string): Observable<AccedeRead[]> {
    return this.http.get<AccedeRead[]>(`${this.base}/entrada/${id}`);
  }

  listarPorAtraccion(id: string): Observable<AccedeRead[]> {
    return this.http.get<AccedeRead[]>(`${this.base}/atraccion/${id}`);
  }

  create(body: AccedeCreate): Observable<AccedeRead> {
    return this.http.post<AccedeRead>(`${this.base}`, body);
  }

  delete(idEntrada: string, idAtraccion: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${idEntrada}/${idAtraccion}`);
  }

}