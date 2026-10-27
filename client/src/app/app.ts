import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

// Verified the proxy works, cleaned up
@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
