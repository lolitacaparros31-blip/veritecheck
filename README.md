# VéritéCheck – TP Fake news, deepfakes et IA

Plateforme web de vérification d'information.

- **Front** : HTML / CSS / JavaScript (`index.html`, `style.css`, `script.js`), hébergé sur GitHub Pages
- **Back** : Python / Flask (`backend/app.py`), hébergé sur Render, appelle l'API Gemini avec recherche web
- **Sources obligatoires** : chaque phrase de l'explication porte un numéro [1] [2] qui renvoie à une source reconnue. Si aucune source reconnue ne confirme ou ne dément l'information, une pop-up « Information non vérifiable » s'affiche.
- **Sources reconnues** : liste inspirée de l'article Panorapresse (Ouest-France) « Sources fiables : les meilleurs sites d'actu pour une veille informationnelle » (Le Monde, Ouest-France, 20 Minutes, Mediapart, actu.fr, Numerama, Sciences et Avenir, BBC, The Guardian, .gouv.fr, europa.eu, vie-publique.fr, CNRS, Persée, OpenEdition, INRAE, Nature, Hoaxbuster), complétée par AFP, franceinfo, Radio France, Reuters, AP, OMS, Inserm et Institut Pasteur. Modifiable dans `backend/app.py`.
- **Secours** : si le serveur est indisponible, les cas connus restent analysés avec leurs sources vérifiées ; tout le reste est déclaré non vérifiable.

## Déploiement (tout gratuit)

### 1. Clé API Gemini
1. Va sur https://aistudio.google.com → « Get API key » → crée une clé.
2. Garde-la pour l'étape 3. Ne la colle jamais dans le code, dans GitHub ni dans un chat.

### 2. Dépôt GitHub
1. Crée un dépôt public `veritecheck` sur github.com.
2. « Add file » → « Upload files » → glisse **tout le contenu du dossier** (`index.html`, `style.css`, `script.js`, `README.md` et le dossier `backend`) → « Commit changes ».

### 3. Backend sur Render
1. Crée un compte sur https://render.com (connexion avec GitHub).
2. « New » → « Web Service » → choisis ton dépôt `veritecheck`.
3. Réglages :
   - **Root Directory** : `backend`
   - **Runtime** : Python
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `gunicorn app:app --timeout 120`
   - **Instance type** : Free
4. Onglet « Environment » → ajoute :
   - `GEMINI_API_KEY` = ta clé
   - `ALLOWED_ORIGIN` = `https://TON-PSEUDO.github.io` (optionnel, plus sûr)
5. Déploie. Teste `https://TON-SERVICE.onrender.com/healthz` : tu dois voir `"cle_configuree": true`.

### 4. Brancher le site
1. Dans GitHub, ouvre `script.js` → crayon ✏️ → ligne `const API_URL = "";`
2. Mets l'URL Render : `const API_URL = "https://TON-SERVICE.onrender.com";` → Commit.

### 5. Publier le site
1. Dépôt → Settings → Pages → Source : « Deploy from a branch » → `main` / `(root)` → Save.
2. Après ~1 minute : `https://TON-PSEUDO.github.io/veritecheck/`.

## Notes
- Le serveur gratuit s'endort : le premier appel peut prendre ~30 s. Ouvre `/healthz` quelques minutes avant la présentation.
- Modèle par défaut : `gemini-2.5-flash`. S'il n'est plus proposé dans AI Studio, ajoute la variable `GEMINI_MODEL` avec le nom du modèle actuel.
- La recherche web est obligatoire : sans elle, il n'y a pas de sources, donc pas de verdict.

## Limites à présenter
- L'IA peut se tromper ou halluciner : le verdict est une aide, pas une preuve. Les sources citées doivent être ouvertes et lues.
- Elle analyse du texte uniquement : pas de détection de deepfake dans une image, une vidéo ou un audio.
- Quotas gratuits : au-delà, le site passe en analyse locale.
