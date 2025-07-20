import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private endpoint = '/dashboard';

  constructor(private apiService: ApiService) {}

  // Récupérer les données du tableau de bord
  getDashboardData(): Observable<DashboardResponse> {
    return this.apiService.get<DashboardResponse>(this.endpoint);
  }

  // Récupérer les statistiques par période
  getStatsByPeriod(period: 'week' | 'month' | 'year'): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/stats/${period}`);
  }
}