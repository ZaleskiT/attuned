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
  score: number;
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
  points: number;
  score: number;
  secondsPlayed: number;
  song: Song;
}

export interface NextRound {
  finished: boolean;
  roundNumber: number;
}

export interface SongResult {
  roundNumber: number;
  title: string;
  artist: string;
  cover: string;
  link: string;
  choice: string | null;
  correct: boolean;
  points: number;
}

export interface GameResults {
  genreId: number;
  genreName: string;
  totalRounds: number;
  score: number;
  correctCount: number;
  accuracy: number;
  songs: SongResult[];
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

  sendGuess(gameId: string, roundNumber: number, choice: string | null, secondsPlayed: number): Observable<GuessResult> {
    return this.http.post<GuessResult>(`/api/games/${gameId}/guess`, {
      roundNumber,
      choice,
      secondsPlayed,
    });
  }

  nextRound(gameId: string, roundNumber: number): Observable<NextRound> {
    return this.http.post<NextRound>(`/api/games/${gameId}/next`, { roundNumber });
  }

  getResults(gameId: string): Observable<GameResults> {
    return this.http.get<GameResults>(`/api/games/${gameId}/results`);
  }
}
