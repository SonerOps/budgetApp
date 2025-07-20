/**
 * Routes Expenses - Gestion des endpoints pour les dépenses
 * 
 * POUR DÉBUTANTS :
 * Ce fichier est IDENTIQUE aux routes des budgets, mais pour les dépenses.
 * Les dépenses représentent l'argent qu'on a VRAIMENT dépensé.
 * 
 * La logique est la même :
 * - GET pour récupérer (lire)
 * - POST pour créer
 * - PUT pour modifier
 * - DELETE pour supprimer
 * 
 * @author Otmanelaissi@gmail.com
 */

// ========================================
// IMPORTATION DES MODULES NÉCESSAIRES
// ========================================

const express = require('express');
const router = express.Router();

// Notre modèle Expense pour interagir avec la base de données
const Expense = require('../models/Expense');

// ========================================
// ROUTE 1 : RÉCUPÉRER TOUTES LES DÉPENSES
// ========================================

// GET /api/expenses
// Cette route renvoie la liste de toutes les dépenses
router.get('/', async (req, res) => {
  try {
    // On cherche toutes les dépenses et on les trie par date (plus récent en premier)
    // sort({ date: -1 }) = tri décroissant par date
    const expenses = await Expense.find().sort({ date: -1 });
    
    // Réponse de succès avec les données
    res.json({
      success: true,             // Indique que tout s'est bien passé
      count: expenses.length,    // Nombre total de dépenses
      data: expenses            // Tableau contenant toutes les dépenses
    });
  } catch (error) {
    // Si une erreur survient (problème de base de données, etc.)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des dépenses',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 2 : RÉCUPÉRER UNE DÉPENSE PAR SON ID
// ========================================

// GET /api/expenses/:id
// Exemple : GET /api/expenses/507f1f77bcf86cd799439011
router.get('/:id', async (req, res) => {
  try {
    // req.params.id contient l'ID de la dépense demandée
    const expense = await Expense.findById(req.params.id);
    
    // Si la dépense n'existe pas dans la base de données
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Dépense non trouvée'
      });
    }
    
    // Si la dépense existe, on la renvoie
    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    // Erreur (par exemple, format d'ID invalide)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la dépense',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 3 : CRÉER UNE NOUVELLE DÉPENSE
// ========================================

// POST /api/expenses
// Le frontend envoie les données de la nouvelle dépense
router.post('/', async (req, res) => {
  try {
    // req.body contient les données envoyées par le frontend
    // Exemple : { titre: "Courses Carrefour", montant: 67.50, categorie: "Alimentation" }
    const expense = new Expense(req.body);
    
    // On sauvegarde la dépense en base de données
    // save() déclenche aussi la validation (champs requis, format, etc.)
    const savedExpense = await expense.save();
    
    // Réponse de succès avec statut 201 (Created)
    res.status(201).json({
      success: true,
      message: 'Dépense créée avec succès',
      data: savedExpense
    });
  } catch (error) {
    // Erreur de validation (champs manquants, montant négatif, etc.)
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la dépense',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 4 : METTRE À JOUR UNE DÉPENSE
// ========================================

// PUT /api/expenses/:id
// Le frontend envoie les nouvelles données dans le body
router.put('/:id', async (req, res) => {
  try {
    // findByIdAndUpdate : trouve la dépense par ID et la met à jour
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,        // ID de la dépense à modifier
      req.body,            // Nouvelles données (titre, montant, etc.)
      { 
        new: true,         // Renvoie la dépense APRÈS modification (pas avant)
        runValidators: true // Vérifie que les nouvelles données respectent le schéma
      }
    );
    
    // Si la dépense n'existe pas
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Dépense non trouvée'
      });
    }
    
    // Succès : on renvoie la dépense modifiée
    res.json({
      success: true,
      message: 'Dépense mise à jour avec succès',
      data: expense
    });
  } catch (error) {
    // Erreur de validation ou autre problème
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la dépense',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 5 : SUPPRIMER UNE DÉPENSE
// ========================================

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    // findByIdAndDelete : trouve et supprime la dépense en une seule opération
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    // Si la dépense n'existe pas
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Dépense non trouvée'
      });
    }
    
    // Succès : dépense supprimée
    res.json({
      success: true,
      message: 'Dépense supprimée avec succès'
    });
  } catch (error) {
    // Erreur lors de la suppression
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la dépense',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 6 : RÉCUPÉRER DÉPENSES PAR CATÉGORIE
// ========================================

// GET /api/expenses/category/:category
// Exemple : /api/expenses/category/Alimentation
router.get('/category/:category', async (req, res) => {
  try {
    // On cherche toutes les dépenses de la catégorie demandée
    // { categorie: req.params.category } = filtre de recherche
    const expenses = await Expense.find({ categorie: req.params.category }).sort({ date: -1 });
    
    res.json({
      success: true,
      count: expenses.length,    // Nombre de dépenses dans cette catégorie
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des dépenses par catégorie',
      error: error.message
    });
  }
});

// ========================================
// EXPORTATION DU ROUTER
// ========================================

module.exports = router;

/*
RÉSUMÉ DES ROUTES DISPONIBLES :

1. GET /api/expenses → Liste toutes les dépenses
2. GET /api/expenses/:id → Récupère une dépense spécifique
3. POST /api/expenses → Crée une nouvelle dépense
4. PUT /api/expenses/:id → Modifie une dépense existante
5. DELETE /api/expenses/:id → Supprime une dépense
6. GET /api/expenses/category/:category → Dépenses d'une catégorie

DIFFÉRENCE AVEC LES BUDGETS :
- Budget = argent qu'on PRÉVOIT de dépenser (limite qu'on se fixe)
- Dépense = argent qu'on a VRAIMENT dépensé

EXEMPLE D'UTILISATION :
// Enregistrer une nouvelle dépense
fetch('http://localhost:3000/api/expenses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    titre: "Essence voiture",
    montant: 45.00,
    categorie: "Transport",
    notes: "Plein d'essence station Total"
  })
})
*/