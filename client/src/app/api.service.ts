import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Genre {
  id: number;
  name: string;
}


// The singular api service

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>('/api/genres');
  }
}
