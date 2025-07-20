import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { Budget } from '../../models/budget.model';

@Component({
  selector: 'app-budget-list',
  template: `
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>
            <i class="fas fa-piggy-bank me-2"></i>Mes Budgets
          </h1>
          <button class="btn btn-primary" (click)="navigateToNew()">
            <i class="fas fa-plus me-2"></i>Nouveau Budget
          </button>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="row mb-4">
      <div class="col-md-4">
        <select class="form-select" [(ngModel)]="selectedCategory" (change)="filterByCategory()">
          <option value="">Toutes les catégories</option>
          <option value="Alimentation">Alimentation</option>
          <option value="Transport">Transport</option>
          <option value="Divertissement">Divertissement</option>
          <option value="Santé">Santé</option>
          <option value="Logement">Logement</option>
          <option value="Éducation">Éducation</option>
          <option value="Autres">Autres</option>
        </select>
      </div>
      <div class="col-md-4">
        <input type="text" class="form-control" placeholder="Rechercher..." 
               [(ngModel)]="searchTerm" (input)="filterBudgets()">
      </div>
      <div class="col-md-4">
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" (click)="sortBy('date')">
            <i class="fas fa-calendar me-1"></i>Date
          </button>
          <button class="btn btn-outline-secondary" (click)="sortBy('montant')">
            <i class="fas fa-euro-sign me-1"></i>Montant
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des budgets -->
    <div class="row" *ngIf="!loading && filteredBudgets.length > 0">
      <div class="col-md-6 col-lg-4 mb-3" *ngFor="let budget of filteredBudgets">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="badge" [ngClass]="getCategoryBadgeClass(budget.categorie)">
              {{ budget.categorie }}
            </span>
            <small class="text-muted">{{ budget.date | date:'short':'fr' }}</small>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ budget.titre }}</h5>
            <h3 class="text-primary mb-3">
              {{ budget.montant | currency:'EUR':'symbol':'1.2-2':'fr' }}
            </h3>
            <p class="card-text text-muted" *ngIf="budget.notes">
              {{ budget.notes }}
            </p>
          </div>
          <div class="card-footer bg-transparent">
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm flex-fill" 
                      (click)="editBudget(budget._id!)">
                <i class="fas fa-edit me-1"></i>Modifier
              </button>
              <button class="btn btn-outline-danger btn-sm" 
                      (click)="deleteBudget(budget._id!, budget.titre)">
                <i class="fas fa-trash me-1"></i>Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucun budget -->
    <div class="text-center py-5" *ngIf="!loading && filteredBudgets.length === 0 && budgets.length === 0">
      <i class="fas fa-piggy-bank fa-4x text-muted mb-3"></i>
      <h3 class="text-muted">Aucun budget enregistré</h3>
      <p class="text-muted">Commencez par créer votre premier budget</p>
      <button class="btn btn-primary" (click)="navigateToNew()">
        <i class="fas fa-plus me-2"></i>Créer un Budget
      </button>
    </div>

    <!-- Message si aucun résultat de recherche -->
    <div class="text-center py-5" *ngIf="!loading && filteredBudgets.length === 0 && budgets.length > 0">
      <i class="fas fa-search fa-4x text-muted mb-3"></i>
      <h3 class="text-muted">Aucun résultat trouvé</h3>
      <p class="text-muted">Essayez de modifier vos critères de recherche</p>
      <button class="btn btn-outline-secondary" (click)="clearFilters()">
        Effacer les filtres
      </button>
    </div>

    <!-- Statistiques -->
    <div class="row mt-4" *ngIf="budgets.length > 0">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-chart-bar me-2"></i>Statistiques
            </h5>
            <div class="row text-center">
              <div class="col-md-3">
                <h4 class="text-primary">{{ budgets.length }}</h4>
                <small class="text-muted">Total Budgets</small>
              </div>
              <div class="col-md-3">
                <h4 class="text-success">{{ getTotalAmount() | currency:'EUR':'symbol':'1.2-2':'fr' }}</h4>
                <small class="text-muted">Montant Total</small>
              </div>
              <div class="col-md-3">
                <h4 class="text-info">{{ getAverageAmount() | currency:'EUR':'symbol':'1.2-2':'fr' }}</h4>
                <small class="text-muted">Moyenne</small>
              </div>
              <div class="col-md-3">
                <h4 class="text-warning">{{ getMostUsedCategory() }}</h4>
                <small class="text-muted">Catégorie Principale</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chargement -->
    <div class="text-center py-5" *ngIf="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- Erreur -->
    <div class="alert alert-danger" *ngIf="error">
      <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      transition: all 0.15s ease-in-out;
    }
    
    .card:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .badge {
      font-size: 0.75rem;
    }
  `]
})
export class BudgetListComponent implements OnInit {
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  loading = false;
  error: string | null = null;
  selectedCategory = '';
  searchTerm = '';
  sortField = 'date';
  sortDirection = 'desc';

  constructor(
    private budgetService: BudgetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.loading = true;
    this.error = null;

    this.budgetService.getAllBudgets().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.budgets = response.data;
          this.filteredBudgets = [...this.budgets];
          this.sortBudgets();
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  filterByCategory(): void {
    this.filterBudgets();
  }

  filterBudgets(): void {
    this.filteredBudgets = this.budgets.filter(budget => {
      const matchesCategory = !this.selectedCategory || budget.categorie === this.selectedCategory;
      const matchesSearch = !this.searchTerm || 
        budget.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        budget.notes?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
    this.sortBudgets();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.sortBudgets();
  }

  sortBudgets(): void {
    this.filteredBudgets.sort((a, b) => {
      let aValue: any = a[this.sortField as keyof Budget];
      let bValue: any = b[this.sortField as keyof Budget];

      if (this.sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.filterBudgets();
  }

  navigateToNew(): void {
    this.router.navigate(['/budgets/new']);
  }

  editBudget(id: string): void {
    this.router.navigate(['/budgets/edit', id]);
  }

  deleteBudget(id: string, title: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le budget "${title}" ?`)) {
      this.budgetService.deleteBudget(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBudgets();
          }
        },
        error: (error) => {
          this.error = error;
        }
      });
    }
  }

  getCategoryBadgeClass(category: string): string {
    const classes: { [key: string]: string } = {
      'Alimentation': 'bg-success',
      'Transport': 'bg-primary',
      'Divertissement': 'bg-warning',
      'Santé': 'bg-danger',
      'Logement': 'bg-info',
      'Éducation': 'bg-secondary',
      'Autres': 'bg-dark'
    };
    return classes[category] || 'bg-secondary';
  }

  getTotalAmount(): number {
    return this.budgets.reduce((sum, budget) => sum + budget.montant, 0);
  }

  getAverageAmount(): number {
    return this.budgets.length > 0 ? this.getTotalAmount() / this.budgets.length : 0;
  }

  getMostUsedCategory(): string {
    if (this.budgets.length === 0) return 'N/A';
    
    const categoryCount: { [key: string]: number } = {};
    this.budgets.forEach(budget => {
      categoryCount[budget.categorie] = (categoryCount[budget.categorie] || 0) + 1;
    });
    
    return Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );
  }
}