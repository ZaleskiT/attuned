import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { ApiService, GuessResult, Round } from '../api.service';

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
  protected readonly selectedChoice = signal<string | null>(null);
  // Set during guess,
  protected readonly result = signal<GuessResult | null>(null);

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

  guess(choice: string) {
    const round = this.round();
    if (!round || this.selectedChoice()) {
      return;
    }

    this.audio.pause();
    this.needsClick.set(false);

    this.selectedChoice.set(choice);

    // Send the relevant information for determining result
    this.api.sendGuess(this.id(), round.roundNumber, choice, this.audio.currentTime).subscribe({
      next: (result) => {
        this.result.set(result);
      },
      error: () => {
        this.errorMessage.set('Guess couldn\'t be sent.');
      },
    });
  }
}
