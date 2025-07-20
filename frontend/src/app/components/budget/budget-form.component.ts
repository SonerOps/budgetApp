/**
 * Budget Form Component - Formulaire pour créer/modifier des budgets
 * 
 * POUR DÉBUTANTS :
 * Ce composant gère le FORMULAIRE de création et modification des budgets.
 * Il utilise les "Reactive Forms" d'Angular pour :
 * - Valider les données saisies (champs obligatoires, formats, etc.)
 * - Gérer les erreurs de saisie
 * - Soumettre les données à l'API backend
 * 
 * CONCEPTS CLÉS :
 * - FormBuilder = outil Angular pour créer des formulaires facilement
 * - FormGroup = groupe de contrôles de formulaire (titre, montant, etc.)
 * - Validators = règles de validation (requis, longueur min/max, etc.)
 * - Router = navigation entre les pages
 * - ActivatedRoute = informations sur la route actuelle (paramètres, etc.)
 * 
 * @author Otmanelaissi@gmail.com
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { Budget } from '../../models/budget.model';

@Component({
  selector: 'app-budget-form',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">
              <i class="fas fa-piggy-bank me-2"></i>
              {{ isEditMode ? 'Modifier le Budget' : 'Nouveau Budget' }}
            </h3>
          </div>
          <div class="card-body">
            <form [formGroup]="budgetForm" (ngSubmit)="onSubmit()">
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
                  [class.is-invalid]="budgetForm.get('titre')?.invalid && budgetForm.get('titre')?.touched"
                  placeholder="Ex: Budget alimentation mensuel"
                >
                <div class="invalid-feedback" *ngIf="budgetForm.get('titre')?.invalid && budgetForm.get('titre')?.touched">
                  <div *ngIf="budgetForm.get('titre')?.errors?.['required']">
                    Le titre est requis
                  </div>
                  <div *ngIf="budgetForm.get('titre')?.errors?.['maxlength']">
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
                    [class.is-invalid]="budgetForm.get('montant')?.invalid && budgetForm.get('montant')?.touched"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  >
                  <span class="input-group-text">€</span>
                </div>
                <div class="invalid-feedback" *ngIf="budgetForm.get('montant')?.invalid && budgetForm.get('montant')?.touched">
                  <div *ngIf="budgetForm.get('montant')?.errors?.['required']">
                    Le montant est requis
                  </div>
                  <div *ngIf="budgetForm.get('montant')?.errors?.['min']">
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
                  [class.is-invalid]="budgetForm.get('categorie')?.invalid && budgetForm.get('categorie')?.touched"
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
                <div class="invalid-feedback" *ngIf="budgetForm.get('categorie')?.invalid && budgetForm.get('categorie')?.touched">
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
                  [class.is-invalid]="budgetForm.get('date')?.invalid && budgetForm.get('date')?.touched"
                >
                <div class="invalid-feedback" *ngIf="budgetForm.get('date')?.invalid && budgetForm.get('date')?.touched">
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
                  [class.is-invalid]="budgetForm.get('notes')?.invalid && budgetForm.get('notes')?.touched"
                ></textarea>
                <div class="invalid-feedback" *ngIf="budgetForm.get('notes')?.invalid && budgetForm.get('notes')?.touched">
                  <div *ngIf="budgetForm.get('notes')?.errors?.['maxlength']">
                    Les notes ne peuvent pas dépasser 500 caractères
                  </div>
                </div>
                <div class="form-text">
                  {{ budgetForm.get('notes')?.value?.length || 0 }}/500 caractères
                </div>
              </div>

              <!-- Boutons -->
              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary flex-fill"
                  [disabled]="budgetForm.invalid || loading"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="fas fa-save me-2"></i>
                  {{ isEditMode ? 'Mettre à jour' : 'Créer le Budget' }}
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
export class BudgetFormComponent implements OnInit {
  
  // ========================================
  // PROPRIÉTÉS DE LA CLASSE
  // ========================================
  
  // FormGroup = objet qui contient tous les contrôles du formulaire
  budgetForm: FormGroup;
  
  // Mode d'édition : true = modification, false = création
  isEditMode = false;
  
  // ID du budget à modifier (null si création)
  budgetId: string | null = null;
  
  // État de chargement (pour afficher un spinner)
  loading = false;
  
  // Message d'erreur (null si pas d'erreur)
  error: string | null = null;
  
  // Message de succès (null si pas de succès)
  successMessage: string | null = null;

  // ========================================
  // CONSTRUCTEUR - INJECTION DE DÉPENDANCES
  // ========================================
  
  constructor(
    private fb: FormBuilder,           // Pour créer le formulaire
    private budgetService: BudgetService,  // Pour communiquer avec l'API
    private router: Router,            // Pour naviguer entre les pages
    private route: ActivatedRoute      // Pour récupérer les paramètres de l'URL
  ) {
    // On crée le formulaire dès la construction du composant
    this.budgetForm = this.createForm();
  }

  // ========================================
  // MÉTHODE NGONIT - INITIALISATION
  // ========================================
  
  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL (ex: /budgets/edit/123)
    this.budgetId = this.route.snapshot.paramMap.get('id');
    
    // Si on a un ID, c'est une modification, sinon c'est une création
    this.isEditMode = !!this.budgetId;  // !! convertit en boolean

    // Si on est en mode édition, charger les données du budget
    if (this.isEditMode && this.budgetId) {
      this.loadBudget(this.budgetId);
    }
  }

  // ========================================
  // CRÉATION DU FORMULAIRE
  // ========================================
  
  /**
   * Crée le FormGroup avec tous les contrôles et leurs validations
   * @returns FormGroup configuré
   */
  createForm(): FormGroup {
    return this.fb.group({
      // Contrôle pour le titre
      titre: ['', [
        Validators.required,           // Obligatoire
        Validators.maxLength(100)      // Maximum 100 caractères
      ]],
      
      // Contrôle pour le montant
      montant: ['', [
        Validators.required,           // Obligatoire
        Validators.min(0)             // Minimum 0 (pas de montant négatif)
      ]],
      
      // Contrôle pour la catégorie
      categorie: ['', Validators.required],  // Obligatoire
      
      // Contrôle pour la date (avec valeur par défaut = aujourd'hui)
      date: [this.formatDateForInput(new Date()), Validators.required],
      
      // Contrôle pour les notes (optionnel)
      notes: ['', Validators.maxLength(500)]  // Maximum 500 caractères
    });
  }

  // ========================================
  // CHARGEMENT D'UN BUDGET EXISTANT
  // ========================================
  
  /**
   * Charge les données d'un budget existant pour le modifier
   * @param id - ID du budget à charger
   */
  loadBudget(id: string): void {
    this.loading = true;
    this.error = null;

    this.budgetService.getBudgetById(id).subscribe({
      next: (response) => {
        if (response.success && response.data && !Array.isArray(response.data)) {
          const budget = response.data;
          
          // Remplir le formulaire avec les données existantes
          // patchValue() met à jour les valeurs sans affecter la validation
          this.budgetForm.patchValue({
            titre: budget.titre,
            montant: budget.montant,
            categorie: budget.categorie,
            date: this.formatDateForInput(new Date(budget.date)),
            notes: budget.notes || ''
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

  // ========================================
  // SOUMISSION DU FORMULAIRE
  // ========================================
  
  /**
   * Méthode appelée quand l'utilisateur soumet le formulaire
   */
  onSubmit(): void {
    // Vérifier si le formulaire est valide
    if (this.budgetForm.valid) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      // Préparer les données à envoyer
      const budgetData = {
        ...this.budgetForm.value,           // Récupérer toutes les valeurs du formulaire
        date: new Date(this.budgetForm.value.date)  // Convertir la date string en Date
      };

      // Choisir l'opération selon le mode (création ou modification)
      const operation = this.isEditMode && this.budgetId
        ? this.budgetService.updateBudget(this.budgetId, budgetData)  // Modification
        : this.budgetService.createBudget(budgetData);                // Création

      // Exécuter l'opération
      operation.subscribe({
        next: (response) => {
          if (response.success) {
            // Afficher un message de succès
            this.successMessage = this.isEditMode 
              ? 'Budget mis à jour avec succès !' 
              : 'Budget créé avec succès !';
            
            // Rediriger vers la liste des budgets après 1.5 secondes
            setTimeout(() => {
              this.router.navigate(['/budgets']);
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
      // Si le formulaire n'est pas valide, marquer tous les champs comme "touchés"
      // pour afficher les erreurs de validation
      this.markFormGroupTouched();
    }
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================
  
  /**
   * Annule la création/modification et retourne à la liste
   */
  cancel(): void {
    this.router.navigate(['/budgets']);
  }

  /**
   * Formate une date pour l'input HTML de type "date"
   * @param date - Date à formater
   * @returns String au format YYYY-MM-DD
   */
  private formatDateForInput(date: Date): string {
    // toISOString() retourne "2024-01-15T10:30:00.000Z"
    // split('T')[0] récupère seulement "2024-01-15"
    return date.toISOString().split('T')[0];
  }

  /**
   * Marque tous les contrôles du formulaire comme "touchés"
   * Cela déclenche l'affichage des erreurs de validation
   */
  private markFormGroupTouched(): void {
    // Object.keys() récupère tous les noms des contrôles
    Object.keys(this.budgetForm.controls).forEach(key => {
      const control = this.budgetForm.get(key);
      control?.markAsTouched();  // Marquer comme "touché"
    });
  }
}