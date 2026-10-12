"use strict";

/* URL du backend Python (ex : "https://veritecheck-api.onrender.com").
   Laisser vide = mode démo local, sans IA. */
const API_URL = "https://veritecheck.onrender.com";

/* ---------- Sources vérifiées des cas connus ----------
   Chaque article a été relu : chaque phrase ci-dessous renvoie au passage qui la confirme. */
const S = {
  zelensky: { nom: "Ouest-France – Une chaîne piratée diffuse une fausse vidéo du président", url: "https://www.ouest-france.fr/europe/ukraine/guerre-en-ukraine-piratee-une-chaine-locale-diffuse-une-fausse-video-du-president-appelant-a-abdiquer-7679103" },
  biden20: { nom: "20 Minutes – Un consultant à l'origine de faux appels de Joe Biden", url: "https://www.20minutes.fr/monde/4078512-20240227-presidentielle-americaine-2024-consultant-politique-origine-faux-appels-joe-biden-generes-ia" },
  bidenBbc: { nom: "BBC – Fake Biden robocall tells voters to skip primary", url: "https://www.bbc.com/news/world-us-canada-68064247" },
  fccBbc: { nom: "BBC – US FCC makes AI-generated robocalls illegal", url: "https://www.bbc.com/news/world-us-canada-68240887" },
  pape: { nom: "Ouest-France – Cinq astuces pour repérer une fausse image créée par une IA", url: "https://www.ouest-france.fr/leditiondusoir/2023-03-29/voici-cinq-astuces-pour-reperer-une-fausse-image-creee-par-une-intelligence-artificielle-8fbbb2de-f742-4807-83de-0544291299c7" },
  pentagone20: { nom: "20 Minutes – Une fausse image d'une explosion au Pentagone brièvement virale", url: "https://www.20minutes.fr/by-the-web/4037946-20230523-fausse-image-explosion-pentagone-brievement-virale" },
  pentagoneNum: { nom: "Numerama – Comment une fausse image du Pentagone a fait trembler la bourse", url: "https://www.numerama.com/tech/1385498-comment-une-fausse-image-du-pentagone-en-flammes-a-fait-trembler-la-bourse.html" },
  terre: { nom: "Numerama – La Terre est-elle vraiment ronde ?", url: "https://www.numerama.com/sciences/464223-la-terre-est-elle-vraiment-ronde.html" },
  vaccinOms: { nom: "Sciences et Avenir – Pas de lien entre les vaccins et l'autisme, réaffirme l'OMS", url: "https://www.sciencesetavenir.fr/sante/pas-de-lien-entre-les-vaccins-et-l-autisme-reaffirme-l-oms_189865" },
  vaccinRor: { nom: "Sciences et Avenir – Non, le vaccin ROR n'est pas lié à l'autisme", url: "https://www.sciencesetavenir.fr/sante/non-le-vaccin-ror-n-est-pas-lie-a-l-autisme_131969" },
  cerveau20: { nom: "20 Minutes – N'utilise-t-on vraiment que 10 % de notre cerveau ?", url: "https://www.20minutes.fr/sciences/1426463-20140807-utilise-vraiment-10-capacites-cerveau" },
  cerveauCnrs: { nom: "CNRS Le journal – Neuromythes : le mythe des 10 %", url: "https://lejournal.cnrs.fr/nos-blogs/aux-frontieres-du-cerveau/neuromythes-le-mythe-des-10" },
  eiffelActu: { nom: "actu.fr – La tour Eiffel va grandir de plusieurs mètres", url: "https://actu.fr/ile-de-france/paris_75056/a-paris-la-tour-eiffel-va-grandir-de-plusieurs-metres_49338772.html" },
  eiffelOf: { nom: "Ouest-France – La tour Eiffel change de taille avec la chaleur", url: "https://www.ouest-france.fr/culture/patrimoine/la-tour-eiffel-change-de-taille-et-pivote-avec-la-chaleur-savez-vous-pourquoi-c81968b4-709d-11f1-b8a9-4a6626afbf8d" }
};

