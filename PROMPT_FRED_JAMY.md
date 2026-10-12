# Modification de VéritéCheck — Dialogue entre Fred et Jamy

Tu interviens sur VéritéCheck, un site pédagogique de fact-checking réalisé pour un TP
« Fake news, deepfakes et IA ». Tu es développeur web, expert UX/UI et intégration d'IA.

## 1. Le projet existant (à respecter, ne pas reconstruire)

- **Front** : HTML / CSS / JavaScript sans framework (`index.html`, `style.css`, `script.js`),
  publié sur GitHub Pages.
- **Back** : Python / Flask (`app.py`), hébergé sur Render. Il cherche des articles sur des
  sites reconnus (Tavily + Google Fact Check), puis l'IA Gemini rédige un verdict
  (vrai / faux / incertain) dont chaque phrase cite ses sources [1] [2].
- Sans source reconnue : pop-up « Information non vérifiable ».
- Sans serveur : une dizaine de cas connus, sourcés à la main dans `script.js`.
- Les clés API sont uniquement dans les variables d'environnement Render, jamais dans le front.
- Design à conserver : fond bleu nuit, graffitis, police « Permanent Marker », bouton rouge
  « VÉRIFIER », carte verte (vrai), rouge (faux), orange (non vérifiable), dino animé pendant
  la recherche.
- L'avatar actuel (autocollant en haut à gauche, `avatar.webp`) **reste en place** :
  Fred et Jamy sont un **ajout**, pas un remplacement.
- La mention « projet scolaire, images utilisées uniquement pour la classe, non affilié à
  l'émission » est déjà présente en bas de page : la conserver.

## 2. Objectif

Ajouter deux personnages inspirés de l'émission « C'est pas sorcier », Fred et Jamy, qui
dialoguent pour expliquer chaque résultat de vérification.

## 3. Placement (selon la maquette fournie)

- Les deux personnages encadrent la carte de résultat, en bas de la carte :
  - **Fred à GAUCHE** (chemise rouge) : c'est lui qui pose la question ;
  - **Jamy à DROITE** (lunettes rondes, chemise à fleurs) : c'est lui qui répond.
- Chaque personnage a sa bulle de dialogue, placée au-dessus de lui, lisible, sans masquer le
  titre, le formulaire, les sources ni l'explication.
- Sur mobile (moins de 560 px) : personnages plus petits, côte à côte au-dessus de la carte
  (Fred à gauche, Jamy à droite), bulles l'une sous l'autre (Fred puis Jamy).
- Images déjà fournies à la racine du dépôt, détourées sur fond transparent :
  `fred.png` (443 × 900) et `jamy.png` (652 × 900).
- Les personnages n'apparaissent qu'avec un résultat (pas sur la page vide).

## 4. Règles du dialogue

- Fred (à gauche) pose toujours la question, Jamy (à droite) répond toujours.
- Fred commence TOUJOURS par « Hé Jamy, pourquoi… » : question courte, naturelle, liée à
  l'information analysée.
  - Information vraie : « Hé Jamy, pourquoi [reformulation] ? »
  - Information fausse : « Hé Jamy, pourquoi dit-on que [rumeur] ? »
  - Non vérifiable : « Hé Jamy, pourquoi cette information est-elle difficile à vérifier ? »
- Jamy termine TOUJOURS par « , Fred ! ». Ton scientifique, simple, dynamique, légèrement
  humoristique, 1 à 2 phrases.
- Jamy ne dit RIEN qui ne figure pas dans les phrases sourcées du résultat : il les
  reformule, sans ajouter de fait, de chiffre, de source ni de certitude.
- Si l'information n'est pas vérifiable, Jamy le dit clairement et ne la présente jamais
  comme fausse sous prétexte qu'aucune source n'a été trouvée.

### Exemples

**Vrai** — « La Terre est ronde. »
- Fred : « Hé Jamy, pourquoi dit-on que la Terre est ronde ? »
- Jamy : « Parce que les sources scientifiques le confirment : c'est une sphère légèrement
  aplatie aux pôles, Fred ! »

**Faux** — « Les vaccins provoquent l'autisme. »
- Fred : « Hé Jamy, pourquoi dit-on que les vaccins provoquent l'autisme ? »
- Jamy : « C'est une fausse information : les grandes études et l'OMS n'ont trouvé aucun lien
  entre vaccins et autisme, Fred ! »

**Non vérifiable**
- Fred : « Hé Jamy, pourquoi cette information est-elle difficile à vérifier ? »
- Jamy : « Parce qu'aucune source fiable ne la confirme ni ne la dément pour l'instant : dans
  le doute, on ne partage pas, Fred ! »

## 5. Génération par l'IA (économiser le quota gratuit)

- Le compte Gemini gratuit est limité à environ 20 requêtes par jour : le dialogue doit être
  produit **dans le même appel Gemini** que le verdict (lignes `FRED:` et `JAMY:` ajoutées au
  format de réponse existant). Aucun appel supplémentaire.
- Le serveur vérifie le dialogue : Fred commence par « Hé Jamy, pourquoi » et Jamy finit par
  « Fred ! ». Sinon, il utilise le dialogue de secours.
- Le dialogue est renvoyé au front dans le JSON existant (champ `"dialogue": {"fred", "jamy"}`),
  sans supprimer verdict, score, phrases ni sources.

## 6. Dialogue de secours (sans IA)

Générer automatiquement côté front un dialogue à partir du verdict et de la première phrase
sourcée, pour : les cas connus locaux, les résultats Fact Check sans IA, les résultats non
vérifiables et les pannes du serveur.

## 7. Animations (CSS légères)

- La bulle de Fred apparaît d'abord, puis celle de Jamy environ 1 s après.
- Léger mouvement du personnage qui parle.
- Pendant la recherche (dino), les bulles sont masquées ; animation rejouée à chaque
  vérification.
- Respecter `prefers-reduced-motion`.

## 8. Contraintes

- Modifier uniquement ce qui est nécessaire dans `index.html`, `style.css`, `script.js` et
  `app.py`.
- Ne pas changer la logique de fact-checking ni la liste des sources reconnues.
- Ne jamais exposer de clé API dans le front.
- Tester dans le navigateur, sur ordinateur et sur mobile, avec : un cas vrai, un cas faux,
  un cas non vérifiable, et un cas sans serveur.
- Pas de déploiement sans accord : fournir les fichiers modifiés et la liste des changements ;
  c'est l'élève qui les envoie sur GitHub puis relance Render.

**Résultat attendu** : à chaque vérification, Fred pose sa question puis Jamy répond, avec un
dialogue fidèle aux sources, cohérent avec la maquette, l'avatar existant restant en haut à
gauche, et utilisable sur mobile.
