import {
  afficherMessage,
  espacesInsecables,
  texteAvecGras,
} from "../../outils.js";

// =========================================================
// clic.js — exercice « Apprendre à cliquer »
// =========================================================

// ---------- 1. Les niveaux ----------
// Un niveau = un type de clic à apprendre.
// Chaque niveau a plusieurs manches, de plus en plus difficiles :
//   taille  : diamètre des cibles en pixels
//   nombre  : combien de cibles à toucher pour finir la manche
//   vitesse : déplacement en pixels par image (0 = la cible ne bouge pas)
//   description : note pour l'animateur, pas affichée à l'écran
// usages : les exemples de « À quoi ça sert ? » (les mots entre ** sont en gras)
// astuce : la phrase après « 💡 Astuce : »
// resume : l'usage principal, rappelé sur l'écran de fin
const NIVEAUX = [
  {
    nom: "Clic gauche",
    clic: "gauche",
    titre: "Le clic gauche",
    consigne:
      "Mets la souris sur le rond bleu, puis appuie une fois sur son bouton gauche.",
    usages: [
      { picto: "🔗", texte: "Ouvrir un **lien** sur Internet" },
      {
        picto: "🔘",
        texte: "Appuyer sur un **bouton** : « Valider », « Envoyer »…",
      },
      { picto: "✏️", texte: "Cliquer dans une **case** pour écrire dedans" },
      { picto: "📄", texte: "**Choisir** un fichier ou une icône" },
    ],
    astuce:
      "c'est le clic le plus utilisé. Quand on te dit « clique », c'est le clic gauche.",
    resume: "Ouvrir un **lien**, appuyer sur un **bouton**",
    manches: [
      {
        taille: 120,
        nombre: 10,
        vitesse: 0,
        description: "Grandes cibles, immobiles",
      },
      {
        taille: 90,
        nombre: 10,
        vitesse: 0.7,
        description: "Cibles moyennes, lentes",
      },
      {
        taille: 64,
        nombre: 10,
        vitesse: 1.5,
        description: "Petites cibles, rapides",
      },
    ],
  },
  {
    nom: "Clic droit",
    clic: "droit",
    titre: "Le clic droit",
    consigne:
      "Mets la souris sur le rond orange, puis appuie une fois sur son bouton droit.",
    usages: [
      { picto: "📋", texte: "Ouvrir un **menu** avec plus de choix" },
      { picto: "✂️", texte: "**Copier**, **couper** et **coller**" },
      { picto: "🖼️", texte: "**Enregistrer** une image" },
      { picto: "🗑️", texte: "**Renommer** ou **supprimer** un fichier" },
    ],
    astuce:
      "le clic droit ne fait rien de grave tout seul : il ouvre seulement un menu. Si tu ne sais pas quoi faire, essaie-le.",
    resume: "Ouvrir un **menu** : copier, coller, enregistrer…",
    manches: [
      {
        taille: 120,
        nombre: 10,
        vitesse: 0,
        description: "Grandes cibles, immobiles",
      },
      {
        taille: 90,
        nombre: 10,
        vitesse: 0.7,
        description: "Cibles moyennes, lentes",
      },
      {
        taille: 64,
        nombre: 10,
        vitesse: 1.5,
        description: "Petites cibles, rapides",
      },
    ],
  },
  {
    nom: "Double-clic",
    clic: "double",
    titre: "Le double-clic",
    consigne:
      "Mets la souris sur le rond vert, puis appuie deux fois très vite sur son bouton gauche, sans la bouger.",
    usages: [
      { picto: "📁", texte: "Ouvrir un **dossier**" },
      {
        picto: "📄",
        texte: "Ouvrir un **fichier** : une photo, un document…",
      },
      { picto: "🖥️", texte: "Lancer un **programme** depuis le bureau" },
      { picto: "🔤", texte: "Sélectionner un **mot** dans un texte" },
    ],
    astuce:
      "sur Internet, un seul clic suffit presque toujours. Le double-clic sert surtout sur le bureau et dans les dossiers.",
    resume: "Ouvrir un **dossier** ou un **fichier**",
    manches: [
      // Cibles immobiles : pendant un double-clic, la souris ne doit pas bouger.
      // La difficulté vient de la taille et du nombre de cibles.
      {
        taille: 130,
        nombre: 10,
        vitesse: 0,
        description: "Grandes cibles, immobiles",
      },
      {
        taille: 100,
        nombre: 15,
        vitesse: 0,
        description: "Cibles moyennes, immobiles",
      },
      {
        taille: 80,
        nombre: 20,
        vitesse: 0,
        description: "Petites cibles, immobiles",
      },
      {
        taille: 60,
        nombre: 20,
        vitesse: 0,
        description: "Toutes petites cibles, immobiles",
      },
    ],
  },
];

