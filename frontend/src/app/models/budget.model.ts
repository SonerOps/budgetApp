/**
 * Budget Model - Interface TypeScript pour les budgets
 * 
 * POUR DÉBUTANTS :
 * Ce fichier définit la STRUCTURE des budgets côté frontend.
 * Une interface TypeScript = un "contrat" qui dit :
 * "Un budget doit avoir ces propriétés avec ces types"
 * 
 * TypeScript = JavaScript avec des types (string, number, Date, etc.)
 * Interface = définition de la forme d'un objet
 * 
 * @author Otmanelaissi@gmail.com
 */

// ========================================
// INTERFACE PRINCIPALE : BUDGET
// ========================================

export interface Budget {
  // ========================================
  // PROPRIÉTÉS OPTIONNELLES (peuvent être absentes)
  // ========================================
  
  _id?: string;          // ID MongoDB (optionnel car absent lors de la création)
  createdAt?: Date;      // Date de création (ajoutée automatiquement par MongoDB)
  updatedAt?: Date;      // Date de dernière modification (ajoutée automatiquement)

  // ========================================
  // PROPRIÉTÉS OBLIGATOIRES
  // ========================================
  
  titre: string;         // Titre du budget (ex: "Budget courses mensuel")
  montant: number;       // Montant en euros (ex: 400.50)
  date: Date;           // Date du budget
  
  // ========================================
  // CATÉGORIE AVEC TYPES STRICTS
  // ========================================
  
  // Union type = la catégorie ne peut être QUE l'une de ces valeurs
  categorie: 'Alimentation' | 'Transport' | 'Divertissement' | 'Santé' | 'Logement' | 'Éducation' | 'Autres';
  
  // ========================================
  // PROPRIÉTÉ OPTIONNELLE
  // ========================================
  
  notes?: string;        // Notes optionnelles (le ? signifie optionnel)
}

// ========================================
// INTERFACE POUR LES RÉPONSES DE L'API
// ========================================

export interface BudgetResponse {
  success: boolean;      // Indique si l'opération a réussi
  message?: string;      // Message d'information (optionnel)
  error?: string;        // Message d'erreur (optionnel)
  count?: number;        // Nombre de budgets (pour les listes)
  
  // data peut être soit un budget unique, soit un tableau de budgets
  data?: Budget | Budget[];
}

/*
EXEMPLES D'UTILISATION :

// 1. Créer un objet budget
const monBudget: Budget = {
  titre: "Budget courses",
  montant: 400,
  categorie: "Alimentation",
  date: new Date(),
  notes: "Budget mensuel pour les courses"
};

// 2. Fonction qui accepte un budget
function afficherBudget(budget: Budget): void {
  console.log(`${budget.titre}: ${budget.montant}€`);
}

// 3. Réponse de l'API
const reponse: BudgetResponse = {
  success: true,
  message: "Budget créé avec succès",
  data: monBudget
};

// 4. Liste de budgets
const listeBudgets: Budget[] = [
  { titre: "Budget 1", montant: 100, categorie: "Alimentation", date: new Date() },
  { titre: "Budget 2", montant: 200, categorie: "Transport", date: new Date() }
];

AVANTAGES DE TYPESCRIPT :
- Détection d'erreurs à l'écriture du code
- Autocomplétion dans l'éditeur
- Documentation automatique
- Refactoring sécurisé

ERREURS DÉTECTÉES PAR TYPESCRIPT :
// ❌ Erreur : propriété manquante
const budgetInvalide: Budget = {
  titre: "Test"
  // Manque montant, categorie, date
};

// ❌ Erreur : mauvais type
const budgetInvalide2: Budget = {
  titre: "Test",
  montant: "400",  // String au lieu de number
  categorie: "Alimentation",
  date: new Date()
};

// ❌ Erreur : catégorie invalide
const budgetInvalide3: Budget = {
  titre: "Test",
  montant: 400,
  categorie: "Voyage",  // Pas dans la liste autorisée
  date: new Date()
};
*/