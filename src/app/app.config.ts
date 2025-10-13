import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
//import { customPaginatorIntl } from './components/config/customPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';
//import { loaderInterceptorFn } from './components/services/core/inhibitor.interceptor.service';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MY_DATE_FORMATS} from "./date-formats";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),

    provideNativeDateAdapter(),
    
    provideAnimationsAsync(),
    provideHttpClient(/*withInterceptors([loaderInterceptorFn])*/),
    {
      provide: MatPaginatorIntl,
      useValue: new MatPaginatorIntl()
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
};
