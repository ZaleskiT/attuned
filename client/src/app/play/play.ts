import { Component, input } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.html',
})
export class Play {
  readonly id = input.required<string>();
}
