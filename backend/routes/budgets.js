/**
 * Routes Budget - Gestion des endpoints pour les budgets
 * 
 * POUR DÉBUTANTS :
 * Ce fichier contient toutes les ROUTES (endpoints) pour gérer les budgets.
 * Une route = une URL que le frontend peut appeler pour faire une action.
 * 
 * CRUD = Create (Créer), Read (Lire), Update (Modifier), Delete (Supprimer)
 * 
 * Exemples de routes :
 * - GET /api/budgets → Récupérer tous les budgets
 * - POST /api/budgets → Créer un nouveau budget
 * - PUT /api/budgets/123 → Modifier le budget avec l'ID 123
 * - DELETE /api/budgets/123 → Supprimer le budget avec l'ID 123
 * 
 * @author Otmanelaissi@gmail.com
 */

// ========================================
// IMPORTATION DES MODULES NÉCESSAIRES
// ========================================

// Express Router : permet de créer des routes modulaires
const express = require('express');
const router = express.Router();

// Notre modèle Budget pour interagir avec la base de données
const Budget = require('../models/Budget');

// ========================================
// ROUTE 1 : RÉCUPÉRER TOUS LES BUDGETS
// ========================================

// GET /api/budgets
// Cette route renvoie la liste de tous les budgets
router.get('/', async (req, res) => {
  try {
    // On cherche tous les budgets et on les trie par date (plus récent en premier)
    const budgets = await Budget.find().sort({ date: -1 });
    
    // On renvoie une réponse de succès avec les données
    res.json({
      success: true,           // Indique que l'opération a réussi
      count: budgets.length,   // Nombre de budgets trouvés
      data: budgets           // Les budgets eux-mêmes
    });
  } catch (error) {
    // Si une erreur survient, on renvoie une réponse d'erreur
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des budgets',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 2 : RÉCUPÉRER UN BUDGET PAR SON ID
// ========================================

// GET /api/budgets/:id
// :id est un paramètre dynamique (exemple : /api/budgets/507f1f77bcf86cd799439011)
router.get('/:id', async (req, res) => {
  try {
    // req.params.id contient l'ID du budget demandé
    const budget = await Budget.findById(req.params.id);
    
    // Si le budget n'existe pas, on renvoie une erreur 404
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget non trouvé'
      });
    }
    
    // Si le budget existe, on le renvoie
    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    // Erreur (par exemple, ID invalide)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du budget',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 3 : CRÉER UN NOUVEAU BUDGET
// ========================================

// POST /api/budgets
// Le frontend envoie les données du nouveau budget dans le body de la requête
router.post('/', async (req, res) => {
  try {
    // req.body contient les données envoyées par le frontend
    // Exemple : { titre: "Budget courses", montant: 400, categorie: "Alimentation" }
    const budget = new Budget(req.body);
    
    // On sauvegarde le budget en base de données
    const savedBudget = await budget.save();
    
    // On renvoie le budget créé avec un statut 201 (Created)
    res.status(201).json({
      success: true,
      message: 'Budget créé avec succès',
      data: savedBudget
    });
  } catch (error) {
    // Erreur de validation (champs manquants, format incorrect, etc.)
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du budget',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 4 : METTRE À JOUR UN BUDGET
// ========================================

// PUT /api/budgets/:id
// Le frontend envoie les nouvelles données dans le body
router.put('/:id', async (req, res) => {
  try {
    // findByIdAndUpdate trouve le budget par ID et le met à jour
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,        // ID du budget à modifier
      req.body,            // Nouvelles données
      { 
        new: true,         // Renvoie le budget modifié (pas l'ancien)
        runValidators: true // Vérifie que les nouvelles données sont valides
      }
    );
    
    // Si le budget n'existe pas
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget non trouvé'
      });
    }
    
    // Succès : on renvoie le budget modifié
    res.json({
      success: true,
      message: 'Budget mis à jour avec succès',
      data: budget
    });
  } catch (error) {
    // Erreur de validation ou autre
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du budget',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 5 : SUPPRIMER UN BUDGET
// ========================================

// DELETE /api/budgets/:id
router.delete('/:id', async (req, res) => {
  try {
    // findByIdAndDelete trouve et supprime le budget
    const budget = await Budget.findByIdAndDelete(req.params.id);
    
    // Si le budget n'existe pas
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget non trouvé'
      });
    }
    
    // Succès : budget supprimé
    res.json({
      success: true,
      message: 'Budget supprimé avec succès'
    });
  } catch (error) {
    // Erreur lors de la suppression
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du budget',
      error: error.message
    });
  }
});

// ========================================
// ROUTE 6 : RÉCUPÉRER BUDGETS PAR CATÉGORIE
// ========================================

// GET /api/budgets/category/:category
// Exemple : /api/budgets/category/Alimentation
router.get('/category/:category', async (req, res) => {
  try {
    // On cherche tous les budgets de la catégorie demandée
    const budgets = await Budget.find({ categorie: req.params.category }).sort({ date: -1 });
    
    res.json({
      success: true,
      count: budgets.length,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des budgets par catégorie',
      error: error.message
    });
  }
});

// ========================================
// EXPORTATION DU ROUTER
// ========================================

// On exporte le router pour qu'il puisse être utilisé dans server.js
module.exports = router;

/*
RÉSUMÉ DES ROUTES DISPONIBLES :

1. GET /api/budgets → Liste tous les budgets
2. GET /api/budgets/:id → Récupère un budget spécifique
3. POST /api/budgets → Crée un nouveau budget
4. PUT /api/budgets/:id → Modifie un budget existant
5. DELETE /api/budgets/:id → Supprime un budget
6. GET /api/budgets/category/:category → Budgets d'une catégorie

EXEMPLE D'UTILISATION DEPUIS LE FRONTEND :

// Récupérer tous les budgets
fetch('http://localhost:3000/api/budgets')

// Créer un nouveau budget
fetch('http://localhost:3000/api/budgets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    titre: "Budget courses",
    montant: 400,
    categorie: "Alimentation"
  })
})
*/