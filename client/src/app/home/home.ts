import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Genre } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  protected readonly genres = signal<Genre[]>([]);
  protected readonly selectedGenreId = signal<number | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly starting = signal(false);
  protected readonly startError = signal('');

  
  ngOnInit() {
    // Populate genre list
    this.api.getGenres().subscribe({
      next: (genres) => {
        this.genres.set(genres);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('There was an error loading the genre list.');
        this.loading.set(false);
      },
    });
  }

  selectGenre(id: number) {
    this.selectedGenreId.set(id);
  }

  start() {
    const genreId = this.selectedGenreId();
    if (genreId === null) {
      return;
    }

    this.starting.set(true);
    this.startError.set('');

    this.api.createGame(genreId).subscribe({
      next: (game) => {
        this.router.navigate(['/play', game.gameId]);
      },
      error: () => {
        this.startError.set('Could not start a game. Please try again.');
        this.starting.set(false);
      },
    });
  }

}

