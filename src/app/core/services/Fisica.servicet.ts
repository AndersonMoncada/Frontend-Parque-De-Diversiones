import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FisicaCreate, FisicaRead } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class FisicaService {
  private readonly base = `${environment.apiUrl}/fisicas`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<FisicaRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<FisicaRead[]>(`${this.base}`, { params });
  }

  get(id: string): Observable<FisicaRead> {
    return this.http.get<FisicaRead>(`${this.base}/${id}`);
  }

  create(body: FisicaCreate): Observable<FisicaRead> {
    return this.http.post<FisicaRead>(`${this.base}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}