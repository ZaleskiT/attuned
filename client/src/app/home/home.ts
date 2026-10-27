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
    this.router.navigate(['/play', 'test1']);
  }

}

