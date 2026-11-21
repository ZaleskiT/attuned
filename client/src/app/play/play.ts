import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, GuessResult, Round } from '../api.service';

const COUNTDOWN_SECONDS = 10;

@Component({
  selector: 'app-play',
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play implements OnInit, OnDestroy {
  readonly id = input.required<string>();

  private api = inject(ApiService);
  private router = inject(Router);
  private audio = new Audio();
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly round = signal<Round | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly needsClick = signal(false);
  protected readonly answered = signal(false);
  protected readonly selectedChoice = signal<string | null>(null);
  // Set during guess,
  protected readonly result = signal<GuessResult | null>(null);
  protected readonly score = signal(0);
  protected readonly countdown = signal<number | null>(null);

  ngOnInit() {
    this.audio.addEventListener('ended', () => this.startCountdown());
    this.loadRound();
  }

  ngOnDestroy() {
    this.audio.pause();
    this.stopCountdown();
  }

  loadRound() {
    this.round.set(null);
    this.answered.set(false);
    this.selectedChoice.set(null);
    this.result.set(null);
    this.needsClick.set(false);
    this.stopCountdown();

    this.api.getRound(this.id()).subscribe({
      next: (round) => {
        this.round.set(round);
        this.score.set(round.score);
        this.audio.src = round.preview;
        this.playAudio();
      },
      error: () => {
        this.errorMessage.set('Could not load this round.');
      },
    });
  }

  playAudio() {
    this.audio
      .play()
      .then(() => this.needsClick.set(false))
      .catch(() => this.needsClick.set(true));
  }

  // Needs to handle null now
  guess(choice: string | null) {
    const round = this.round();
    if (!round || this.answered()) {
      return;
    }

    this.audio.pause();
    this.stopCountdown();
    this.needsClick.set(false);
    this.answered.set(true);
    this.selectedChoice.set(choice);

    // Send the relevant information for determining result
    this.api.sendGuess(this.id(), round.roundNumber, choice, this.audio.currentTime).subscribe({
      next: (result) => {
        this.result.set(result);
        this.score.set(result.score);
      },
      error: () => {
        this.errorMessage.set('Guess couldn\'t be sent.');
      },
    });
  }

  skip() {
    // The best way to handle skips
    this.guess(null);
  }

  next() {
    const round = this.round();
    if (!round) {
      return;
    }

    this.api.nextRound(this.id(), round.roundNumber).subscribe({
      next: (next) => {
        if (next.finished) {
          // The game has completed, go to the results page
          this.router.navigate(['/results', this.id()]);
        } else {
          this.loadRound();
        }
      },
      error: () => {
        this.errorMessage.set('Error going to next round.');
      },
    });
  }

  private startCountdown() {
    if (this.answered()) {
      return;
    }

    this.countdown.set(COUNTDOWN_SECONDS);

    // Utilize interval: https://stackoverflow.com/questions/71218649/create-time-countdown-in-javascript
    this.countdownTimer = setInterval(() => {
      const secondsLeft = (this.countdown() ?? 0) - 1;
      this.countdown.set(secondsLeft);
      if (secondsLeft <= 0) {
        this.guess(null);
      }
    }, 1000);
  }

  private stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.countdown.set(null);
  }
}