/* ---------- Base locale de cas connus (chaque phrase est sourcée) ---------- */
const BASE = [
  {
    test: n => /zelens?ky/.test(n) && /(rend|reddition|capitul|armes|deepfake)/.test(n),
    verdict: "faux", score: 6,
    titre: "Deepfake de Zelensky appelant à rendre les armes",
    phrases: [
      ["Le 16 mars 2022, la chaîne ukrainienne Ukraine 24, victime d'un piratage, a diffusé un deepfake de Volodymyr Zelensky appelant à rendre les armes.", [S.zelensky]],
      ["Meta a supprimé la vidéo et Zelensky l'a qualifiée de « provocation puérile ».", [S.zelensky]]
    ]
  },
  {
    test: n => /biden/.test(n) && /(appel|robocall|voix|primaire|new hampshire)/.test(n),
    verdict: "faux", score: 8,
    titre: "Appels automatisés avec une fausse voix de Joe Biden",
    phrases: [
      ["En janvier 2024, des appels automatisés imitant la voix de Joe Biden ont incité des électeurs du New Hampshire à ne pas voter à la primaire.", [S.bidenBbc, S.biden20]],
      ["Un consultant politique a reconnu avoir fait imiter la voix du président grâce à un outil d'IA.", [S.biden20]],
      ["L'autorité américaine des communications (FCC) a ensuite rendu illégaux les appels automatisés utilisant des voix générées par IA.", [S.fccBbc]]
    ]
  },
  {
    test: n => /pape/.test(n) && /(doudoune|balenciaga|puffer)/.test(n),
    verdict: "faux", score: 10,
    titre: "Le pape François en doudoune blanche",
    phrases: [
      ["L'image du pape François en doudoune blanche fait partie des fausses photos de personnalités créées par des outils d'IA comme Midjourney, devenues virales en mars 2023.", [S.pape]]
    ]
  },
  {
    test: n => /pentag/.test(n) && /(explosion|attaque|bombe|flamme)/.test(n),
    verdict: "faux", score: 8,
    titre: "Fausse explosion au Pentagone",
    phrases: [
      ["Le 22 mai 2023, une image très probablement générée par IA montrant une explosion au Pentagone a circulé sur Twitter.", [S.pentagoneNum, S.pentagone20]],
      ["Elle a notamment été publiée par un compte certifié se faisant passer pour l'agence Bloomberg.", [S.pentagoneNum, S.pentagone20]],
      ["Les marchés ont brièvement baissé, et le ministère américain de la Défense a confirmé qu'il n'y avait eu aucune attaque.", [S.pentagone20]]
    ]
  },
  {
    test: n => /terre (est )?plate|platiste/.test(n),
    verdict: "faux", score: 3,
    titre: "La Terre est plate",
    phrases: [
      ["La Terre n'est pas plate : c'est un ellipsoïde, c'est-à-dire une sphère légèrement aplatie aux pôles à cause de sa rotation.", [S.terre]]
    ]
  },
  {
    test: n => /terre (est )?ronde/.test(n),
    verdict: "vrai", score: 90,
    titre: "La Terre est ronde",
    phrases: [
      ["La Terre est quasi sphérique : plus précisément un ellipsoïde, légèrement aplati aux pôles.", [S.terre]]
    ]
  },
  {
    test: n => /vaccin/.test(n) && /autis/.test(n),
    verdict: "faux", score: 5,
    titre: "Vaccins et autisme",
    phrases: [
      ["En décembre 2025, une analyse de l'OMS portant sur 31 études n'a établi aucun lien entre les vaccins et l'autisme.", [S.vaccinOms]],
      ["L'étude de 1998 qui suggérait un lien ne portait que sur 12 enfants et a été désavouée ; une étude sur plus de 650 000 enfants danois n'a trouvé aucun lien avec le vaccin ROR.", [S.vaccinRor]]
    ]
  },
  {
    test: n => /\b(10|dix) ?(%|pour cent)? (du|de notre|de son|de leur|des|de nos) (cerveau|capacites)/.test(n),
    verdict: "faux", score: 6,
    titre: "On n'utilise que 10 % de son cerveau",
    phrases: [
      ["L'imagerie par IRM montre qu'aucune région du cerveau n'est endormie ou inutilisée.", [S.cerveau20]],
      ["Les chercheurs classent cette idée parmi les « neuromythes ».", [S.cerveauCnrs, S.cerveau20]]
    ]
  },
  {
    test: n => /eiffel/.test(n) && /\b(330|324)\b/.test(n),
    verdict: "vrai", score: 95,
    titre: "Hauteur de la tour Eiffel",
    phrases: [
      ["La tour Eiffel mesure 330 mètres de haut.", [S.eiffelOf, S.eiffelActu]],
      ["Elle mesurait 324 mètres avant l'installation d'une nouvelle antenne en mars 2022.", [S.eiffelActu]]
    ]
  }
];

