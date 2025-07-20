/**
 * Budget App - Seed Data Script
 * 
 * Script pour peupler la base de données avec des données d'exemple
 * 
 * @author Otmanelaissi@gmail.com
 * @version 1.0.0
 * @license MIT
 */

const mongoose = require('mongoose');
const Budget = require('./models/Budget');
const Expense = require('./models/Expense');
require('dotenv').config();

// Données d'exemple pour les budgets
const sampleBudgets = [
  {
    titre: 'Budget Alimentation Mensuel',
    montant: 500,
    categorie: 'Alimentation',
    date: new Date('2024-01-01'),
    notes: 'Budget pour les courses et repas du mois'
  },
  {
    titre: 'Budget Transport',
    montant: 200,
    categorie: 'Transport',
    date: new Date('2024-01-01'),
    notes: 'Essence et transports en commun'
  },
  {
    titre: 'Budget Divertissement',
    montant: 150,
    categorie: 'Divertissement',
    date: new Date('2024-01-01'),
    notes: 'Cinéma, sorties, loisirs'
  },
  {
    titre: 'Budget Santé',
    montant: 100,
    categorie: 'Santé',
    date: new Date('2024-01-01'),
    notes: 'Médicaments et consultations'
  },
  {
    titre: 'Budget Logement',
    montant: 800,
    categorie: 'Logement',
    date: new Date('2024-01-01'),
    notes: 'Loyer et charges'
  }
];

// Données d'exemple pour les dépenses
const sampleExpenses = [
  {
    titre: 'Courses Carrefour',
    montant: 85.50,
    categorie: 'Alimentation',
    date: new Date('2024-01-15'),
    notes: 'Courses hebdomadaires'
  },
  {
    titre: 'Essence',
    montant: 45.00,
    categorie: 'Transport',
    date: new Date('2024-01-14'),
    notes: 'Plein d\'essence'
  },
  {
    titre: 'Cinéma',
    montant: 24.00,
    categorie: 'Divertissement',
    date: new Date('2024-01-13'),
    notes: 'Séance de cinéma en couple'
  },
  {
    titre: 'Pharmacie',
    montant: 15.80,
    categorie: 'Santé',
    date: new Date('2024-01-12'),
    notes: 'Médicaments contre le rhume'
  },
  {
    titre: 'Loyer Janvier',
    montant: 650.00,
    categorie: 'Logement',
    date: new Date('2024-01-01'),
    notes: 'Loyer mensuel'
  },
  {
    titre: 'Restaurant',
    montant: 32.50,
    categorie: 'Alimentation',
    date: new Date('2024-01-16'),
    notes: 'Déjeuner au restaurant'
  },
  {
    titre: 'Métro',
    montant: 12.00,
    categorie: 'Transport',
    date: new Date('2024-01-16'),
    notes: 'Tickets de métro'
  },
  {
    titre: 'Livre',
    montant: 18.90,
    categorie: 'Éducation',
    date: new Date('2024-01-15'),
    notes: 'Livre de développement personnel'
  },
  {
    titre: 'Café',
    montant: 4.50,
    categorie: 'Alimentation',
    date: new Date('2024-01-17'),
    notes: 'Café du matin'
  },
  {
    titre: 'Streaming Netflix',
    montant: 13.49,
    categorie: 'Divertissement',
    date: new Date('2024-01-10'),
    notes: 'Abonnement mensuel Netflix'
  }
];

async function seedDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion à MongoDB réussie');

    // Supprimer les données existantes
    await Budget.deleteMany({});
    await Expense.deleteMany({});
    console.log('🗑️  Données existantes supprimées');

    // Insérer les budgets d'exemple
    const budgets = await Budget.insertMany(sampleBudgets);
    console.log(`✅ ${budgets.length} budgets d'exemple créés`);

    // Insérer les dépenses d'exemple
    const expenses = await Expense.insertMany(sampleExpenses);
    console.log(`✅ ${expenses.length} dépenses d'exemple créées`);

    console.log('🎉 Base de données peuplée avec succès !');
    
    // Afficher un résumé
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.montant, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.montant, 0);
    
    console.log('\n📊 Résumé:');
    console.log(`💰 Budget total: ${totalBudget}€`);
    console.log(`💸 Dépenses totales: ${totalExpenses}€`);
    console.log(`💵 Solde restant: ${totalBudget - totalExpenses}€`);

  } catch (error) {
    console.error('❌ Erreur lors du peuplement de la base de données:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleBudgets, sampleExpenses };