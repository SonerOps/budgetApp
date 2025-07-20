export interface Expense {
  _id?: string;
  titre: string;
  montant: number;
  categorie: 'Alimentation' | 'Transport' | 'Divertissement' | 'Santé' | 'Logement' | 'Éducation' | 'Autres';
  date: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpenseResponse {
  success: boolean;
  message?: string;
  data?: Expense | Expense[];
  count?: number;
  error?: string;
}