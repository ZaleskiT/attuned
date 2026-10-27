import { Component, input } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.html',
})
export class Results {
  readonly id = input.required<string>();
}