// Temps laissé pour faire le 2e clic d'un double-clic, en millisecondes.
// 500 ms est le réglage par défaut de Windows.
const DELAI_DOUBLE_CLIC = 500;

// Les messages de réussite, tirés au hasard pour varier
const FELICITATIONS = [
  "Bravo !",
  "Bien joué !",
  "Super !",
  "Parfait !",
  "Excellent !",
];

// ---------- 2. Les éléments de la page ----------
const listeNiveaux = document.getElementById("niveaux");
const souris = document.getElementById("souris");
const consigneTitre = document.getElementById("consigne-titre");
const consigneTexte = document.getElementById("consigne-texte");
const zone = document.getElementById("zone");
const ecran = document.getElementById("ecran");
const ecranTitre = document.getElementById("ecran-titre");
const ecranTexte = document.getElementById("ecran-texte");
const ecranBouton = document.getElementById("ecran-bouton");
const texteManche = document.getElementById("manche");
const texteCompteur = document.getElementById("compteur");
const message = document.getElementById("message");
const listeUsages = document.getElementById("usages");
const texteAstuce = document.getElementById("astuce");
const explication = document.querySelector(".explication");
const recap = document.getElementById("recap");
const lienSuivant = document.getElementById("activite-suivante");

// ---------- 3. L'état du jeu ----------
// Ces variables changent pendant la partie (d'où let, et pas const)
let numeroNiveau = 0; // position du niveau en cours dans NIVEAUX (0 = le premier)
const niveauxFaits = new Set(); // les numéros des niveaux terminés
let numeroManche = 0; // position de la manche en cours dans le niveau
let ciblesTouchees = 0; // combien de cibles réussies dans cette manche
let cibleEnCours = null; // la cible affichée (null = aucune)
let suiteEnAttente = null; // minuteur entre une cible touchée et la suivante

// Raccourcis pour lire le niveau et la manche en cours
const niveauEnCours = () => NIVEAUX[numeroNiveau];
const mancheEnCours = () => niveauEnCours().manches[numeroManche];

// ---------- 4. L'affichage ----------

// Crée un onglet par niveau, en haut du jeu : un <li> qui contient un <button>
function afficherOnglets() {
  const onglets = NIVEAUX.map((niveau, index) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = niveau.nom;
    bouton.dataset.bouton = niveau.clic; // → data-bouton="gauche" : donne sa couleur
    bouton.classList.toggle("actif", index === numeroNiveau);
    bouton.classList.toggle("fait", niveauxFaits.has(index));
    if (index === numeroNiveau) {
      bouton.setAttribute("aria-current", "step"); // « c'est l'étape en cours »
    }
    bouton.addEventListener("click", () => choisirNiveau(index));

    const onglet = document.createElement("li");
    onglet.append(bouton);
    return onglet;
  });
  listeNiveaux.replaceChildren(...onglets);
}

// Met à jour l'explication du niveau en cours :
// souris, titre, consigne, exemples et astuce
function afficherConsigne() {
  const niveau = niveauEnCours();
  souris.dataset.bouton = niveau.clic;
  consigneTitre.textContent = niveau.titre;
  consigneTexte.textContent = espacesInsecables(niveau.consigne);

  // « À quoi ça sert ? » : un <li> par exemple, avec son pictogramme
  const usages = niveau.usages.map(({ picto, texte }) => {
    const pictogramme = document.createElement("span");
    pictogramme.className = "picto";
    pictogramme.setAttribute("aria-hidden", "true"); // décoratif
    pictogramme.textContent = picto;

    const description = document.createElement("span");
    description.append(...texteAvecGras(texte));

    const usage = document.createElement("li");
    usage.append(pictogramme, description);
    return usage;
  });
  listeUsages.replaceChildren(...usages);

  texteAstuce.replaceChildren(...texteAvecGras(niveau.astuce));
}

// Affiche l'écran par-dessus la zone de jeu.
// « action » est la fonction lancée quand on clique sur le bouton.
function afficherEcran(titre, texte, texteBouton, action) {
  // Le récapitulatif et le lien « Activité suivante » ne servent qu'à la fin :
  // on les cache ici, afficherFin() les montrera
  recap.hidden = true;
  lienSuivant.hidden = true;

  ecranTitre.textContent = titre;
  ecranTexte.textContent = texte;
  ecranBouton.textContent = texteBouton;
  ecranBouton.onclick = action;
  ecran.hidden = false;
  // Le focus permet de valider avec Entrée.
  // focusVisible: false : pas de contour orange, même au chargement de la page.
  ecranBouton.focus({ preventScroll: true, focusVisible: false });
}

function afficherCompteur() {
  texteCompteur.textContent = `Cible ${ciblesTouchees} sur ${mancheEnCours().nombre}`;
}

