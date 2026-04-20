import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MecanicaCreate, MecanicaRead } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class MecanicaService {
  private readonly base = `${environment.apiUrl}/mecanicas`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<MecanicaRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<MecanicaRead[]>(this.base, { params });
  }

  get(id: string): Observable<MecanicaRead> {
    return this.http.get<MecanicaRead>(`${this.base}/${id}`);
  }

  create(body: MecanicaCreate): Observable<MecanicaRead> {
    return this.http.post<MecanicaRead>(this.base, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}