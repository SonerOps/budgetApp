# Guide Backend pour Débutants - Budget App

**Développé par : Otmanelaissi@gmail.com**

Ce guide explique les concepts backend utilisés dans l'application Budget App.

## 🎯 Architecture Backend

```
Backend (Express.js + MongoDB)
├── server.js          # Serveur principal
├── models/            # Modèles de données (Mongoose)
│   ├── Budget.js
│   └── Expense.js
├── routes/            # Routes API (endpoints)
│   ├── budgets.js
│   ├── expenses.js
│   └── dashboard.js
└── seedData.js        # Données d'exemple
```

## 🚀 Express.js - Serveur Web

### 1. Qu'est-ce qu'Express.js ?
Express.js est un framework web pour Node.js qui permet de créer facilement des serveurs web et des APIs.

```javascript
const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route simple
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
```

### 2. Middleware
Les middlewares sont des fonctions qui s'exécutent avant chaque requête.

```javascript
// Middleware pour tous les endpoints
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Passer au middleware suivant
});

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour CORS (autoriser les requêtes cross-origin)
app.use(cors());
```

### 3. Routes et méthodes HTTP

```javascript
// GET - Récupérer des données
app.get('/api/budgets', (req, res) => {
  res.json(budgets);
});

// POST - Créer des données
app.post('/api/budgets', (req, res) => {
  const newBudget = req.body;
  // Sauvegarder en base
  res.status(201).json(newBudget);
});

// PUT - Modifier des données
app.put('/api/budgets/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  // Modifier en base
  res.json(updatedBudget);
});

// DELETE - Supprimer des données
app.delete('/api/budgets/:id', (req, res) => {
  const id = req.params.id;
  // Supprimer de la base
  res.json({ message: 'Budget supprimé' });
});
```

## 🗄️ MongoDB et Mongoose

### 1. Qu'est-ce que MongoDB ?
MongoDB est une base de données NoSQL qui stocke les données au format JSON (documents).

```javascript
// Document Budget dans MongoDB
{
  "_id": "507f1f77bcf86cd799439011",
  "titre": "Budget courses",
  "montant": 400,
  "categorie": "Alimentation",
  "date": "2024-01-15T00:00:00.000Z",
  "notes": "Budget mensuel",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Mongoose - ODM (Object Document Mapper)
Mongoose facilite le travail avec MongoDB en JavaScript.

```javascript
const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/budget-app');

// Définir un schéma
const budgetSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    maxlength: 100
  },
  montant: {
    type: Number,
    required: true,
    min: 0
  },
  categorie: {
    type: String,
    required: true,
    enum: ['Alimentation', 'Transport', 'Autres']
  }
}, {
  timestamps: true  // Ajoute createdAt et updatedAt automatiquement
});

// Créer le modèle
const Budget = mongoose.model('Budget', budgetSchema);
```

### 3. Opérations CRUD avec Mongoose

```javascript
// CREATE - Créer un document
const newBudget = new Budget({
  titre: "Budget courses",
  montant: 400,
  categorie: "Alimentation"
});
await newBudget.save();

// READ - Lire des documents
const budgets = await Budget.find();                    // Tous les budgets
const budget = await Budget.findById(id);               // Un budget par ID
const foodBudgets = await Budget.find({ categorie: "Alimentation" }); // Filtrer

// UPDATE - Modifier un document
const updatedBudget = await Budget.findByIdAndUpdate(
  id, 
  { montant: 500 }, 
  { new: true }  // Retourne le document modifié
);

// DELETE - Supprimer un document
await Budget.findByIdAndDelete(id);
```

### 4. Requêtes avancées

```javascript
// Tri
const budgets = await Budget.find().sort({ date: -1 }); // Tri décroissant par date

// Limitation
const recentBudgets = await Budget.find().limit(5);     // 5 premiers résultats

// Sélection de champs
const budgets = await Budget.find().select('titre montant'); // Seulement titre et montant

// Agrégation (calculs complexes)
const totalBudget = await Budget.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: '$montant' }
    }
  }
]);
```

## 🛣️ Routes API (Endpoints)

### 1. Structure des routes

```javascript
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// GET /api/budgets - Liste tous les budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ date: -1 });
    res.json({
      success: true,
      count: budgets.length,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
```

### 2. Gestion des erreurs

```javascript
// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Dans les routes
router.post('/', async (req, res) => {
  try {
    const budget = new Budget(req.body);
    const savedBudget = await budget.save();
    res.status(201).json({
      success: true,
      data: savedBudget
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Erreur de validation Mongoose
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        error: error.message
      });
    } else {
      // Autres erreurs
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }
});
```

### 3. Validation des données

```javascript
// Validation avec Mongoose
const budgetSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  montant: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [0, 'Le montant doit être positif']
  }
});

