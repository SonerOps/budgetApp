/**
 * Budget App - Frontend Application
 * 
 * Application Angular de gestion de budget personnel
 * 
 * @author Otmanelaissi@gmail.com
 * @version 1.0.0
 * @license MIT
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Budget App';
}