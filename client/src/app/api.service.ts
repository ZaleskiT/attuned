import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Genre {
  id: number;
  name: string;
}

export interface NewGame {
  gameId: string;
  totalRounds: number;
}

export interface Round {
  roundNumber: number;
  totalRounds: number;
  preview: string;
  choices: string[];
}


// The singular api service

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>('/api/genres');
  }

  createGame(genreId: number): Observable<NewGame> {
    return this.http.post<NewGame>('/api/games', { genreId });
  }

  getRound(gameId: string): Observable<Round> {
    return this.http.get<Round>(`/api/games/${gameId}/round`);
  }
}
