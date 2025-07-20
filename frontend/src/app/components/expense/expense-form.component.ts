import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">
              <i class="fas fa-receipt me-2"></i>
              {{ isEditMode ? 'Modifier la Dépense' : 'Nouvelle Dépense' }}
            </h3>
          </div>
          <div class="card-body">
            <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
              <!-- Titre -->
              <div class="mb-3">
                <label for="titre" class="form-label">
                  Titre <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="titre"
                  class="form-control"
                  formControlName="titre"
                  [class.is-invalid]="expenseForm.get('titre')?.invalid && expenseForm.get('titre')?.touched"
                  placeholder="Ex: Courses au supermarché"
                >
                <div class="invalid-feedback" *ngIf="expenseForm.get('titre')?.invalid && expenseForm.get('titre')?.touched">
                  <div *ngIf="expenseForm.get('titre')?.errors?.['required']">
                    Le titre est requis
                  </div>
                  <div *ngIf="expenseForm.get('titre')?.errors?.['maxlength']">
                    Le titre ne peut pas dépasser 100 caractères
                  </div>
                </div>
              </div>

              <!-- Montant -->
              <div class="mb-3">
                <label for="montant" class="form-label">
                  Montant (€) <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <input
                    type="number"
                    id="montant"
                    class="form-control"
                    formControlName="montant"
                    [class.is-invalid]="expenseForm.get('montant')?.invalid && expenseForm.get('montant')?.touched"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  >
                  <span class="input-group-text">€</span>
                </div>
                <div class="invalid-feedback" *ngIf="expenseForm.get('montant')?.invalid && expenseForm.get('montant')?.touched">
                  <div *ngIf="expenseForm.get('montant')?.errors?.['required']">
                    Le montant est requis
                  </div>
                  <div *ngIf="expenseForm.get('montant')?.errors?.['min']">
                    Le montant doit être positif
                  </div>
                </div>
              </div>

              <!-- Catégorie -->
              <div class="mb-3">
                <label for="categorie" class="form-label">
                  Catégorie <span class="text-danger">*</span>
                </label>
                <select
                  id="categorie"
                  class="form-select"
                  formControlName="categorie"
                  [class.is-invalid]="expenseForm.get('categorie')?.invalid && expenseForm.get('categorie')?.touched"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Alimentation">🍽️ Alimentation</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Divertissement">🎬 Divertissement</option>
                  <option value="Santé">🏥 Santé</option>
                  <option value="Logement">🏠 Logement</option>
                  <option value="Éducation">📚 Éducation</option>
                  <option value="Autres">📦 Autres</option>
                </select>
                <div class="invalid-feedback" *ngIf="expenseForm.get('categorie')?.invalid && expenseForm.get('categorie')?.touched">
                  La catégorie est requise
                </div>
              </div>

              <!-- Date -->
              <div class="mb-3">
                <label for="date" class="form-label">
                  Date <span class="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  class="form-control"
                  formControlName="date"
                  [class.is-invalid]="expenseForm.get('date')?.invalid && expenseForm.get('date')?.touched"
                >
                <div class="invalid-feedback" *ngIf="expenseForm.get('date')?.invalid && expenseForm.get('date')?.touched">
                  La date est requise
                </div>
              </div>

              <!-- Notes -->
              <div class="mb-4">
                <label for="notes" class="form-label">Notes (optionnel)</label>
                <textarea
                  id="notes"
                  class="form-control"
                  formControlName="notes"
                  rows="3"
                  placeholder="Ajoutez des notes ou commentaires..."
                  [class.is-invalid]="expenseForm.get('notes')?.invalid && expenseForm.get('notes')?.touched"
                ></textarea>
                <div class="invalid-feedback" *ngIf="expenseForm.get('notes')?.invalid && expenseForm.get('notes')?.touched">
                  <div *ngIf="expenseForm.get('notes')?.errors?.['maxlength']">
                    Les notes ne peuvent pas dépasser 500 caractères
                  </div>
                </div>
                <div class="form-text">
                  {{ expenseForm.get('notes')?.value?.length || 0 }}/500 caractères
                </div>
              </div>

              <!-- Boutons -->
              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-danger flex-fill"
                  [disabled]="expenseForm.invalid || loading"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="fas fa-save me-2"></i>
                  {{ isEditMode ? 'Mettre à jour' : 'Enregistrer la Dépense' }}
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  (click)="cancel()"
                  [disabled]="loading"
                >
                  <i class="fas fa-times me-2"></i>Annuler
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Erreur -->
        <div class="alert alert-danger mt-3" *ngIf="error">
          <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <!-- Succès -->
        <div class="alert alert-success mt-3" *ngIf="successMessage">
          <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .form-label {
      font-weight: 600;
      color: #495057;
    }
    
    .input-group-text {
      background-color: #e9ecef;
      border-color: #ced4da;
    }
    
    .btn {
      border-radius: 0.375rem;
    }
    
    .form-text {
      font-size: 0.875rem;
    }
  `]
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  isEditMode = false;
  expenseId: string | null = null;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.expenseForm = this.createForm();
  }

  ngOnInit(): void {
    this.expenseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.expenseId;

    if (this.isEditMode && this.expenseId) {
      this.loadExpense(this.expenseId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(100)]],
      montant: ['', [Validators.required, Validators.min(0)]],
      categorie: ['', Validators.required],
      date: [this.formatDateForInput(new Date()), Validators.required],
      notes: ['', Validators.maxLength(500)]
    });
  }

  loadExpense(id: string): void {
    this.loading = true;
    this.error = null;

    this.expenseService.getExpenseById(id).subscribe({
      next: (response) => {
        if (response.success && response.data && !Array.isArray(response.data)) {
          const expense = response.data;
          this.expenseForm.patchValue({
            titre: expense.titre,
            montant: expense.montant,
            categorie: expense.categorie,
            date: this.formatDateForInput(new Date(expense.date)),
            notes: expense.notes || ''
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      const expenseData = {
        ...this.expenseForm.value,
        date: new Date(this.expenseForm.value.date)
      };

      const operation = this.isEditMode && this.expenseId
        ? this.expenseService.updateExpense(this.expenseId, expenseData)
        : this.expenseService.createExpense(expenseData);

      operation.subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = this.isEditMode 
              ? 'Dépense mise à jour avec succès !' 
              : 'Dépense enregistrée avec succès !';
            
            setTimeout(() => {
              this.router.navigate(['/expenses']);
            }, 1500);
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/expenses']);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private markFormGroupTouched(): void {
    Object.keys(this.expenseForm.controls).forEach(key => {
      const control = this.expenseForm.get(key);
      control?.markAsTouched();
    });
  }
}