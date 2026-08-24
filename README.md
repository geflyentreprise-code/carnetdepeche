# CarnetPêche 🎣

Votre guide complet des parcours de pêche en France. Découvrez les meilleurs spots, les espèces présentes et les réglementations applicables.

## 🌟 Fonctionnalités

- 🗺️ **Carte interactive** - Visualisez les parcours de pêche en temps réel
- 📍 **Parcours géolocalisés** - Trouvez les spots grâce aux coordonnées GPS
- 🐟 **Catalogue de poissons** - Découvrez les espèces présentes sur chaque parcours
- 📋 **Réglementations** - Consultez les règles et périodes de pêche
- 🎯 **Système de filtres** - Filtrez par catégorie, type et département
- ⭐ **Avis des pêcheurs** - Partagez vos expériences
- 💾 **Favoris locaux** - Sauvegardez vos parcours préférés
- 👨‍💼 **Panel d'administration** - Gestion complète du contenu (admin)

## 🚀 Installation

### Prérequis

- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Node.js (optionnel, pour un serveur local)
- Un compte Supabase (pour la base de données)

### Configuration rapide

1. **Clonez le dépôt**
```bash
git clone https://github.com/geflyentreprise-code/carnetdepeche.git
cd carnetdepeche
```

2. **Ouvrez simplement dans un navigateur**
```bash
# Double-cliquez sur index.html
# Ou lancez un serveur local
python -m http.server 8000
# Puis accédez à http://localhost:8000
```

### Configuration Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans `index.html`, remplacez les variables :
```javascript
const SUPABASE_URL = "votre_url_supabase";
const SUPABASE_KEY = "votre_clé_publique";
const ADMIN_EMAIL = "votre_email_admin@gmail.com";
const ADMIN_USER_ID = "votre_user_id";
```

## 📁 Structure du projet

```
carnetdepeche/
├── index.html           # Page principale
├── css/
│   └── styles.css       # Feuille de styles
├── js/
│   ├── app.js           # Script principal
│   └── utils.js         # Fonctions utilitaires
├── README.md            # Documentation
├── LICENSE              # Licence MIT
└── .gitignore           # Fichiers ignorés par Git
```

## 🗄️ Base de données Supabase

### Tables requises