// Présente le niveau en cours : onglets, consigne, écran « Commencer »
function presenterNiveau() {
  const niveau = niveauEnCours();
  explication.open = true; // nouveau niveau : on montre l'explication dépliée
  afficherOnglets();
  afficherConsigne();
  texteManche.textContent = "";
  texteCompteur.textContent = "";
  afficherEcran(
    niveau.titre,
    `${niveau.manches.length} exercices. Les erreurs ne comptent pas, prends ton temps.`,
    "Commencer",
    () => {
      numeroManche = 0;
      demarrerManche();
    },
  );
}

// Quand on clique sur un onglet : on arrête la partie en cours
// et on présente le niveau choisi
function choisirNiveau(index) {
  arreterCibles();
  afficherMessage(message, "");
  numeroNiveau = index;
  presenterNiveau();
}

// ---------- 5. Les manches et les cibles ----------

// Enlève toutes les cibles et annule tout ce qui était prévu « pour plus tard »
function arreterCibles() {
  clearTimeout(suiteEnAttente); // la cible suivante ne doit plus apparaître
  if (cibleEnCours) {
    clearTimeout(cibleEnCours.attente); // ni le message « Un seul clic »
    cibleEnCours = null;
  }
  zone.querySelectorAll(".cible").forEach((cible) => cible.remove());
}

function demarrerManche() {
  const niveau = niveauEnCours();
  ciblesTouchees = 0;
  ecran.hidden = true;
  texteManche.textContent = `Exercice ${numeroManche + 1} sur ${niveau.manches.length}`;
  afficherCompteur();
  afficherMessage(message, ""); // efface le message de la manche précédente
  creerCible();
}

function creerCible() {
  const { taille, vitesse } = mancheEnCours();
  const { clic } = niveauEnCours(); // le clic demandé dans ce niveau

  const cible = document.createElement("button");
  cible.type = "button";
  cible.className = "cible";
  cible.dataset.bouton = clic; // donne la couleur (CSS section 1)
  cible.style.setProperty("--taille", `${taille}px`);

  // Une position au hasard, sans dépasser de la zone
  const x = Math.random() * (zone.clientWidth - taille);
  const y = Math.random() * (zone.clientHeight - taille);
  cible.style.left = `${x}px`;
  cible.style.top = `${y}px`;

  // Une direction au hasard (un angle entre 0 et 360°, en radians).
  // cos et sin découpent la vitesse en un mouvement horizontal (vx)
  // et un mouvement vertical (vy).
  const angle = Math.random() * 2 * Math.PI;
  const vx = Math.cos(angle) * vitesse;
  const vy = Math.sin(angle) * vitesse;

  cibleEnCours = { element: cible, clic, taille, x, y, vx, vy };
  zone.append(cible);
}

// ---------- 6. Les clics ----------

// clicFait : "gauche" ou "droit" — evenement : pour savoir si c'est un double-clic
function reagirAuClic(clicFait, evenement) {
  if (!cibleEnCours) return; // pas de cible active : on ignore

  const { element, clic: clicDemande } = cibleEnCours;

  if (clicDemande === "double") {
    // On annule un éventuel avertissement « Un seul clic » en attente
    clearTimeout(cibleEnCours.attente);

    if (clicFait === "droit") {
      mauvaisClic(
        "C'était le bouton droit. Ici, fais un double-clic avec le bouton gauche.",
      );
    } else if (evenement.detail >= 2) {
      bonClic();
    } else {
      // Premier clic : on laisse le temps au 2e clic d'arriver.
      // S'il n'arrive pas à temps, on prévient la personne.
      cibleEnCours.attente = setTimeout(() => {
        element.classList.add("moitie");
        afficherMessage(message, 
          "Un seul clic… Clique deux fois, plus vite !",
          "attention",
        );
      }, DELAI_DOUBLE_CLIC);
    }
    return;
  }

  if (clicFait === clicDemande) {
    bonClic();
  } else if (clicDemande === "gauche") {
    mauvaisClic("C'était le bouton droit. Ici, utilise le bouton gauche.");
  } else {
    mauvaisClic("C'était le bouton gauche. Ici, utilise le bouton droit.");
  }
}

function bonClic() {
  const { element } = cibleEnCours;
  cibleEnCours = null; // la cible n'est plus active : les clics suivants sont ignorés

  element.classList.add("touchee"); // animation de disparition
  ciblesTouchees++;
  afficherCompteur();

  const index = Math.floor(Math.random() * FELICITATIONS.length);
  afficherMessage(message, FELICITATIONS[index], "succes");

  // On attend la fin de l'animation (0,25 s) avant la suite
  suiteEnAttente = setTimeout(() => {
    element.remove();
    if (ciblesTouchees < mancheEnCours().nombre) {
      creerCible();
    } else {
      terminerManche();
    }
  }, 250);
}

