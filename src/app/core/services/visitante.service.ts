import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VisitanteCreate, VisitanteRead, VisitanteUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class VisitanteService {
  private readonly base = `${environment.apiUrl}/visitantes`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<VisitanteRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<VisitanteRead[]>(`${this.base}`, { params });
  }

  get(id: string): Observable<VisitanteRead> {
    return this.http.get<VisitanteRead>(`${this.base}/${id}`);
  }

  listByTitular(idTitular: string): Observable<VisitanteRead[]> {
    return this.http.get<VisitanteRead[]>(`${this.base}/titular/${idTitular}`);
  }

  create(body: VisitanteCreate): Observable<VisitanteRead> {
    return this.http.post<VisitanteRead>(`${this.base}`, body);
  }

  update(id: string, body: VisitanteUpdate): Observable<VisitanteRead> {
    return this.http.put<VisitanteRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}