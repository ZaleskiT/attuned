import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private http = inject(HttpClient);

  // What the page shows; updated when the server answers
  protected readonly serverStatus = signal('Checking server...');

  ngOnInit() {
    // Relative URL: the dev-server proxy forwards /api to Express on port 3000
    this.http.get<{ status: string; message: string }>('/api/health').subscribe({
      next: (data) => this.serverStatus.set(data.message),
      error: () => this.serverStatus.set('Could not reach the server. Is it running?'),
    });
  }
}
