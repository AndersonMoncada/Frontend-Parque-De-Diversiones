import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL } from '../api-url';
import { AtraccionCreate, AtraccionRead, AtraccionUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AtraccionService {
  private readonly base = `${API_URL}/atracciones`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<AtraccionRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<AtraccionRead[]>(this.base, { params });
  }

  get(id: string): Observable<AtraccionRead> {
    return this.http.get<AtraccionRead>(`${this.base}/${id}`);
  }

  create(body: AtraccionCreate): Observable<AtraccionRead> {
    return this.http.post<AtraccionRead>(this.base, body);
  }

  update(id: string, body: AtraccionUpdate): Observable<AtraccionRead> {
    return this.http.put<AtraccionRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}