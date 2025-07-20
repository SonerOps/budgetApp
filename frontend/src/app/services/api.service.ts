/**
 * API Service - Service générique pour les appels HTTP
 * 
 * POUR DÉBUTANTS :
 * Ce service est le "pont" entre notre frontend Angular et notre backend Express.
 * Il contient les méthodes génériques pour faire des appels HTTP :
 * - GET pour récupérer des données
 * - POST pour créer des données
 * - PUT pour modifier des données
 * - DELETE pour supprimer des données
 * 
 * Injectable = ce service peut être injecté dans d'autres composants/services
 * HttpClient = outil Angular pour faire des requêtes HTTP
 * Observable = flux de données asynchrone (comme une Promise améliorée)
 * 
 * @author Otmanelaissi@gmail.com
 */

// ========================================
// IMPORTATIONS NÉCESSAIRES
// ========================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ========================================
// DÉCLARATION DU SERVICE
// ========================================

@Injectable({
  providedIn: 'root'  // Ce service est disponible dans toute l'application
})
export class ApiService {
  
  // URL de base de notre API backend (ex: http://localhost:3000/api)
  private apiUrl = environment.apiUrl;

  // ========================================
  // CONSTRUCTEUR - INJECTION DE DÉPENDANCES
  // ========================================
  
  constructor(private http: HttpClient) {
    // HttpClient est injecté automatiquement par Angular
    // Il nous permet de faire des requêtes HTTP
  }

  // ========================================
  // MÉTHODE GET - RÉCUPÉRER DES DONNÉES
  // ========================================
  
  /**
   * Effectue une requête GET
   * @param endpoint - Chemin de l'endpoint (ex: '/budgets', '/expenses')
   * @returns Observable avec les données récupérées
   */
  get<T>(endpoint: string): Observable<T> {
    // Exemple : get<Budget[]>('/budgets') → GET http://localhost:3000/api/budgets
    return this.http.get<T>(`${this.apiUrl}${endpoint}`)
      .pipe(
        // pipe() permet d'appliquer des opérateurs à l'Observable
        catchError(this.handleError)  // En cas d'erreur, on appelle handleError
      );
  }

  // ========================================
  // MÉTHODE POST - CRÉER DES DONNÉES
  // ========================================
  
  /**
   * Effectue une requête POST
   * @param endpoint - Chemin de l'endpoint
   * @param data - Données à envoyer dans le body de la requête
   * @returns Observable avec la réponse du serveur
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    // Exemple : post('/budgets', budgetData) → POST http://localhost:3000/api/budgets
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ========================================
  // MÉTHODE PUT - MODIFIER DES DONNÉES
  // ========================================
  
  /**
   * Effectue une requête PUT
   * @param endpoint - Chemin de l'endpoint (ex: '/budgets/123')
   * @param data - Nouvelles données
   * @returns Observable avec la réponse du serveur
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    // Exemple : put('/budgets/123', newData) → PUT http://localhost:3000/api/budgets/123
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ========================================
  // MÉTHODE DELETE - SUPPRIMER DES DONNÉES
  // ========================================
  
  /**
   * Effectue une requête DELETE
   * @param endpoint - Chemin de l'endpoint (ex: '/budgets/123')
   * @returns Observable avec la réponse du serveur
   */
  delete<T>(endpoint: string): Observable<T> {
    // Exemple : delete('/budgets/123') → DELETE http://localhost:3000/api/budgets/123
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ========================================
  // GESTION DES ERREURS
  // ========================================
  
  /**
   * Gère les erreurs HTTP et les transforme en messages compréhensibles
   * @param error - Erreur HTTP reçue
   * @returns Observable d'erreur avec un message lisible
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue s\'est produite';
    
    if (error.error instanceof ErrorEvent) {
      // ========================================
      // ERREUR CÔTÉ CLIENT (réseau, etc.)
      // ========================================
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // ========================================
      // ERREUR CÔTÉ SERVEUR (400, 500, etc.)
      // ========================================
      // On essaie de récupérer le message d'erreur du serveur
      errorMessage = error.error?.message || `Erreur ${error.status}: ${error.message}`;
    }
    
    // On affiche l'erreur dans la console pour le développeur
    console.error('Erreur API:', errorMessage);
    
    // On renvoie l'erreur pour que le composant puisse la gérer
    return throwError(() => errorMessage);
  }
}

/*
EXEMPLES D'UTILISATION DE CE SERVICE :

// 1. Dans un autre service (ex: BudgetService)
constructor(private apiService: ApiService) {}

// Récupérer tous les budgets
getAllBudgets() {
  return this.apiService.get<BudgetResponse>('/budgets');
}

// Créer un budget
createBudget(budget: Budget) {
  return this.apiService.post<BudgetResponse>('/budgets', budget);
}

// 2. Dans un composant
ngOnInit() {
  this.apiService.get<Budget[]>('/budgets').subscribe({
    next: (budgets) => {
      console.log('Budgets reçus:', budgets);
      this.budgets = budgets;
    },
    error: (error) => {
      console.error('Erreur:', error);
      this.errorMessage = error;
    }
  });
}

AVANTAGES DE CE SERVICE :
- Centralise toute la logique HTTP
- Gestion d'erreurs unifiée
- Code réutilisable
- Facile à tester et maintenir
- URL de base configurée une seule fois

TYPES D'ERREURS GÉRÉES :
- 400 Bad Request (données invalides)
- 401 Unauthorized (non autorisé)
- 404 Not Found (ressource non trouvée)
- 500 Internal Server Error (erreur serveur)
- Erreurs réseau (pas de connexion)
*/