// Validation personnalisée
budgetSchema.path('montant').validate(function(value) {
  return value > 0;
}, 'Le montant doit être supérieur à 0');
```

## 📊 Agrégations MongoDB

### 1. Calculs simples

```javascript
// Total des budgets
const totalBudget = await Budget.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: '$montant' }
    }
  }
]);

// Moyenne des budgets
const avgBudget = await Budget.aggregate([
  {
    $group: {
      _id: null,
      moyenne: { $avg: '$montant' }
    }
  }
]);
```

### 2. Groupement par catégorie

```javascript
// Budgets par catégorie
const budgetsByCategory = await Budget.aggregate([
  {
    $group: {
      _id: '$categorie',           // Grouper par catégorie
      total: { $sum: '$montant' }, // Somme des montants
      count: { $sum: 1 }          // Nombre de budgets
    }
  },
  {
    $sort: { total: -1 }         // Trier par total décroissant
  }
]);

// Résultat :
// [
//   { _id: "Alimentation", total: 800, count: 3 },
//   { _id: "Transport", total: 300, count: 2 }
// ]
```

### 3. Pipeline d'agrégation complexe

```javascript
const stats = await Budget.aggregate([
  // Étape 1 : Filtrer les budgets de cette année
  {
    $match: {
      date: {
        $gte: new Date(new Date().getFullYear(), 0, 1)
      }
    }
  },
  // Étape 2 : Grouper par catégorie
  {
    $group: {
      _id: '$categorie',
      total: { $sum: '$montant' },
      count: { $sum: 1 },
      moyenne: { $avg: '$montant' }
    }
  },
  // Étape 3 : Ajouter un pourcentage
  {
    $addFields: {
      categorie: '$_id'
    }
  },
  // Étape 4 : Trier
  {
    $sort: { total: -1 }
  }
]);
```

## 🔐 Sécurité et bonnes pratiques

### 1. Variables d'environnement

```javascript
// .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/budget-app
NODE_ENV=development

// server.js
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

### 2. Validation et sanitisation

```javascript
// Validation des paramètres
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }
  
  // Continuer...
});
```

### 3. CORS (Cross-Origin Resource Sharing)

```javascript
const cors = require('cors');

// Autoriser toutes les origines (développement)
app.use(cors());

// Configuration spécifique (production)
app.use(cors({
  origin: ['http://localhost:4200', 'https://monapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🧪 Tests et debugging

### 1. Logs utiles

```javascript
// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Logs dans les routes
router.post('/', async (req, res) => {
  console.log('Données reçues:', req.body);
  
  try {
    const budget = await Budget.create(req.body);
    console.log('Budget créé:', budget._id);
    res.json(budget);
  } catch (error) {
    console.error('Erreur création budget:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Test des endpoints avec curl

```bash
# GET - Récupérer tous les budgets
curl http://localhost:3000/api/budgets

# POST - Créer un budget
curl -X POST http://localhost:3000/api/budgets \
  -H "Content-Type: application/json" \
  -d '{"titre":"Test","montant":100,"categorie":"Autres"}'

# PUT - Modifier un budget
curl -X PUT http://localhost:3000/api/budgets/ID \
  -H "Content-Type: application/json" \
  -d '{"montant":200}'

# DELETE - Supprimer un budget
curl -X DELETE http://localhost:3000/api/budgets/ID
```

## 📈 Performance et optimisation

### 1. Index MongoDB

```javascript
// Créer des index pour améliorer les performances
budgetSchema.index({ categorie: 1, date: -1 });
budgetSchema.index({ date: -1 });
```

### 2. Pagination

```javascript
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const budgets = await Budget.find()
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Budget.countDocuments();

  res.json({
    success: true,
    data: budgets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
```

## 🔄 Async/Await vs Promises

### 1. Avec Promises

```javascript
Budget.find()
  .then(budgets => {
    res.json(budgets);
  })
  .catch(error => {
    res.status(500).json({ error: error.message });
  });
```

### 2. Avec Async/Await (recommandé)

```javascript
async function getBudgets(req, res) {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

Ce guide couvre les concepts essentiels du backend utilisés dans Budget App. Pour approfondir :
- [Documentation Express.js](https://expressjs.com/)
- [Documentation Mongoose](https://mongoosejs.com/)
- [Documentation MongoDB](https://docs.mongodb.com/)