/* ---------- Outils pour vérifier soi-même (pop-up) ---------- */
const OUTILS = [
  { nom: "Décodex / Vérification (Le Monde)", url: "https://www.lemonde.fr/verification/" },
  { nom: "Hoaxbuster", url: "https://www.hoaxbuster.com/" },
  { nom: "AFP Factuel", url: "https://factuel.afp.com/" }
];

/* ---------- Cas de test ---------- */
const EXEMPLES = [
  { t: "Le pape François a été photographié en doudoune blanche", c: "f" },
  { t: "Une vidéo montre Zelensky appelant son armée à se rendre", c: "f" },
  { t: "Les vaccins provoquent l'autisme", c: "f" },
  { t: "La tour Eiffel mesure environ 330 mètres", c: "v" },
  { t: "La Terre est ronde", c: "v" },
  { t: "CHOC !!! Ils ne veulent pas que vous sachiez ce secret, partagez avant la censure !", c: "i" },
  { t: "Selon l'INSEE, le chômage a légèrement baissé ce trimestre (communiqué officiel)", c: "i" }
];

/* ---------- Avatar ---------- */
const MOODS = {
  idle:      { mouth: "M42 84 Q60 94 78 84",       face: "#ffd9a8", b1: [38, 38], b2: [38, 38] },
  thinking:  { mouth: "M50 86 L70 86",             face: "#ffd9a8", b1: [34, 36], b2: [36, 34] },
  vrai:      { mouth: "M38 80 Q60 104 82 80",      face: "#c9f0d8", b1: [36, 36], b2: [36, 36] },
  faux:      { mouth: "M40 92 Q60 74 80 92",       face: "#ffd0d0", b1: [34, 42], b2: [42, 34] },
  incertain: { mouth: "M42 86 Q51 80 60 86 T78 86", face: "#ffeab8", b1: [40, 35], b2: [35, 40] }
};
const PAROLES = {
  idle: "On vérifie avant de parler et partager !",
  thinking: "Je fouille les sources…",
  vrai: "Confirmé par des sources reconnues !",
  faux: "Démenti par les sources. Ne partage pas !",
  incertain: "Aucune source fiable : prudence !"
};
const CONSEILS = [
  "Astuce : une info qui t'énerve ou te choque est souvent faite pour être partagée vite.",
  "Astuce : cherche la source d'origine, pas seulement la capture d'écran.",
  "Astuce : sur une image, regarde les mains, les ombres et les textes déformés.",
  "Astuce : pour une vidéo, vérifie la synchronisation entre lèvres et voix.",
  "Astuce : une voix peut être clonée en quelques secondes d'enregistrement."
];

const $ = id => document.getElementById(id);
let conseilIdx = 0;

function setMood(nom, parole) {
  const m = MOODS[nom];
  $("mouth").setAttribute("d", m.mouth);
  $("face").style.fill = m.face;
  const b1 = $("b1"), b2 = $("b2");
  b1.setAttribute("y1", m.b1[0]); b1.setAttribute("y2", m.b1[1]);
  b2.setAttribute("y1", m.b2[0]); b2.setAttribute("y2", m.b2[1]);
  const avatar = $("avatar");
  ["thinking", "vrai", "faux", "incertain"].forEach(c => avatar.classList.toggle(c, nom === c));
  $("bubble").textContent = parole || PAROLES[nom];
}

