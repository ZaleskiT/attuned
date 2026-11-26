import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService, GameResults } from '../api.service';

@Component({
  selector: 'app-results',
  imports: [RouterLink],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  readonly id = input.required<string>();

  private api = inject(ApiService);
  private router = inject(Router);

  protected readonly results = signal<GameResults | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly starting = signal(false);

  ngOnInit() {
    this.api.getResults(this.id()).subscribe({
      next: (results) => {
        this.results.set(results);
      },
      error: () => {
        this.errorMessage.set('Results could not load.');
      },
    });
  }

  playAgain() {
    const results = this.results();
    if (!results) {
      return;
    }

    this.starting.set(true);

    this.api.createGame(results.genreId).subscribe({
      next: (game) => {
        this.router.navigate(['/play', game.gameId]);
      },
      error: () => {
        this.errorMessage.set('Was not able to start a new game.');
        this.starting.set(false);
      },
    });
  }
}
