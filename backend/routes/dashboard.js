/**
 * Routes Dashboard - Gestion des statistiques et données du tableau de bord
 * 
 * POUR DÉBUTANTS :
 * Ce fichier contient les routes pour le TABLEAU DE BORD.
 * Le tableau de bord affiche des STATISTIQUES et des RÉSUMÉS :
 * - Combien j'ai budgété au total ?
 * - Combien j'ai dépensé au total ?
 * - Combien me reste-t-il ?
 * - Répartition par catégorie
 * - Activités récentes
 * 
 * AGGREGATE = Fonction MongoDB pour faire des calculs complexes
 * (comme SUM, COUNT, GROUP BY en SQL)
 * 
 * @author Otmanelaissi@gmail.com
 */

// ========================================
// IMPORTATION DES MODULES NÉCESSAIRES
// ========================================

const express = require('express');
const router = express.Router();

// Nos modèles pour accéder aux données
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// ========================================
// ROUTE PRINCIPALE : DONNÉES DU TABLEAU DE BORD
// ========================================

// GET /api/dashboard
// Cette route calcule et renvoie TOUTES les statistiques du tableau de bord
router.get('/', async (req, res) => {
  try {
    
    // ========================================
    // 1. CALCUL DU MONTANT TOTAL DES BUDGETS
    // ========================================
    
    // aggregate() permet de faire des calculs sur plusieurs documents
    // $group regroupe tous les budgets et $sum additionne les montants
    const totalBudgetResult = await Budget.aggregate([
      {
        $group: {
          _id: null,                    // null = on groupe tout ensemble
          totalBudget: { $sum: '$montant' }  // On additionne tous les montants
        }
      }
    ]);
    
    // Si aucun budget n'existe, totalBudget = 0
    const totalBudget = totalBudgetResult.length > 0 ? totalBudgetResult[0].totalBudget : 0;

    // ========================================
    // 2. CALCUL DU TOTAL DES DÉPENSES
    // ========================================
    
    // Même principe que pour les budgets
    const totalExpensesResult = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$montant' }
        }
      }
    ]);
    
    const totalExpenses = totalExpensesResult.length > 0 ? totalExpensesResult[0].totalExpenses : 0;

    // ========================================
    // 3. CALCUL DU SOLDE RESTANT
    // ========================================
    
    // Solde = Budget total - Dépenses totales
    // Si positif = il reste de l'argent
    // Si négatif = on a dépassé le budget
    const remainingBalance = totalBudget - totalExpenses;

    // ========================================
    // 4. RÉPARTITION DES DÉPENSES PAR CATÉGORIE
    // ========================================
    
    // On groupe les dépenses par catégorie et on calcule le total de chaque catégorie
    const expensesByCategory = await Expense.aggregate([
      {
        $group: {
          _id: '$categorie',           // Grouper par catégorie
          total: { $sum: '$montant' }, // Total des montants pour cette catégorie
          count: { $sum: 1 }          // Nombre de dépenses dans cette catégorie
        }
      },
      {
        $sort: { total: -1 }         // Trier par total décroissant (plus gros montant en premier)
      }
    ]);

    // ========================================
    // 5. RÉPARTITION DES BUDGETS PAR CATÉGORIE
    // ========================================
    
    // Même principe pour les budgets
    const budgetsByCategory = await Budget.aggregate([
      {
        $group: {
          _id: '$categorie',
          total: { $sum: '$montant' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // ========================================
    // 6. DÉPENSES RÉCENTES (5 dernières)
    // ========================================
    
    // find() récupère les documents, sort() les trie, limit() limite le nombre
    const recentExpenses = await Expense.find()
      .sort({ date: -1 })           // Trier par date décroissante (plus récent en premier)
      .limit(5)                     // Prendre seulement les 5 premiers
      .select('titre montant categorie date');  // Sélectionner seulement ces champs

    // ========================================
    // 7. BUDGETS RÉCENTS (5 derniers)
    // ========================================
    
    const recentBudgets = await Budget.find()
      .sort({ date: -1 })
      .limit(5)
      .select('titre montant categorie date');

    // ========================================
    // 8. CONSTRUCTION DE LA RÉPONSE
    // ========================================
    
    res.json({
      success: true,
      data: {
        // Résumé général
        summary: {
          totalBudget,                // Montant total budgété
          totalExpenses,              // Montant total dépensé
          remainingBalance,           // Solde restant
          // Pourcentage d'utilisation du budget (dépenses / budget * 100)
          budgetUtilization: totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(2) : 0
        },
        
        // Données pour les graphiques
        charts: {
          // Dépenses par catégorie avec pourcentages
          expensesByCategory: expensesByCategory.map(item => ({
            category: item._id,
            amount: item.total,
            count: item.count,
            // Pourcentage de cette catégorie par rapport au total des dépenses
            percentage: totalExpenses > 0 ? ((item.total / totalExpenses) * 100).toFixed(2) : 0
          })),
          
          // Budgets par catégorie avec pourcentages
          budgetsByCategory: budgetsByCategory.map(item => ({
            category: item._id,
            amount: item.total,
            count: item.count,
            percentage: totalBudget > 0 ? ((item.total / totalBudget) * 100).toFixed(2) : 0
          }))
        },
        
        // Activités récentes
        recent: {
          expenses: recentExpenses,
          budgets: recentBudgets
        }
      }
    });
    
  } catch (error) {
    // Si une erreur survient dans les calculs
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données du tableau de bord',
      error: error.message
    });
  }
});

