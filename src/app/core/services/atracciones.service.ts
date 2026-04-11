import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AtraccionCreate, AtraccionUpdate, AtraccionRead} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AtraccionService {
  private readonly base = `${environment.apiUrl}/atracciones`;

  constructor(private readonly http: HttpClient) {}
  list(): Observable<AtraccionRead[]>{
    return this.http.get<AtraccionRead[]>(`${this.base}`);
  }

  get(id: string): Observable<AtraccionRead>{
    return this.http.get<AtraccionRead>(`${this.base}/${id}`);
  }

  listarPorSede(id: string): Observable<AtraccionRead[]>{
    return this.http.get<AtraccionRead[]>(`${this.base}/sede/${id}`);
  } 

  create(body: AtraccionCreate): Observable<AtraccionRead>{
    return this.http.post<AtraccionRead>(`${this.base}`, body);
  }

  update(id: string, body: AtraccionUpdate): Observable<AtraccionRead>{
    return this.http.put<AtraccionRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void>{
    return this.http.delete<void>(`${this.base}/${id}`);
  }



} 