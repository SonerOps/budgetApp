/**
 * Dashboard Component - Composant du tableau de bord
 * 
 * POUR DÉBUTANTS :
 * Ce composant affiche le TABLEAU DE BORD de l'application.
 * Il récupère et affiche toutes les statistiques importantes :
 * - Résumé financier (budget total, dépenses, solde)
 * - Graphiques par catégorie
 * - Activités récentes
 * 
 * Component = classe TypeScript qui contrôle une partie de l'interface
 * Template = code HTML du composant
 * OnInit = interface qui force à implémenter ngOnInit()
 * 
 * @author Otmanelaissi@gmail.com
 */

// ========================================
// IMPORTATIONS NÉCESSAIRES
// ========================================

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardData } from '../../models/dashboard.model';

// ========================================
// DÉCORATEUR COMPONENT
// ========================================

@Component({
  selector: 'app-dashboard',    // Nom du tag HTML : <app-dashboard></app-dashboard>
  template: `
    <!-- ========================================
         EN-TÊTE DU TABLEAU DE BORD
         ======================================== -->
    
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">
          <i class="fas fa-chart-pie me-2"></i>Tableau de bord
        </h1>
      </div>
    </div>

    <!-- ========================================
         CARTES DE RÉSUMÉ FINANCIER
         ======================================== -->
    
    <!-- *ngIf="dashboardData" = affiche seulement si les données sont chargées -->
    <div class="row mb-4" *ngIf="dashboardData">
      
      <!-- CARTE 1 : BUDGET TOTAL -->
      <div class="col-md-3 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Budget Total</h6>
                <!-- | currency = pipe Angular pour formater en euros -->
                <h3 class="mb-0">{{ dashboardData.summary.totalBudget | currency:'EUR':'symbol':'1.2-2':'fr' }}</h3>
              </div>
              <div class="align-self-center">
                <i class="fas fa-piggy-bank fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARTE 2 : DÉPENSES TOTALES -->
      <div class="col-md-3 mb-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Dépenses Totales</h6>
                <h3 class="mb-0">{{ dashboardData.summary.totalExpenses | currency:'EUR':'symbol':'1.2-2':'fr' }}</h3>
              </div>
              <div class="align-self-center">
                <i class="fas fa-receipt fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARTE 3 : SOLDE RESTANT -->
      <div class="col-md-3 mb-3">
        <!-- [ngClass] = classe CSS conditionnelle basée sur le solde -->
        <div class="card" [ngClass]="dashboardData.summary.remainingBalance >= 0 ? 'bg-success text-white' : 'bg-warning text-dark'">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Solde Restant</h6>
                <h3 class="mb-0">{{ dashboardData.summary.remainingBalance | currency:'EUR':'symbol':'1.2-2':'fr' }}</h3>
              </div>
              <div class="align-self-center">
                <i class="fas fa-wallet fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARTE 4 : UTILISATION DU BUDGET -->
      <div class="col-md-3 mb-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Utilisation Budget</h6>
                <h3 class="mb-0">{{ dashboardData.summary.budgetUtilization }}%</h3>
              </div>
              <div class="align-self-center">
                <i class="fas fa-percentage fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================
         SECTION GRAPHIQUES
         ======================================== -->
    
    <div class="row mb-4" *ngIf="dashboardData">
      
      <!-- GRAPHIQUE 1 : DÉPENSES PAR CATÉGORIE -->
      <div class="col-md-6 mb-3">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-chart-pie me-2"></i>Dépenses par Catégorie
            </h5>
          </div>
          <div class="card-body">
            <!-- *ngIf avec else = condition avec template alternatif -->
            <div *ngIf="dashboardData.charts.expensesByCategory.length > 0; else noExpenses">
              <!-- *ngFor = boucle pour afficher chaque catégorie -->
              <div class="mb-3" *ngFor="let category of dashboardData.charts.expensesByCategory">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span>{{ category.category }}</span>
                  <span class="fw-bold">{{ category.amount | currency:'EUR':'symbol':'1.2-2':'fr' }}</span>
                </div>
                <!-- Barre de progression avec largeur dynamique -->
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" 
                       [style.width.%]="category.percentage"
                       [attr.aria-valuenow]="category.percentage">
                  </div>
                </div>
                <small class="text-muted">{{ category.percentage }}% ({{ category.count }} dépense(s))</small>
              </div>
            </div>
            <!-- Template alternatif si aucune dépense -->
            <ng-template #noExpenses>
              <p class="text-muted text-center">Aucune dépense enregistrée</p>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- GRAPHIQUE 2 : BUDGETS PAR CATÉGORIE -->
      <div class="col-md-6 mb-3">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-chart-bar me-2"></i>Budgets par Catégorie
            </h5>
          </div>
          <div class="card-body">
            <div *ngIf="dashboardData.charts.budgetsByCategory.length > 0; else noBudgets">
              <div class="mb-3" *ngFor="let category of dashboardData.charts.budgetsByCategory">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span>{{ category.category }}</span>
                  <span class="fw-bold">{{ category.amount | currency:'EUR':'symbol':'1.2-2':'fr' }}</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-success" 
                       [style.width.%]="category.percentage"
                       [attr.aria-valuenow]="category.percentage">
                  </div>
                </div>
                <small class="text-muted">{{ category.percentage }}% ({{ category.count }} budget(s))</small>
              </div>
            </div>
            <ng-template #noBudgets>
              <p class="text-muted text-center">Aucun budget enregistré</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================
         SECTION ACTIVITÉS RÉCENTES
         ======================================== -->
    
    <div class="row" *ngIf="dashboardData">
      
      <!-- DÉPENSES RÉCENTES -->
      <div class="col-md-6 mb-3">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-clock me-2"></i>Dépenses Récentes
            </h5>
          </div>
          <div class="card-body">
            <div *ngIf="dashboardData.recent.expenses.length > 0; else noRecentExpenses">
              <div class="list-group list-group-flush">
                <div class="list-group-item d-flex justify-content-between align-items-center px-0" 
                     *ngFor="let expense of dashboardData.recent.expenses">
                  <div>
                    <h6 class="mb-1">{{ expense.titre }}</h6>
                    <!-- | date = pipe pour formater les dates -->
                    <small class="text-muted">{{ expense.categorie }} • {{ expense.date | date:'short':'fr' }}</small>
                  </div>
                  <span class="badge bg-danger rounded-pill">
                    {{ expense.montant | currency:'EUR':'symbol':'1.2-2':'fr' }}
                  </span>
                </div>
              </div>
            </div>
            <ng-template #noRecentExpenses>
              <p class="text-muted text-center">Aucune dépense récente</p>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- BUDGETS RÉCENTS -->
      <div class="col-md-6 mb-3">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-clock me-2"></i>Budgets Récents
            </h5>
          </div>
          <div class="card-body">
            <div *ngIf="dashboardData.recent.budgets.length > 0; else noRecentBudgets">
              <div class="list-group list-group-flush">
                <div class="list-group-item d-flex justify-content-between align-items-center px-0" 
                     *ngFor="let budget of dashboardData.recent.budgets">
                  <div>
                    <h6 class="mb-1">{{ budget.titre }}</h6>
                    <small class="text-muted">{{ budget.categorie }} • {{ budget.date | date:'short':'fr' }}</small>
                  </div>
                  <span class="badge bg-success rounded-pill">
                    {{ budget.montant | currency:'EUR':'symbol':'1.2-2':'fr' }}
                  </span>
                </div>
              </div>
            </div>
            <ng-template #noRecentBudgets>
              <p class="text-muted text-center">Aucun budget récent</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================
         ÉTATS DE CHARGEMENT ET D'ERREUR
         ======================================== -->
    
    <!-- Spinner de chargement -->
    <div class="text-center" *ngIf="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div class="alert alert-danger" *ngIf="error">
      <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
    </div>
  `,
  styles: [`
    /* ========================================
       STYLES CSS PERSONNALISÉS
       ======================================== */
    
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      transition: box-shadow 0.15s ease-in-out;
    }
    
    .card:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .progress {
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    .list-group-item {
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .list-group-item:last-child {
      border-bottom: none;
    }
  `]
})