// ========================================
// ROUTE SECONDAIRE : STATISTIQUES PAR PÉRIODE
// ========================================

// GET /api/dashboard/stats/:period
// Exemples : /api/dashboard/stats/week, /api/dashboard/stats/month, /api/dashboard/stats/year
router.get('/stats/:period', async (req, res) => {
  try {
    const { period } = req.params;
    let dateFilter = {};  // Filtre de date à appliquer
    
    const now = new Date();  // Date actuelle
    
    // ========================================
    // DÉFINITION DES FILTRES DE DATE
    // ========================================
    
    switch (period) {
      case 'week':
        // 7 derniers jours
        dateFilter = {
          date: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)  // now - 7 jours
          }
        };
        break;
        
      case 'month':
        // Depuis le début du mois actuel
        dateFilter = {
          date: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1)  // 1er jour du mois
          }
        };
        break;
        
      case 'year':
        // Depuis le début de l'année actuelle
        dateFilter = {
          date: {
            $gte: new Date(now.getFullYear(), 0, 1)  // 1er janvier
          }
        };
        break;
        
      default:
        // Si la période n'est pas reconnue, on prend tout
        dateFilter = {};
    }

    // ========================================
    // RÉCUPÉRATION DES DONNÉES FILTRÉES
    // ========================================
    
    // On récupère seulement les budgets et dépenses de la période demandée
    const budgets = await Budget.find(dateFilter);
    const expenses = await Expense.find(dateFilter);

    // ========================================
    // CALCULS SIMPLES (sans aggregate car on a déjà les données)
    // ========================================
    
    // reduce() additionne tous les montants
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.montant, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.montant, 0);

    // ========================================
    // RÉPONSE AVEC LES STATISTIQUES DE LA PÉRIODE
    // ========================================
    
    res.json({
      success: true,
      data: {
        period,                                    // Période demandée
        totalBudget,                              // Budget total de la période
        totalExpenses,                            // Dépenses totales de la période
        remainingBalance: totalBudget - totalExpenses,  // Solde de la période
        budgetCount: budgets.length,              // Nombre de budgets créés
        expenseCount: expenses.length             // Nombre de dépenses enregistrées
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

// ========================================
// EXPORTATION DU ROUTER
// ========================================

module.exports = router;

/*
RÉSUMÉ DES ROUTES DASHBOARD :

1. GET /api/dashboard → Toutes les statistiques du tableau de bord
2. GET /api/dashboard/stats/week → Statistiques de la semaine
3. GET /api/dashboard/stats/month → Statistiques du mois
4. GET /api/dashboard/stats/year → Statistiques de l'année

DONNÉES RENVOYÉES PAR /api/dashboard :
- summary : totaux et solde
- charts : données pour graphiques par catégorie
- recent : dernières activités

EXEMPLE DE RÉPONSE :
{
  "success": true,
  "data": {
    "summary": {
      "totalBudget": 1750,
      "totalExpenses": 901.19,
      "remainingBalance": 848.81,
      "budgetUtilization": "51.50"
    },
    "charts": {
      "expensesByCategory": [
        {
          "category": "Alimentation",
          "amount": 150.50,
          "count": 3,
          "percentage": "16.70"
        }
      ]
    }
  }
}
*/