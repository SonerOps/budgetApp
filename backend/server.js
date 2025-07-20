/**
 * Budget App - Backend Server
 * 
 * Ce fichier est le CŒUR de notre application backend.
 * Il configure et démarre le serveur Express.js qui va gérer toutes les requêtes.
 * 
 * POUR DÉBUTANTS :
 * - Express.js = Framework web pour Node.js (comme un serveur web)
 * - MongoDB = Base de données pour stocker nos budgets et dépenses
 * - API = Interface qui permet au frontend de communiquer avec le backend
 * 
 * @author Otmanelaissi@gmail.com
 * @version 1.0.0
 * @license MIT
 */

// ========================================
// 1. IMPORTATION DES MODULES NÉCESSAIRES
// ========================================

// Express.js : Framework pour créer notre serveur web
const express = require('express');

// Mongoose : Outil pour communiquer avec MongoDB de façon simple
const mongoose = require('mongoose');

// CORS : Permet au frontend (port 4200) de communiquer avec le backend (port 3000)
const cors = require('cors');

// Body-parser : Permet de lire les données JSON envoyées par le frontend
const bodyParser = require('body-parser');

// Dotenv : Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

// ========================================
// 2. CONFIGURATION DE BASE
// ========================================

// Création de notre application Express
const app = express();

// Port sur lequel notre serveur va écouter (3000 par défaut)
const PORT = process.env.PORT || 3000;

// ========================================
// 3. MIDDLEWARE (Fonctions qui s'exécutent avant chaque requête)
// ========================================

// CORS : Autorise les requêtes depuis d'autres domaines (notre frontend Angular)
app.use(cors());

// Body-parser JSON : Permet de lire les données JSON dans les requêtes
app.use(bodyParser.json());

// Body-parser URL : Permet de lire les données de formulaires
app.use(bodyParser.urlencoded({ extended: true }));

// ========================================
// 4. CONNEXION À LA BASE DE DONNÉES MONGODB
// ========================================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,    // Utilise le nouveau parser d'URL de MongoDB
  useUnifiedTopology: true, // Utilise le nouveau moteur de surveillance
})
.then(() => {
  // Si la connexion réussit, on affiche un message de succès
  console.log('✅ Connexion à MongoDB réussie');
})
.catch(err => {
  // Si la connexion échoue, on affiche l'erreur
  console.error('❌ Erreur de connexion à MongoDB:', err);
});

// ========================================
// 5. IMPORTATION DES ROUTES (Endpoints de notre API)
// ========================================

// Routes pour gérer les budgets (créer, lire, modifier, supprimer)
const budgetRoutes = require('./routes/budgets');

// Routes pour gérer les dépenses (créer, lire, modifier, supprimer)
const expenseRoutes = require('./routes/expenses');

// Routes pour le tableau de bord (statistiques, graphiques)
const dashboardRoutes = require('./routes/dashboard');

// ========================================
// 6. CONFIGURATION DES ROUTES
// ========================================

// Toutes les routes commençant par /api/budgets seront gérées par budgetRoutes
app.use('/api/budgets', budgetRoutes);

// Toutes les routes commençant par /api/expenses seront gérées par expenseRoutes
app.use('/api/expenses', expenseRoutes);

// Toutes les routes commençant par /api/dashboard seront gérées par dashboardRoutes
app.use('/api/dashboard', dashboardRoutes);

// ========================================
// 7. ROUTE DE TEST (pour vérifier que le serveur fonctionne)
// ========================================

app.get('/', (req, res) => {
  // Quand on visite http://localhost:3000, on reçoit ce message
  res.json({ message: 'API Budget App fonctionne !' });
});

// ========================================
// 8. GESTION DES ERREURS
// ========================================

// Middleware pour gérer toutes les erreurs qui peuvent survenir
app.use((err, req, res, next) => {
  // On affiche l'erreur dans la console pour le développeur
  console.error(err.stack);
  
  // On renvoie une réponse d'erreur au client
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    // En développement, on montre l'erreur complète, en production on la cache
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ========================================
// 9. GESTION DES ROUTES NON TROUVÉES (404)
// ========================================

// Si aucune route ne correspond à la requête, on renvoie une erreur 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// ========================================
// 10. DÉMARRAGE DU SERVEUR
// ========================================

// Le serveur commence à écouter sur le port spécifié
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Accédez à l'API sur : http://localhost:${PORT}`);
  console.log(`📊 Tableau de bord : http://localhost:${PORT}/api/dashboard`);
});