// ========================================
// CLASSE DU COMPOSANT
// ========================================

export class DashboardComponent implements OnInit {
  
  // ========================================
  // PROPRIÉTÉS DE LA CLASSE
  // ========================================
  
  // Données du tableau de bord (null au début)
  dashboardData: DashboardData | null = null;
  
  // État de chargement
  loading = false;
  
  // Message d'erreur (null si pas d'erreur)
  error: string | null = null;

  // ========================================
  // CONSTRUCTEUR - INJECTION DE DÉPENDANCES
  // ========================================
  
  constructor(private dashboardService: DashboardService) {
    // DashboardService est injecté automatiquement par Angular
  }

  // ========================================
  // MÉTHODE NGONIT - APPELÉE AU DÉMARRAGE
  // ========================================
  
  /**
   * Méthode appelée automatiquement après la création du composant
   * C'est ici qu'on charge les données initiales
   */
  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ========================================
  // MÉTHODE DE CHARGEMENT DES DONNÉES
  // ========================================
  
  /**
   * Charge les données du tableau de bord depuis l'API
   */
  loadDashboardData(): void {
    // 1. On active l'état de chargement
    this.loading = true;
    this.error = null;

    // 2. On appelle le service pour récupérer les données
    this.dashboardService.getDashboardData().subscribe({
      
      // ========================================
      // CAS DE SUCCÈS
      // ========================================
      next: (response) => {
        // Si la requête réussit, on stocke les données
        this.dashboardData = response.data;
        this.loading = false;
        
        console.log('Données du dashboard chargées:', this.dashboardData);
      },
      
      // ========================================
      // CAS D'ERREUR
      // ========================================
      error: (error) => {
        // Si la requête échoue, on affiche l'erreur
        this.error = error;
        this.loading = false;
        
        console.error('Erreur lors du chargement du dashboard:', error);
      }
    });
  }
}

