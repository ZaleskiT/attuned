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

export interface Song {
  title: string;
  artist: string;
  album: string;
  cover: string;
  link: string;
}

export interface GuessResult {
  correct: boolean;
  song: Song;
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

  sendGuess(gameId: string, roundNumber: number, choice: string, secondsPlayed: number): Observable<GuessResult> {
    return this.http.post<GuessResult>(`/api/games/${gameId}/guess`, {
      roundNumber,
      choice,
      secondsPlayed,
    });
  }
}
