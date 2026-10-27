import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Needed to pass URL params into component inputs
    provideRouter(routes, withComponentInputBinding()),
    // Makes HttpClient available so components can call our API
    provideHttpClient(),
  ]
};