/*
EXPLICATION DES CONCEPTS ANGULAR UTILISÉS :

1. INTERPOLATION {{ }}
   - {{ dashboardData.summary.totalBudget }} affiche la valeur de la propriété
   - Mise à jour automatique quand la valeur change

2. DIRECTIVES STRUCTURELLES
   - *ngIf : affiche/cache un élément selon une condition
   - *ngFor : répète un élément pour chaque item d'un tableau
   - *ngIf="condition; else template" : condition avec alternative

3. PROPERTY BINDING [ ]
   - [ngClass] : applique des classes CSS conditionnellement
   - [style.width.%] : définit un style CSS dynamiquement
   - [attr.aria-valuenow] : définit un attribut HTML dynamiquement

4. PIPES |
   - | currency : formate un nombre en devise
   - | date : formate une date
   - Transformation des données pour l'affichage

5. OBSERVABLES ET SUBSCRIBE
   - Observable = flux de données asynchrone
   - subscribe() = s'abonner aux données
   - next: fonction appelée quand les données arrivent
   - error: fonction appelée en cas d'erreur

6. LIFECYCLE HOOKS
   - ngOnInit() : appelée après la création du composant
   - Parfait pour charger les données initiales

FLUX DE DONNÉES :
1. Composant créé → ngOnInit() appelée
2. loadDashboardData() → appel au service
3. Service → appel à l'API backend
4. Backend → calculs et réponse
5. Service → réception des données
6. Composant → mise à jour de dashboardData
7. Template → affichage automatique des nouvelles données

GESTION DES ÉTATS :
- loading = true : affiche le spinner
- error = "message" : affiche l'erreur
- dashboardData = données : affiche le contenu
*/