import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { ApiService, Round } from '../api.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play implements OnInit, OnDestroy {
  readonly id = input.required<string>();

  private api = inject(ApiService);
  private audio = new Audio();

  protected readonly round = signal<Round | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly needsClick = signal(false);

  ngOnInit() {
    this.api.getRound(this.id()).subscribe({
      next: (round) => {
        this.round.set(round);
        this.audio.src = round.preview;
        this.playAudio();
      },
      error: () => {
        this.errorMessage.set('Could not load this round.');
      },
    });
  }

  ngOnDestroy() {
    this.audio.pause();
  }

  playAudio() {
    this.audio
      .play()
      .then(() => this.needsClick.set(false))
      .catch(() => this.needsClick.set(true));
  }
}
