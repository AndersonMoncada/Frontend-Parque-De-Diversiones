import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SedeCreate, SedeUpdate, SedeRead} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class SedeService {
  private readonly base = `${environment.apiUrl}/sedes`;

  constructor(private readonly http: HttpClient) {}
  list(): Observable<SedeRead[]>{
    return this.http.get<SedeRead[]>(`${this.base}`);
  }

  get(id: string): Observable<SedeRead>{
    return this.http.get<SedeRead>(`${this.base}/sede/${id}`);
  }

  create(body: SedeCreate): Observable<SedeRead>{
    return this.http.post<SedeRead>(`${this.base}`, body);
  }

  update(id: string, body: SedeUpdate): Observable<SedeRead>{
    return this.http.put<SedeRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void>{
    return this.http.delete<void>(`${this.base}/${id}`);
  }

} 