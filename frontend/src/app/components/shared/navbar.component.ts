import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fas fa-wallet me-2"></i>Budget App
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-chart-pie me-1"></i>Tableau de bord
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/budgets" routerLinkActive="active">
                <i class="fas fa-piggy-bank me-1"></i>Budgets
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/expenses" routerLinkActive="active">
                <i class="fas fa-receipt me-1"></i>Dépenses
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-plus me-1"></i>Ajouter
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" routerLink="/budgets/new">
                  <i class="fas fa-plus-circle me-2"></i>Nouveau Budget
                </a></li>
                <li><a class="dropdown-item" routerLink="/expenses/new">
                  <i class="fas fa-plus-circle me-2"></i>Nouvelle Dépense
                </a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
      font-size: 1.5rem;
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 0.375rem;
    }
    
    .dropdown-menu {
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `]
})
export class NavbarComponent { }