/* ---------- Sécurité : seuls les liens http(s) sont affichés ---------- */
function urlSure(u) {
  try {
    const url = new URL(String(u));
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch { return null; }
}

/* ---------- Analyse locale ---------- */
function normaliser(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9%\s]/g, " ")
    .replace(/\s+/g, " ").trim();
}

const ALARMISTE = ["choc", "urgent", "scandale", "miracle", "complot", "censur", "secret", "ils ne veulent pas", "les medias mentent", "revelation", "incroyable", "bombe"];
const ABSOLUS = ["tous", "toujours", "jamais", "100", "personne", "aucun"];
const PARTAGE = ["partagez", "diffusez", "faites tourner", "faites circuler", "avant que ce soit supprime"];

// Indices de style : affichés dans la pop-up, ils ne prouvent rien sur le fond.
function signaux(texte, n) {
  const liste = [];
  const lettres = texte.replace(/[^A-Za-zÀ-ÿ]/g, "");
  const maj = lettres.replace(/[^A-ZÀ-Þ]/g, "").length;
  if (lettres.length > 15 && maj / lettres.length > 0.3) liste.push("Beaucoup de MAJUSCULES");
  if ((texte.match(/!/g) || []).length >= 2) liste.push("Points d'exclamation répétés");
  if (ALARMISTE.some(w => n.includes(w))) liste.push("Vocabulaire alarmiste ou sensationnaliste");
  if (ABSOLUS.some(w => (" " + n + " ").includes(" " + w + " "))) liste.push("Formulations absolues (tous, jamais, 100 %…)");
  if (PARTAGE.some(w => n.includes(w))) liste.push("Appel à partager rapidement");
  return liste;
}

// Transforme un cas connu en résultat avec sources numérotées.
function resultatSource(cas, type) {
  const sources = [];
  const phrases = cas.phrases.map(([texte, srcs]) => ({
    texte,
    sources: srcs.map(s => {
      let i = sources.indexOf(s);
      if (i === -1) { sources.push(s); i = sources.length - 1; }
      return i + 1;
    })
  }));
  return {
    verifiable: true, type, verdict: cas.verdict, score: cas.score, titre: cas.titre, phrases,
    sources: sources.map((s, i) => ({ num: i + 1, nom: s.nom, url: s.url, domaine: new URL(s.url).hostname.replace(/^www\./, "") }))
  };
}

function analyserLocal(texte, raisonServeur) {
  const n = normaliser(texte);
  const cas = BASE.find(e => e.test(n));
  const sig = signaux(texte, n);
  if (cas) {
    // « ne … que » (ex : « on n'utilise que 10 % ») n'est pas une vraie négation
    if (/\b(ne|n|pas|jamais|aucun|non)\b/.test(n.replace(/\bne? \S+ que\b/g, ""))) {
      return {
        verifiable: false, verdict: "incertain", titre: cas.titre, signaux: sig,
        raison: "Ta phrase contient une négation, que l'analyse locale ne sait pas interpréter. Reformule sans négation."
      };
    }
    return resultatSource(cas, "connu");
  }
  return {
    verifiable: false, verdict: "incertain", titre: "Aucun cas connu", signaux: sig,
    raison: raisonServeur || "Cette information ne fait pas partie des cas connus et aucune recherche de sources n'a pu être faite."
  };
}

