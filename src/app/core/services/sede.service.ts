import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL } from '../api-url';
import { SedeCreate, SedeRead, SedeUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class SedeService {
  private readonly base = `${API_URL}/sedes`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<SedeRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<SedeRead[]>(this.base, { params });
  }

  get(id: string): Observable<SedeRead> {
    return this.http.get<SedeRead>(`${this.base}/${id}`);
  }

  create(body: SedeCreate): Observable<SedeRead> {
    return this.http.post<SedeRead>(this.base, body);
  }

  update(id: string, body: SedeUpdate): Observable<SedeRead> {
    return this.http.put<SedeRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}