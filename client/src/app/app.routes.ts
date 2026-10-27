import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Play } from './play/play';
import { Results } from './results/results';

// First pass for routing
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'play/:id', component: Play },
  { path: 'results/:id', component: Results },
  { path: '**', redirectTo: '' },
];