/* ---------- Analyse par le serveur (IA + recherche web) ---------- */
async function analyserAvecServeur(texte) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90000); // le serveur gratuit peut mettre ~50 s à se réveiller
  try {
    const rep = await fetch(API_URL.replace(/\/$/, "") + "/api/verifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texte }),
      signal: ctrl.signal
    });
    if (!rep.ok) throw new Error("HTTP " + rep.status);
    const d = await rep.json();
    if (typeof d.verifiable !== "boolean") throw new Error("Réponse invalide");
    if (!d.verifiable) {
      return {
        verifiable: false, verdict: "incertain", titre: d.titre || "Analyse",
        raison: d.raison || "Aucune source reconnue trouvée.",
        sourcesEcartees: d.sources_ecartees || 0,
        signaux: signaux(texte, normaliser(texte))
      };
    }
    const sources = (d.sources || [])
      .map(s => ({ num: s.num, nom: String(s.nom || s.domaine), url: urlSure(s.url), domaine: String(s.domaine || "") }))
      .filter(s => s.url);
    const nums = new Set(sources.map(s => s.num));
    const phrases = (d.phrases || [])
      .map(p => ({ texte: String(p.texte), sources: (p.sources || []).filter(n => nums.has(n)) }))
      .filter(p => p.sources.length); // une phrase sans source n'est jamais affichée
    if (!phrases.length || !["vrai", "faux"].includes(d.verdict)) {
      return { verifiable: false, verdict: "incertain", titre: d.titre || "Analyse", raison: "Aucune phrase de l'analyse n'est appuyée par une source reconnue.", signaux: [] };
    }
    return {
      verifiable: true, type: d.moteur === "factcheck" ? "factcheck" : "ia", verdict: d.verdict, score: Number(d.score) || 50,
      titre: d.titre || "Analyse", phrases, sources, sourcesEcartees: d.sources_ecartees || 0
    };
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Affichage ---------- */
const LABELS = { vrai: "Vrai", faux: "Faux", incertain: "Incertain" };
const TYPES = {
  connu: "Cas connu – sources vérifiées",
  ia: "Analyse IA – sources reconnues trouvées sur le web",
  factcheck: "Vérifications publiées par des rédactions de fact-checking (via Google Fact Check)",
  nonverif: "Information non vérifiable"
};
const COULEURS = { vrai: "var(--vrai)", faux: "var(--faux)", incertain: "var(--incertain)" };

function lien(nom, url) {
  const a = document.createElement("a");
  a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = nom;
  return a;
}

const ICONES = { vrai: "✓", faux: "✕", incertain: "?" };
const SVG_NS = "http://www.w3.org/2000/svg";

function iconeLien() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "source-lien");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5");
  svg.appendChild(path);
  return svg;
}

function afficher(texte, r) {
  const carte = $("result");
  carte.hidden = false;
  carte.className = "carte " + r.verdict;
  // relance l'animation d'apparition
  carte.style.animation = "none"; void carte.offsetWidth; carte.style.animation = "";

  $("badge").textContent = r.verifiable ? LABELS[r.verdict] : "Non vérifiable";
  $("icone").textContent = ICONES[r.verdict];
  $("kind").textContent = r.verifiable ? TYPES[r.type] : TYPES.nonverif;
  $("echo").textContent = texte;

  const score = r.verifiable ? r.score : 0;
  $("score").textContent = r.verifiable ? score + " %" : "—";
  $("gauge").setAttribute("aria-valuenow", score);
  const fill = $("gaugeFill");
  fill.style.width = "0";
  requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = score + "%"; }));

  // Explication : chaque phrase est suivie de ses numéros de source [1] [2]
  const explain = $("explain");
  explain.innerHTML = "";
  const titre = document.createElement("strong");
  titre.textContent = r.titre;
  explain.appendChild(titre);
  if (r.verifiable) {
    const ul = document.createElement("ul");
    r.phrases.forEach(p => {
      const li = document.createElement("li");
      li.append(p.texte + " ");
      p.sources.forEach(num => {
        const sup = document.createElement("a");
        sup.href = "#source-" + num;
        sup.className = "ref";
        sup.textContent = "[" + num + "]";
        li.append(sup);
      });
      ul.appendChild(li);
    });
    explain.appendChild(ul);
  } else {
    const p = document.createElement("p");
    p.textContent = r.raison;
    explain.appendChild(p);
  }

  const src = $("sources");
  src.innerHTML = "";
  $("sourcesBox").hidden = !r.verifiable;
  if (r.verifiable) {
    r.sources.forEach(s => {
      const li = document.createElement("li");
      li.id = "source-" + s.num;
      const a = lien("", s.url);
      a.className = "source";
      const num = document.createElement("span");
      num.className = "source-num";
      num.textContent = s.num;
      const txt = document.createElement("span");
      txt.className = "source-txt";
      const nom = document.createElement("strong");
      nom.textContent = s.nom;
      const dom = document.createElement("small");
      dom.textContent = s.domaine;
      txt.append(nom, dom);
      a.append(num, txt, iconeLien());
      li.appendChild(a);
      src.appendChild(li);
    });
    $("ecartees").textContent = r.sourcesEcartees
      ? r.sourcesEcartees + " autre(s) source(s) trouvée(s) mais écartée(s) car non reconnue(s)."
      : "";
  }
}

