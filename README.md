# Budget App - Application de Gestion de Budget Personnel

**Développé par : Otmanelaissi@gmail.com**

Une application web full-stack moderne pour gérer vos budgets et dépenses personnelles, développée avec Angular, Express.js et MongoDB.

## 🚀 Fonctionnalités

### 📊 Tableau de bord
- Vue d'ensemble des finances avec statistiques en temps réel
- Graphiques de répartition des dépenses par catégorie
- Solde restant et utilisation du budget
- Activités récentes (budgets et dépenses)

### 💰 Gestion des budgets
- Créer, modifier et supprimer des budgets
- Catégorisation (Alimentation, Transport, Divertissement, etc.)
- Filtrage et recherche avancés
- Statistiques détaillées

### 💸 Gestion des dépenses
- Enregistrement rapide des dépenses
- Suivi par catégorie et date
- Notes et commentaires
- Analyse des habitudes de dépense

### 🎨 Interface utilisateur
- Design moderne avec Bootstrap 5
- Interface responsive (mobile-friendly)
- Navigation intuitive
- Thème cohérent et accessible

## 🛠️ Stack technique

- **Frontend**: Angular 17+ avec TypeScript
- **Backend**: Express.js (Node.js)
- **Base de données**: MongoDB avec Mongoose
- **Styling**: Bootstrap 5 + CSS personnalisé
- **Icônes**: Font Awesome 6

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- [MongoDB](https://www.mongodb.com/try/download/community) (version 5.0+)
- [Angular CLI](https://angular.io/cli) (optionnel, pour le développement)

## 🚀 Installation et démarrage

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd budget-app
```

### 2. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier le fichier .env selon vos besoins

# Démarrer MongoDB (si pas déjà fait)
# Sur Ubuntu/Debian:
sudo systemctl start mongod

# Sur macOS avec Homebrew:
brew services start mongodb-community

# Sur Windows, démarrer le service MongoDB
```

### 3. Peupler la base de données (optionnel)

```bash
# Depuis le dossier backend
npm run seed
```

Cette commande va créer des données d'exemple pour tester l'application.

### 4. Démarrer le serveur backend

```bash
# Mode développement avec rechargement automatique
npm run dev

# Ou mode production
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

### 5. Configuration du Frontend

```bash
# Ouvrir un nouveau terminal et aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200`

## 🔧 Configuration

### Variables d'environnement (Backend)

Créez un fichier `.env` dans le dossier `backend` :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/budget-app
NODE_ENV=development
```

### Configuration API (Frontend)

Modifiez `frontend/src/environments/environment.ts` si nécessaire :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 📚 API Documentation

### Endpoints principaux

#### Budgets
- `GET /api/budgets` - Récupérer tous les budgets
- `POST /api/budgets` - Créer un nouveau budget
- `GET /api/budgets/:id` - Récupérer un budget par ID
- `PUT /api/budgets/:id` - Mettre à jour un budget
- `DELETE /api/budgets/:id` - Supprimer un budget

#### Dépenses
- `GET /api/expenses` - Récupérer toutes les dépenses
- `POST /api/expenses` - Créer une nouvelle dépense
- `GET /api/expenses/:id` - Récupérer une dépense par ID
- `PUT /api/expenses/:id` - Mettre à jour une dépense
- `DELETE /api/expenses/:id` - Supprimer une dépense

#### Tableau de bord
- `GET /api/dashboard` - Récupérer les données du tableau de bord
- `GET /api/dashboard/stats/:period` - Statistiques par période

## 🧪 Tests et développement

### Scripts disponibles

#### Backend
```bash
npm start          # Démarrer en mode production
npm run dev        # Démarrer en mode développement
npm run seed       # Peupler la base de données
```

#### Frontend
```bash
npm start          # Démarrer le serveur de développement
npm run build      # Construire pour la production
npm run watch      # Construire en mode watch
npm test           # Lancer les tests
```

## 📱 Utilisation

1. **Accédez à l'application** sur `http://localhost:4200`
2. **Tableau de bord** : Vue d'ensemble de vos finances
3. **Créer un budget** : Définissez vos budgets par catégorie
4. **Enregistrer des dépenses** : Suivez vos dépenses au quotidien
5. **Analyser** : Consultez les graphiques et statistiques

## 🎯 Fonctionnalités avancées

- **Filtrage intelligent** : Recherche par titre, catégorie, montant
- **Tri dynamique** : Par date, montant, catégorie
- **Statistiques en temps réel** : Calculs automatiques
- **Interface responsive** : Optimisée pour mobile et desktop
- **Validation des données** : Côté client et serveur
- **Gestion d'erreurs** : Messages d'erreur informatifs

## 🔒 Sécurité

- Validation des données d'entrée
- Protection contre les injections NoSQL
- Gestion des erreurs sécurisée
- Variables d'environnement pour les configurations sensibles

## 🚀 Déploiement

### Production

1. **Backend** :
   ```bash
   cd backend
   npm install --production
   npm start
   ```

2. **Frontend** :
   ```bash
   cd frontend
   npm run build
   # Servir les fichiers du dossier dist/
   ```

3. **Base de données** : Configurez MongoDB Atlas ou une instance MongoDB dédiée


## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que MongoDB est démarré
2. Vérifiez les ports (3000 pour le backend, 4200 pour le frontend)
3. Consultez les logs dans la console
4. Vérifiez les variables d'environnement

---

**Développé avec par Othmane El Aissi tpour une gestion financière simplifiée**
