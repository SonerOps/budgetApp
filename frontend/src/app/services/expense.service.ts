import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Expense, ExpenseResponse } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private endpoint = '/expenses';

  constructor(private apiService: ApiService) {}

  // Récupérer toutes les dépenses
  getAllExpenses(): Observable<ExpenseResponse> {
    return this.apiService.get<ExpenseResponse>(this.endpoint);
  }

  // Récupérer une dépense par ID
  getExpenseById(id: string): Observable<ExpenseResponse> {
    return this.apiService.get<ExpenseResponse>(`${this.endpoint}/${id}`);
  }

  // Créer une nouvelle dépense
  createExpense(expense: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>): Observable<ExpenseResponse> {
    return this.apiService.post<ExpenseResponse>(this.endpoint, expense);
  }

  // Mettre à jour une dépense
  updateExpense(id: string, expense: Partial<Expense>): Observable<ExpenseResponse> {
    return this.apiService.put<ExpenseResponse>(`${this.endpoint}/${id}`, expense);
  }

  // Supprimer une dépense
  deleteExpense(id: string): Observable<ExpenseResponse> {
    return this.apiService.delete<ExpenseResponse>(`${this.endpoint}/${id}`);
  }

  // Récupérer dépenses par catégorie
  getExpensesByCategory(category: string): Observable<ExpenseResponse> {
    return this.apiService.get<ExpenseResponse>(`${this.endpoint}/category/${category}`);
  }
}