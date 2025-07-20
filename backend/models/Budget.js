/**
 * Budget Model - Modèle de données pour les budgets
 * 
 * POUR DÉBUTANTS :
 * Ce fichier définit la STRUCTURE des budgets dans notre base de données.
 * C'est comme un "moule" qui dit : "Chaque budget doit avoir un titre, un montant, etc."
 * 
 * Mongoose = Outil qui facilite le travail avec MongoDB
 * Schema = Plan/structure de nos données
 * Model = Objet qui nous permet de créer, lire, modifier, supprimer des budgets
 * 
 * @author Otmanelaissi@gmail.com
 */

// Importation de Mongoose pour travailler avec MongoDB
const mongoose = require('mongoose');

// ========================================
// DÉFINITION DU SCHÉMA (Structure des données)
// ========================================

const budgetSchema = new mongoose.Schema({
  
  // ========================================
  // TITRE DU BUDGET
  // ========================================
  titre: {
    type: String,                    // Type de donnée : texte
    required: [true, 'Le titre est requis'],  // Obligatoire avec message d'erreur personnalisé
    trim: true,                      // Supprime les espaces au début et à la fin
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']  // Limite de caractères
  },

  // ========================================
  // MONTANT DU BUDGET
  // ========================================
  montant: {
    type: Number,                    // Type de donnée : nombre
    required: [true, 'Le montant est requis'],  // Obligatoire
    min: [0, 'Le montant doit être positif']    // Doit être positif (pas de montant négatif)
  },

  // ========================================
  // CATÉGORIE DU BUDGET
  // ========================================
  categorie: {
    type: String,                    // Type de donnée : texte
    required: [true, 'La catégorie est requise'],  // Obligatoire
    // enum = liste des valeurs autorisées (comme une liste déroulante)
    enum: ['Alimentation', 'Transport', 'Divertissement', 'Santé', 'Logement', 'Éducation', 'Autres'],
    default: 'Autres'                // Valeur par défaut si aucune catégorie n'est spécifiée
  },

  // ========================================
  // DATE DU BUDGET
  // ========================================
  date: {
    type: Date,                      // Type de donnée : date
    required: [true, 'La date est requise'],  // Obligatoire
    default: Date.now                // Par défaut = date actuelle
  },

  // ========================================
  // NOTES OPTIONNELLES
  // ========================================
  notes: {
    type: String,                    // Type de donnée : texte
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],  // Limite de caractères
    trim: true                       // Supprime les espaces au début et à la fin
    // Pas de "required" = ce champ est optionnel
  }

}, {
  // ========================================
  // OPTIONS DU SCHÉMA
  // ========================================
  timestamps: true  // Ajoute automatiquement createdAt et updatedAt à chaque budget
});

// ========================================
// INDEX POUR AMÉLIORER LES PERFORMANCES
// ========================================

// Index sur catégorie et date pour accélérer les recherches
// Quand on cherche des budgets par catégorie ou date, ça sera plus rapide
budgetSchema.index({ categorie: 1, date: -1 });

// ========================================
// EXPORTATION DU MODÈLE
// ========================================

// On crée le modèle "Budget" basé sur notre schéma
// Ce modèle nous permettra de :
// - Créer de nouveaux budgets : new Budget({...})
// - Chercher des budgets : Budget.find()
// - Modifier des budgets : Budget.findByIdAndUpdate()
// - Supprimer des budgets : Budget.findByIdAndDelete()

module.exports = mongoose.model('Budget', budgetSchema);

/*
EXEMPLE D'UTILISATION DE CE MODÈLE :

// Créer un nouveau budget
const nouveauBudget = new Budget({
  titre: "Budget courses mensuel",
  montant: 400,
  categorie: "Alimentation",
  date: new Date(),
  notes: "Budget pour les courses du mois"
});

// Sauvegarder en base de données
nouveauBudget.save();

// Chercher tous les budgets
Budget.find();

// Chercher les budgets d'alimentation
Budget.find({ categorie: "Alimentation" });
*/