function ouvrirPopup(r) {
  $("popupRaison").textContent = r.raison;
  const ul = $("popupSignaux");
  ul.innerHTML = "";
  (r.signaux || []).forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });
  $("popupSignauxBox").hidden = !(r.signaux && r.signaux.length);
  $("popupEcartees").textContent = r.sourcesEcartees
    ? r.sourcesEcartees + " source(s) trouvée(s) mais écartée(s) car non reconnue(s)."
    : "";
  const outils = $("popupOutils");
  outils.innerHTML = "";
  OUTILS.forEach(o => {
    const li = document.createElement("li");
    li.appendChild(lien(o.nom, o.url));
    outils.appendChild(li);
  });
  const dlg = $("popup");
  if (typeof dlg.showModal === "function") dlg.showModal();
  else dlg.setAttribute("open", "");
}

const attendre = ms => new Promise(res => setTimeout(res, ms));

async function verifier(texte) {
  texte = texte.trim();
  if (texte.length < 12) {
    setMood("incertain", "Écris une phrase plus complète !");
    return;
  }
  $("claim").value = texte;
  $("send").disabled = true;
  $("result").hidden = true;
  $("loader").hidden = false; // le dino court pendant la recherche
  $("loaderTexte").textContent = "Je cherche des sources reconnues…";
  $("loader").scrollIntoView({ behavior: "smooth", block: "center" });
  setMood("thinking");
  const reveil = setTimeout(() => {
    $("loaderTexte").textContent = "Le serveur se réveille, ça peut prendre jusqu'à une minute…";
  }, 8000);

  let r = null;
  const debut = Date.now();
  if (API_URL) {
    try { r = await analyserAvecServeur(texte); }
    catch (e) {
      // Serveur indisponible : les cas connus restent sourcés, le reste est non vérifiable.
      r = analyserLocal(texte, "Le serveur de recherche de sources est indisponible : impossible de trouver des sources pour cette information.");
    }
  } else {
    r = analyserLocal(texte);
  }
  await attendre(Math.max(0, 1800 - (Date.now() - debut))); // laisse le temps de voir le dino
  clearTimeout(reveil);
  $("loader").hidden = true;

  afficher(texte, r);
  $("result").scrollIntoView({ behavior: "smooth", block: "start" });
  if (r.verifiable) {
    setMood(r.verdict, PAROLES[r.verdict] + " (" + r.sources.length + " source" + (r.sources.length > 1 ? "s" : "") + ")");
  } else {
    setMood("incertain");
    ouvrirPopup(r);
  }
  $("send").disabled = false;
}

/* ---------- Initialisation ---------- */
$("form").addEventListener("submit", e => {
  e.preventDefault();
  verifier($("claim").value);
});
// Image de l'avatar (avatar.webp) si elle existe, sinon l'avatar dessiné
const photo = $("photo");
function afficherPhoto() { photo.hidden = false; $("dessin").style.display = "none"; }
if (photo.complete && photo.naturalWidth) afficherPhoto();
else photo.addEventListener("load", afficherPhoto);
$("claim").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("form").requestSubmit(); }
});
$("avatar").addEventListener("click", () => {
  setMood("idle", CONSEILS[conseilIdx++ % CONSEILS.length]);
});
$("popupFermer").addEventListener("click", () => $("popup").close());
EXEMPLES.forEach(ex => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "chip " + ex.c; b.textContent = ex.t.length > 48 ? ex.t.slice(0, 46) + "…" : ex.t;
  b.title = ex.t;
  b.addEventListener("click", () => verifier(ex.t));
  $("chips").appendChild(b);
});
setMood("idle");
