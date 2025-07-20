/**
 * Expense Model - Modèle de données pour les dépenses
 * 
 * POUR DÉBUTANTS :
 * Ce fichier définit la STRUCTURE des dépenses dans notre base de données.
 * C'est identique au modèle Budget, mais pour les dépenses.
 * 
 * Une dépense = argent qu'on a dépensé (sortie d'argent)
 * Un budget = argent qu'on prévoit de dépenser (limite qu'on se fixe)
 * 
 * @author Otmanelaissi@gmail.com
 */

// Importation de Mongoose pour travailler avec MongoDB
const mongoose = require('mongoose');

// ========================================
// DÉFINITION DU SCHÉMA (Structure des données)
// ========================================

const expenseSchema = new mongoose.Schema({
  
  // ========================================
  // TITRE DE LA DÉPENSE
  // ========================================
  titre: {
    type: String,                    // Type de donnée : texte
    required: [true, 'Le titre est requis'],  // Obligatoire
    trim: true,                      // Supprime les espaces au début et à la fin
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']  // Limite de caractères
    // Exemple : "Courses au supermarché", "Essence voiture", "Cinéma"
  },

  // ========================================
  // MONTANT DE LA DÉPENSE
  // ========================================
  montant: {
    type: Number,                    // Type de donnée : nombre
    required: [true, 'Le montant est requis'],  // Obligatoire
    min: [0, 'Le montant doit être positif']    // Doit être positif
    // Exemple : 45.50, 12.00, 150.75
  },

  // ========================================
  // CATÉGORIE DE LA DÉPENSE
  // ========================================
  categorie: {
    type: String,                    // Type de donnée : texte
    required: [true, 'La catégorie est requise'],  // Obligatoire
    // Liste des catégories autorisées (identique aux budgets pour pouvoir les comparer)
    enum: ['Alimentation', 'Transport', 'Divertissement', 'Santé', 'Logement', 'Éducation', 'Autres'],
    default: 'Autres'                // Valeur par défaut
  },

  // ========================================
  // DATE DE LA DÉPENSE
  // ========================================
  date: {
    type: Date,                      // Type de donnée : date
    required: [true, 'La date est requise'],  // Obligatoire
    default: Date.now                // Par défaut = date actuelle (quand on crée la dépense)
  },

  // ========================================
  // NOTES OPTIONNELLES
  // ========================================
  notes: {
    type: String,                    // Type de donnée : texte
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],  // Limite de caractères
    trim: true                       // Supprime les espaces au début et à la fin
    // Exemple : "Courses hebdomadaires", "Plein d'essence", "Sortie cinéma en famille"
  }

}, {
  // ========================================
  // OPTIONS DU SCHÉMA
  // ========================================
  timestamps: true  // Ajoute automatiquement createdAt (date de création) et updatedAt (date de modification)
});

// ========================================
// INDEX POUR AMÉLIORER LES PERFORMANCES
// ========================================

// Index sur catégorie et date pour accélérer les recherches
// Très utile pour :
// - Afficher toutes les dépenses d'alimentation
// - Afficher les dépenses du mois dernier
// - Créer des statistiques par catégorie
expenseSchema.index({ categorie: 1, date: -1 });

// ========================================
// EXPORTATION DU MODÈLE
// ========================================

// On crée le modèle "Expense" basé sur notre schéma
// Ce modèle nous permettra de :
// - Créer de nouvelles dépenses : new Expense({...})
// - Chercher des dépenses : Expense.find()
// - Modifier des dépenses : Expense.findByIdAndUpdate()
// - Supprimer des dépenses : Expense.findByIdAndDelete()
// - Calculer le total des dépenses : Expense.aggregate()

module.exports = mongoose.model('Expense', expenseSchema);

/*
EXEMPLE D'UTILISATION DE CE MODÈLE :

// Créer une nouvelle dépense
const nouvelleDépense = new Expense({
  titre: "Courses Carrefour",
  montant: 67.50,
  categorie: "Alimentation",
  date: new Date(),
  notes: "Courses de la semaine"
});

// Sauvegarder en base de données
nouvelleDépense.save();

// Chercher toutes les dépenses
Expense.find();

// Chercher les dépenses d'alimentation
Expense.find({ categorie: "Alimentation" });

// Calculer le total des dépenses
Expense.aggregate([
  { $group: { _id: null, total: { $sum: "$montant" } } }
]);
*/