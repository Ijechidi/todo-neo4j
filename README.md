

# ✅ **Todo List avec Neo4j et Next.js**  

Une application moderne de gestion de tâches utilisant **Neo4j** comme base de données graphe, **Next.js** pour le frontend et **Tailwind CSS** pour le style.  

## 🌟 **Fonctionnalités**  

- ✅ **Créer, modifier et supprimer** des tâches  
- 📊 **Organisation par catégories** (Courses, Personnel, Travail)  
- 🎨 **Interface moderne et responsive**  
- ⚡ **Animations fluides** avec Framer Motion  
- 🔄 **Mise à jour en temps réel**  
- 📱 **Design adaptatif (mobile-first)**  

## 🛠 **Technologies utilisées**  

- **Frontend** : Next.js 14, React, TypeScript  
- **Base de données** : Neo4j  
- **Styling** : Tailwind CSS  
- **Animations** : Framer Motion  
- **API** : Next.js API Routes  

## 📋 **Prérequis**  

- **Node.js** (version 18 ou supérieure)  
- **Neo4j** (version 5 ou supérieure)  
- **npm** ou **yarn**  

## 🚀 **Installation**  

1️⃣ **Cloner le repository**  

```sh
git clone https://github.com/utilisateur/todo-list-neo4j.git
cd todo-list-neo4j
```

2️⃣ **Installer les dépendances**  

```sh
npm install 
# ou 
yarn install
```

3️⃣ **Configurer l’environnement**  

Créez un fichier `.env.local` à la racine du projet et ajoutez :  

```sh
NEO4J_URI=bolt://localhost:7687
```

4️⃣ **Lancer l’application**  

```sh
npm run dev
# ou
yarn dev
```

---

## 📊 **Structure de la base de données**  

### 🗂 **Nodes**  

- `Todo` : représente une tâche  
  - **Propriétés** : `id`, `title`, `completed`  
- `Category` : représente une catégorie  
  - **Propriétés** : `id`, `name`, `color`  

### 🔗 **Relations**  

- `BELONGS_TO` : relie une tâche (`Todo`) à sa catégorie (`Category`)  

---

## 🔍 **Détails des fonctionnalités**  

### ✅ **Gestion des tâches**  

- Création de nouvelles tâches avec une catégorie  
- Marquage des tâches comme complétées  
- Suppression des tâches  
- Filtrage des tâches par catégorie  

### 🏷 **Catégories disponibles**  

- 🟢 **Courses**  
- 🔵 **Personnel**  
- 🔴 **Travail**  

---

## 🤝 **Contribution**  

Les contributions sont les bienvenues ! 🎉  

1. **Forker** le projet  
2. **Créer une branche** pour votre fonctionnalité (`feature/nouvelle-fonction`)  
3. **Commiter vos modifications**  
4. **Pousser votre branche**  
5. **Ouvrir une Pull Request**  

---

## 📝 **Licence**  

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.  

## 👥 **Auteur**  

✍️Precious Ogwo – 📧 ogwoprecious21@gmail.com 