**1. Parcours**
```sql
CREATE TABLE parcours (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nom TEXT NOT NULL,
  description TEXT,
  departement TEXT,
  commune TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  type_parcours TEXT,
  categorie_piscicole TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**2. Poissons**
```sql
CREATE TABLE poissons (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nom TEXT NOT NULL,
  nom_scientifique TEXT,
  description TEXT,
  taille_min_cm DECIMAL,
  taille_max_cm DECIMAL,
  poids_max_kg DECIMAL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**3. Parcours-Poissons (relation M2M)**
```sql
CREATE TABLE parcours_poissons (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  parcours_id BIGINT NOT NULL REFERENCES parcours(id) ON DELETE CASCADE,
  poisson_id BIGINT NOT NULL REFERENCES poissons(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**4. Réglementations**
```sql
CREATE TABLE reglementations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  parcours_id BIGINT NOT NULL REFERENCES parcours(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  description TEXT,
  departement TEXT,
  espece TEXT,
  periode_debut DATE,
  periode_fin DATE,
  taille_min_cm DECIMAL,
  quota TEXT,
  zone TEXT,
  source_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**5. Avis**
```sql
CREATE TABLE parcours_avis (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  parcours_id BIGINT NOT NULL REFERENCES parcours(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  prenom TEXT,
  note INTEGER CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentification

### Inscription
- Email et mot de passe
- Confirmation par email
- Compte public par défaut

### Connexion
- Email/mot de passe
- Session persistante
- Déconnexion sécurisée

### Admin
- Identifié par email ou user_id
- Accès aux formulaires d'administration
- Gestion complète du contenu

## 🎨 Personnalisation

### Modifier les couleurs

Éditez les variables CSS dans `css/styles.css` :

```css
:root {
  --navy: #092631;           /* Bleu foncé */
  --primary: #176b78;        /* Couleur primaire */
  --gold: #c89d43;          /* Accent or */
  --success: #247451;       /* Succès (vert) */
  --danger: #b52b22;        /* Danger (rouge) */
}
```

### Ajouter des villes

Modifiez le fichier `js/app.js` et ajoutez dans le tableau `cities` :

```javascript
{ name: 'Votre ville', timezone: 'Europe/Paris', emoji: '🏠' }
```

## 📱 Responsive Design

L'application est entièrement responsive :
- **Desktop** (1200px+) - Grille 3 colonnes
- **Tablette** (768px-1199px) - Grille 2 colonnes
- **Mobile** (< 768px) - Grille 1 colonne

## 🗺️ Intégrations

### Leaflet.js
- Cartes interactives OpenStreetMap
- Marqueurs géolocalisés
- Popups dynamiques

### Supabase
- Base de données PostgreSQL
- Authentification
- Row Level Security (RLS)
- API REST

## 🛡️ Sécurité

### Row Level Security (RLS)
```sql
-- Exemple pour la table parcours
CREATE POLICY "Parcours lecturables par tous"
  ON parcours FOR SELECT
  USING (true);

CREATE POLICY "Parcours modifiables par admin"
  ON parcours FOR UPDATE
  USING (auth.uid() = '875df56b-e162-4ce8-99fc-d31fb423ae26');
```

### Anti-spam
- Cooldown de 30 secondes entre les avis
- Validation côté client ET serveur
- Limite de requêtes Supabase

## 📚 Utilisation

### Pour les pêcheurs

1. **Explorer les parcours**
   - Consultez la carte ou la liste
   - Utilisez les filtres
   - Cliquez sur "Voir le parcours"

2. **Consulter les détails**
   - Poissons présents
   - Réglementations applicables
   - Avis d'autres pêcheurs

3. **Partager votre avis**
   - Notez le parcours (1-5 étoiles)
   - Écrivez votre commentaire
   - Signez avec votre prénom

### Pour les administrateurs

1. **Se connecter**
   - Utilisez l'email admin configuré
   - Accédez au panel d'admin

2. **Gérer les parcours**
   - Ajouter/modifier/supprimer
   - Remplir les informations complètes
   - Ajouter une image

3. **Gérer les poissons**
   - Créer des espèces
   - Associer aux parcours
   - Renseigner les caractéristiques

4. **Gérer les réglementations**
   - Ajouter des règles par parcours
   - Préciser les périodes et tailles
   - Lier aux sources officielles

## 🐛 Dépannage

### La carte ne s'affiche pas
- Vérifiez votre connexion Internet
- Attendez le chargement complet de la page
- Vérifiez la console (F12) pour les erreurs

### Impossible de se connecter
- Vérifiez votre email et mot de passe
- Confirmez votre email (lien de confirmation)
- Réinitialisez votre mot de passe

### Les données ne se chargent pas
- Vérifiez la configuration Supabase
- Vérifiez les clés API
- Vérifiez les permissions RLS

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le dépôt
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💼 Auteur

**CarnetPêche** - Développé avec ❤️ pour les passionnés de pêche

- 📧 Email: geflyentreprise@gmail.com
- 🌐 GitHub: [geflyentreprise-code](https://github.com/geflyentreprise-code)
- 🎣 Site: [carnetdepeche.fr](https://geflyentreprise-code.github.io/carnetdepeche)

## 🙏 Remerciements

- [Supabase](https://supabase.com) - Base de données
- [Leaflet](https://leafletjs.com) - Cartographie
- [OpenStreetMap](https://openstreetmap.org) - Données de cartes
- [Unsplash](https://unsplash.com) - Images

## 📞 Support

Pour toute question ou problème :
- Ouvrez une [Issue](https://github.com/geflyentreprise-code/carnetdepeche/issues)
- Contactez-moi directement

---

**Happy Fishing! 🎣✨**