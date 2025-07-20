/**
 * Budget Service - Service spécialisé pour la gestion des budgets
 * 
 * POUR DÉBUTANTS :
 * Ce service contient toutes les méthodes pour gérer les budgets.
 * Il utilise le ApiService générique pour faire les appels HTTP.
 * 
 * Séparation des responsabilités :
 * - ApiService = méthodes HTTP génériques (GET, POST, PUT, DELETE)
 * - BudgetService = méthodes spécifiques aux budgets
 * 
 * Les composants utilisent BudgetService, qui utilise ApiService,
 * qui utilise HttpClient pour communiquer avec le backend.
 * 
 * @author Otmanelaissi@gmail.com
 */

// ========================================
// IMPORTATIONS NÉCESSAIRES
// ========================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Budget, BudgetResponse } from '../models/budget.model';

// ========================================
// DÉCLARATION DU SERVICE
// ========================================

@Injectable({
  providedIn: 'root'  // Disponible dans toute l'application
})
export class BudgetService {
  
  // Endpoint de base pour les budgets
  private endpoint = '/budgets';

  // ========================================
  // CONSTRUCTEUR - INJECTION DE DÉPENDANCES
  // ========================================
  
  constructor(private apiService: ApiService) {
    // On injecte ApiService pour faire les appels HTTP
  }

  // ========================================
  // MÉTHODE 1 : RÉCUPÉRER TOUS LES BUDGETS
  // ========================================
  
  /**
   * Récupère la liste de tous les budgets
   * @returns Observable<BudgetResponse> contenant la liste des budgets
   */
  getAllBudgets(): Observable<BudgetResponse> {
    // Appel : GET /api/budgets
    return this.apiService.get<BudgetResponse>(this.endpoint);
  }

  // ========================================
  // MÉTHODE 2 : RÉCUPÉRER UN BUDGET PAR ID
  // ========================================
  
  /**
   * Récupère un budget spécifique par son ID
   * @param id - ID du budget à récupérer
   * @returns Observable<BudgetResponse> contenant le budget demandé
   */
  getBudgetById(id: string): Observable<BudgetResponse> {
    // Appel : GET /api/budgets/507f1f77bcf86cd799439011
    return this.apiService.get<BudgetResponse>(`${this.endpoint}/${id}`);
  }

  // ========================================
  // MÉTHODE 3 : CRÉER UN NOUVEAU BUDGET
  // ========================================
  
  /**
   * Crée un nouveau budget
   * @param budget - Données du budget à créer (sans _id, createdAt, updatedAt)
   * @returns Observable<BudgetResponse> contenant le budget créé
   */
  createBudget(budget: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>): Observable<BudgetResponse> {
    // Omit<Budget, '_id' | 'createdAt' | 'updatedAt'> = Budget sans ces propriétés
    // Car ces propriétés sont générées automatiquement par MongoDB
    
    // Appel : POST /api/budgets avec les données du budget
    return this.apiService.post<BudgetResponse>(this.endpoint, budget);
  }

  // ========================================
  // MÉTHODE 4 : METTRE À JOUR UN BUDGET
  // ========================================
  
  /**
   * Met à jour un budget existant
   * @param id - ID du budget à modifier
   * @param budget - Nouvelles données (peuvent être partielles)
   * @returns Observable<BudgetResponse> contenant le budget modifié
   */
  updateBudget(id: string, budget: Partial<Budget>): Observable<BudgetResponse> {
    // Partial<Budget> = toutes les propriétés de Budget sont optionnelles
    // On peut modifier seulement le titre, ou seulement le montant, etc.
    
    // Appel : PUT /api/budgets/507f1f77bcf86cd799439011
    return this.apiService.put<BudgetResponse>(`${this.endpoint}/${id}`, budget);
  }

  // ========================================
  // MÉTHODE 5 : SUPPRIMER UN BUDGET
  // ========================================
  
  /**
   * Supprime un budget
   * @param id - ID du budget à supprimer
   * @returns Observable<BudgetResponse> confirmant la suppression
   */
  deleteBudget(id: string): Observable<BudgetResponse> {
    // Appel : DELETE /api/budgets/507f1f77bcf86cd799439011
    return this.apiService.delete<BudgetResponse>(`${this.endpoint}/${id}`);
  }

  // ========================================
  // MÉTHODE 6 : RÉCUPÉRER BUDGETS PAR CATÉGORIE
  // ========================================
  
  /**
   * Récupère tous les budgets d'une catégorie spécifique
   * @param category - Nom de la catégorie
   * @returns Observable<BudgetResponse> contenant les budgets de la catégorie
   */
  getBudgetsByCategory(category: string): Observable<BudgetResponse> {
    // Appel : GET /api/budgets/category/Alimentation
    return this.apiService.get<BudgetResponse>(`${this.endpoint}/category/${category}`);
  }
}

/*
EXEMPLES D'UTILISATION DANS UN COMPOSANT :

// 1. Injection du service dans le constructeur
constructor(private budgetService: BudgetService) {}

// 2. Récupérer tous les budgets
ngOnInit() {
  this.budgetService.getAllBudgets().subscribe({
    next: (response) => {
      if (response.success && Array.isArray(response.data)) {
        this.budgets = response.data;
        console.log('Budgets chargés:', this.budgets);
      }
    },
    error: (error) => {
      console.error('Erreur lors du chargement:', error);
      this.errorMessage = error;
    }
  });
}

// 3. Créer un nouveau budget
createNewBudget() {
  const newBudget = {
    titre: "Budget courses",
    montant: 400,
    categorie: "Alimentation" as const,
    date: new Date(),
    notes: "Budget mensuel"
  };

  this.budgetService.createBudget(newBudget).subscribe({
    next: (response) => {
      if (response.success) {
        console.log('Budget créé:', response.data);
        this.loadBudgets(); // Recharger la liste
      }
    },
    error: (error) => {
      console.error('Erreur création:', error);
    }
  });
}

// 4. Modifier un budget
updateBudget(id: string) {
  const updates = {
    montant: 500,
    notes: "Budget augmenté"
  };

  this.budgetService.updateBudget(id, updates).subscribe({
    next: (response) => {
      if (response.success) {
        console.log('Budget modifié:', response.data);
      }
    },
    error: (error) => {
      console.error('Erreur modification:', error);
    }
  });
}

// 5. Supprimer un budget
deleteBudget(id: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
    this.budgetService.deleteBudget(id).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Budget supprimé');
          this.loadBudgets(); // Recharger la liste
        }
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
      }
    });
  }
}

AVANTAGES DE CE SERVICE :
- Encapsule toute la logique liée aux budgets
- Interface claire et typée
- Réutilisable dans plusieurs composants
- Facilite les tests unitaires
- Sépare la logique métier de l'affichage

TYPES UTILISÉS :
- Observable<BudgetResponse> : flux asynchrone de réponses
- Omit<Budget, 'propriétés'> : Budget sans certaines propriétés
- Partial<Budget> : Budget avec toutes propriétés optionnelles
*/