function mauvaisClic(texte) {
  const { element } = cibleEnCours;

  // La cible tremble : une animation jouée une seule fois par le JS,
  // sans toucher à l'animation d'apparition définie dans le CSS
  element.animate(
    [
      { translate: "0" },
      { translate: "-6px" },
      { translate: "6px" },
      { translate: "0" },
    ],
    { duration: 300 },
  );

  afficherMessage(message, texte, "attention");
}

// Appelée quand toutes les cibles de la manche sont touchées
function terminerManche() {
  const niveau = niveauEnCours();
  numeroManche++;
  afficherMessage(message, "");

  // 1. Il reste des manches dans ce niveau
  if (numeroManche < niveau.manches.length) {
    afficherEcran(
      "Exercice terminé",
      "Bravo ! Le prochain exercice est un peu plus difficile.",
      "Exercice suivant",
      demarrerManche,
    );
    return;
  }

  // 2. Le niveau est terminé : on le note, la coche ✓ apparaît sur l'onglet
  niveauxFaits.add(numeroNiveau);
  afficherOnglets();

  // 3. Les 3 niveaux sont réussis, dans n'importe quel ordre
  if (niveauxFaits.size === NIVEAUX.length) {
    afficherFin();
    return;
  }

  // 4. Sinon, on propose le premier niveau pas encore réussi
  const suivant = NIVEAUX.findIndex((_, index) => !niveauxFaits.has(index));

  afficherEcran(
    `${niveau.nom} : réussi !`,
    `Prochaine étape : ${NIVEAUX[suivant].titre.toLowerCase()}.`,
    "Niveau suivant",
    () => {
      numeroNiveau = suivant;
      presenterNiveau();
    },
  );
}

// L'écran de fin : bravo, récapitulatif des 3 clics,
// « Recommencer » ou « Activité suivante »
function afficherFin() {
  afficherEcran(
    "Bravo, tu as réussi tous les niveaux !",
    "Voici ce que tu as appris :",
    "Recommencer",
    () => {
      niveauxFaits.clear();
      numeroNiveau = 0;
      presenterNiveau();
    },
  );

  // Une carte par clic, de la couleur du clic (grâce à data-bouton)
  const cartes = NIVEAUX.map((niveau) => {
    const nom = document.createElement("strong");
    nom.textContent = niveau.nom;

    const resume = document.createElement("span");
    resume.append(...texteAvecGras(niveau.resume));

    const carte = document.createElement("li");
    carte.dataset.bouton = niveau.clic;
    carte.append(nom, resume);
    return carte;
  });
  recap.replaceChildren(...cartes);

  recap.hidden = false;
  lienSuivant.hidden = false;
}

// Un seul écouteur sur la zone, pour toutes les cibles
zone.addEventListener("click", (evenement) => {
  if (evenement.target.closest(".cible")) {
    reagirAuClic("gauche", evenement);
  }
});

zone.addEventListener("contextmenu", (evenement) => {
  evenement.preventDefault(); // pas de menu du navigateur dans la zone de jeu
  if (evenement.target.closest(".cible")) {
    reagirAuClic("droit", evenement);
  }
});

// ---------- 7. Le mouvement des cibles ----------
// requestAnimationFrame demande au navigateur d'appeler une fonction
// juste avant d'afficher la prochaine image (environ 60 fois par seconde).
// En se rappelant elle-même, la fonction tourne en boucle.

let dernierTemps = performance.now();

function deplacerCible(temps) {
  // Temps écoulé depuis la dernière image, ramené à 1 pour 60 images/s :
  // la cible va à la même vitesse sur un écran à 60 Hz ou à 120 Hz.
  // Math.min évite un grand saut au retour sur l'onglet du navigateur.
  const facteur = Math.min((temps - dernierTemps) / (1000 / 60), 3);
  dernierTemps = temps;

  const cible = cibleEnCours;
  if (cible && (cible.vx !== 0 || cible.vy !== 0)) {
    const maxX = zone.clientWidth - cible.taille;
    const maxY = zone.clientHeight - cible.taille;

    cible.x += cible.vx * facteur;
    cible.y += cible.vy * facteur;

    // Rebond : si la cible touche un bord, on inverse sa direction
    if (cible.x <= 0 || cible.x >= maxX) cible.vx *= -1;
    if (cible.y <= 0 || cible.y >= maxY) cible.vy *= -1;

    // On la garde dans la zone (utile si la fenêtre change de taille)
    cible.x = Math.min(Math.max(cible.x, 0), maxX);
    cible.y = Math.min(Math.max(cible.y, 0), maxY);

    cible.element.style.left = `${cible.x}px`;
    cible.element.style.top = `${cible.y}px`;
  }

  requestAnimationFrame(deplacerCible);
}

// ---------- 8. Démarrage ----------
presenterNiveau();
requestAnimationFrame(deplacerCible);
