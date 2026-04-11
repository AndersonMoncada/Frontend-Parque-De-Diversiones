import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AcuaticaCreate, AcuaticaRead, AcuaticaUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AcuaticaService {
  private readonly base = `${environment.apiUrl}/acuaticas`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<AcuaticaRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<AcuaticaRead[]>(`${this.base}`, { params });
  }

  get(id: string): Observable<AcuaticaRead> {
    return this.http.get<AcuaticaRead>(`${this.base}/${id}`);
  }

  create(body: AcuaticaCreate): Observable<AcuaticaRead> {
    return this.http.post<AcuaticaRead>(`${this.base}`, body);
  }

  update(id: string, body: AcuaticaUpdate): Observable<AcuaticaRead> {
    return this.http.put<AcuaticaRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}