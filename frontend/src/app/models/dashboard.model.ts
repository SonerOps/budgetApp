export interface DashboardSummary {
  totalBudget: number;
  totalExpenses: number;
  remainingBalance: number;
  budgetUtilization: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface RecentItem {
  _id: string;
  titre: string;
  montant: number;
  categorie: string;
  date: Date;
}

export interface DashboardData {
  summary: DashboardSummary;
  charts: {
    expensesByCategory: CategoryData[];
    budgetsByCategory: CategoryData[];
  };
  recent: {
    expenses: RecentItem[];
    budgets: RecentItem[];
  };
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
  error?: string;
}