#!/bin/bash

# Budget App - Script de démarrage rapide
# Développé par : Otmanelaissi@gmail.com
# Ce script installe les dépendances et démarre l'application

echo "🚀 Démarrage de Budget App..."
echo "👨‍💻 Développé par : Otmanelaissi@gmail.com"
echo "================================"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si MongoDB est en cours d'exécution
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB ne semble pas être en cours d'exécution."
    echo "   Veuillez démarrer MongoDB avant de continuer."
    echo "   Ubuntu/Debian: sudo systemctl start mongod"
    echo "   macOS: brew services start mongodb-community"
    read -p "Appuyez sur Entrée une fois MongoDB démarré..."
fi

# Installation des dépendances backend
echo "📦 Installation des dépendances backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dépendances backend déjà installées"
fi

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    cat > .env << EOL
PORT=3000
MONGODB_URI=mongodb://localhost:27017/budget-app
NODE_ENV=development
EOL
    echo "✅ Fichier .env créé avec la configuration par défaut"
fi

# Peupler la base de données si elle est vide
echo "🌱 Peuplement de la base de données avec des données d'exemple..."
npm run seed

# Démarrer le backend en arrière-plan
echo "🔧 Démarrage du serveur backend..."
npm run dev &
BACKEND_PID=$!
echo "✅ Backend démarré (PID: $BACKEND_PID)"

# Attendre que le backend soit prêt
echo "⏳ Attente du démarrage du backend..."
sleep 5

# Installation des dépendances frontend
echo "📦 Installation des dépendances frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dépendances frontend déjà installées"
fi

# Démarrer le frontend
echo "🎨 Démarrage du serveur frontend..."
echo "================================"
echo "🌐 Backend: http://localhost:3000"
echo "🎯 Frontend: http://localhost:4200"
echo "================================"
echo "💡 Utilisez Ctrl+C pour arrêter les serveurs"
echo ""

# Démarrer le frontend (bloquant)
npm start

# Nettoyer les processus en arrière-plan quand le script se termine
trap "kill $BACKEND_PID 2>/dev/null" EXIT