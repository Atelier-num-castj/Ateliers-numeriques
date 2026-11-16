import { afficherMessage } from "../../outils.js";

// =========================================================
// deplacer.js — « Le chemin vers la maison »
// On suit un chemin avec la souris, sans cliquer.
// =========================================================

// ---------- 1. Les niveaux ----------
// Un niveau = un chemin, de plus en plus étroit et tordu.
//   largeur : la largeur du chemin (dans les unités du dessin : 800 × 500)
//   trace   : le dessin du chemin, écrit comme un <path> SVG
//   depart  : la position [x, y] du rond « DÉPART »
//   arrivee : la position [x, y] de la maison
const NIVEAUX = [
  // Niveau 1
  {
    largeur: 96,
    trace: "M110 250 L690 250",
    depart: [110, 250],
    arrivee: [690, 250],
  },
  // Niveau 2
  {
    largeur: 78,
    trace: "M110 380 C260 380 240 130 400 130 S540 370 690 370",
    depart: [110, 380],
    arrivee: [690, 370],
  },
  // Niveau 3
  {
    largeur: 60,
    trace: "M110 100 L300 100 L300 400 L500 400 L500 150 L690 150",
    depart: [110, 100],
    arrivee: [690, 150],
  },
  // Niveau 4
  {
    largeur: 46,
    trace: "M100 100 C400 100 400 250 200 250 C0 250 0 400 250 400 L690 400",
    depart: [100, 100],
    arrivee: [690, 400],
  },
  // Niveau 5
  {
    largeur: 42,
    trace:
      "M100 420 L100 330 L240 330 L240 240 L380 240 L380 150 L520 150 L520 80 L690 80",
    depart: [100, 420],
    arrivee: [690, 80],
  },
  // Niveau 6
  {
    largeur: 40,
    trace:
      "M100 90 L700 90 C760 90 760 190 700 190 L100 190 C40 190 40 290 100 290 L700 290 C760 290 760 390 700 390 L140 390",
    depart: [100, 90],
    arrivee: [140, 390],
  },
  // Niveau 7
  {
    largeur: 30,
    trace: "M100 420 L250 100 L400 420 L550 100 L690 420",
    depart: [100, 420],
    arrivee: [690, 420],
  },
  // Niveau 8
  {
    largeur: 30,
    trace:
      "M90 100 L90 400 A40 40 0 0 0 170 400 L170 100 A40 40 0 0 1 250 100 L250 400 A40 40 0 0 0 330 400 L330 100 A40 40 0 0 1 410 100 L410 400 A40 40 0 0 0 490 400 L490 100 A40 40 0 0 1 570 100 L570 400 A40 40 0 0 0 650 400 L650 100 A40 40 0 0 1 730 100 L730 380",
    depart: [90, 100],
    arrivee: [730, 380],
  },
];

const MESSAGES = {
  debut:
    "Mets la souris sur le rond « DÉPART », puis suis le chemin jusqu'à la maison.",
  enRoute: "C'est parti ! Reste sur le chemin et va jusqu'à la maison.",
  horsChemin:
    "Oups ! Tu es sorti du chemin. Reviens sur le rond « DÉPART » et recommence.",
  horsJeu:
    "Oups ! La souris est sortie du jeu. Reviens sur le rond « DÉPART ».",
  gagne: "Bravo ! 🎉 Tu es arrivé à la maison ! 🏠",
};

// Temps entre l'arrivée à la maison et l'ouverture de la fenêtre « Bravo »,
// en millisecondes
const PAUSE_AVANT_BRAVO = 600;

// Le trait orange garde seulement les derniers points du trajet
const LONGUEUR_DE_LA_TRACE = 400;

// ---------- 2. Les éléments de la page ----------
const dessin = document.getElementById("scene");
// Les 3 traits du chemin : le bord marron, le sable, les pointillés
const bordChemin = document.getElementById("bord-chemin");
const chemin = document.getElementById("chemin");
const pointilles = document.getElementById("pointilles");
const trace = document.getElementById("trace");
const fantomes = document.getElementById("fantomes");
const depart = document.getElementById("depart");
const departRond = document.getElementById("depart-rond");
const departTexte = document.getElementById("depart-texte");
const maison = document.getElementById("maison");
const maisonDessin = document.getElementById("maison-dessin");
const bandeau = document.getElementById("bandeau");
const bandeauTexte = document.getElementById("bandeau-texte");
const boutonSuivant = document.getElementById("bouton-suivant");
const choixNiveaux = document.getElementById("choix-niveaux");
const texteEssais = document.getElementById("essais");
const texteReussites = document.getElementById("reussites");
const fenetreBravo = document.getElementById("fenetre-bravo");
const fenetreBravoBouton = document.getElementById("fenetre-bravo-bouton");

// La personne a-t-elle demandé moins d'animations dans son système ?
const moinsAnimations = matchMedia("(prefers-reduced-motion: reduce)");

// ---------- 3. L'état du jeu ----------
let numeroNiveau = 0; // position du niveau en cours dans NIVEAUX
// etape : "attente" (attend le départ) | "enRoute" (sur le chemin) | "gagne" (arrivé)
let etape = "attente";
let essais = 0;
let reussites = 0;
let pointsTrace = []; // les points du trait orange : ["110,250", "112,250"…]
let bravoEnAttente = null; // minuteur avant l'ouverture de la fenêtre « Bravo »

// ---------- 4. Les outils ----------

// Joue une petite animation, sauf si la personne en veut moins
function animer(element, images, duree) {
  if (moinsAnimations.matches) return;
  element.animate(images, { duration: duree, easing: "ease-out" });
}

// Transforme une position de la souris à l'écran en position dans le dessin
function versLeDessin(clientX, clientY) {
  return new DOMPoint(clientX, clientY).matrixTransform(
    dessin.getScreenCTM().inverse(),
  );
}

// Affiche un message dans le bandeau.
// type : "succes" (fond vert), "erreur" (texte rouge), ou rien.
function dire(texte, type = "") {
  afficherMessage(bandeauTexte, texte, type === "erreur" ? "erreur" : "");
  bandeau.classList.toggle("reussi", type === "succes");
  boutonSuivant.hidden = true;
}

function effacerTrace() {
  pointsTrace = [];
  trace.setAttribute("points", "");
}

function remettreDepart() {
  departRond.setAttribute("fill", "#ffffff");
  departTexte.textContent = "DÉPART";
}

// ---------- 5. Le jeu ----------
function chargerNiveau(index) {
  const {
    largeur,
    trace: forme,
    depart: [departX, departY],
    arrivee: [arriveeX, arriveeY],
  } = NIVEAUX[index];

  clearTimeout(bravoEnAttente); // la fenêtre « Bravo » ne doit plus s'ouvrir
  fenetreBravo.close();

  numeroNiveau = index;
  etape = "attente";
  effacerTrace();
  fantomes.replaceChildren();
  remettreDepart();

  // Les 3 traits ont la même forme ; le bord est un peu plus large que le sable
  [bordChemin, chemin, pointilles].forEach((trait) =>
    trait.setAttribute("d", forme),
  );
  bordChemin.setAttribute("stroke-width", largeur + 12);
  chemin.setAttribute("stroke-width", largeur);
  depart.setAttribute("transform", `translate(${departX} ${departY})`);
  maison.setAttribute("transform", `translate(${arriveeX} ${arriveeY})`);

  choixNiveaux
    .querySelectorAll("button")
    .forEach((bouton, numero) =>
      bouton.setAttribute("aria-current", String(numero === index)),
    );

  dire(MESSAGES.debut);
}

// La souris arrive sur le rond « DÉPART »
function partir() {
  etape = "enRoute";
  essais++;
  texteEssais.textContent = `Essais : ${essais}`;
  departRond.setAttribute("fill", "#9be3b3");
  departTexte.textContent = "GO !";
  dire(MESSAGES.enRoute);
}

// La souris est sortie du chemin (ou du jeu) : un fantôme reste à cet endroit
function echouer(texte = MESSAGES.horsChemin) {
  if (etape !== "enRoute") return;
  etape = "attente";

  const dernierPoint = pointsTrace.at(-1);
  if (dernierPoint) {
    const [x, y] = dernierPoint.split(",");
    const fantome = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    fantome.textContent = "👻";
    fantome.setAttribute("x", x);
    fantome.setAttribute("y", y);
    fantomes.append(fantome);
  }

  effacerTrace();
  remettreDepart();
  dire(texte, "erreur");
  animer(
    bandeau,
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" },
    ],
    300,
  );
}

// La souris est arrivée à la maison
function gagner() {
  etape = "gagne";
  reussites++;
  texteReussites.textContent = `Réussites : ${reussites}`;
  remettreDepart();
  dire(MESSAGES.gagne, "succes");

  const dernierNiveau = numeroNiveau === NIVEAUX.length - 1;
  boutonSuivant.textContent = dernierNiveau
    ? "Recommencer le niveau 1"
    : "Niveau suivant";
  boutonSuivant.hidden = false;
  fenetreBravoBouton.textContent = boutonSuivant.textContent;

  // showModal() : la fenêtre s'ouvre au milieu de l'écran, le fond s'assombrit
  bravoEnAttente = setTimeout(() => {
    if (etape === "gagne") fenetreBravo.showModal();
  }, PAUSE_AVANT_BRAVO);

  animer(
    maisonDessin,
    [
      { transform: "scale(.85)" },
      { transform: "scale(1.2)" },
      { transform: "scale(1)" },
    ],
    500,
  );
}

// Ajoute un point au trait orange qui suit la souris
function prolongerTrace(clientX, clientY) {
  const { x, y } = versLeDessin(clientX, clientY);
  pointsTrace = [...pointsTrace, `${Math.round(x)},${Math.round(y)}`].slice(
    -LONGUEUR_DE_LA_TRACE,
  );
  trace.setAttribute("points", pointsTrace.join(" "));
}

function niveauSuivant() {
  const dernierNiveau = numeroNiveau === NIVEAUX.length - 1;
  chargerNiveau(dernierNiveau ? 0 : numeroNiveau + 1);
}

// ---------- 6. La souris ----------

// À chaque mouvement, on regarde ce qu'il y a sous la souris :
// data-role dit si c'est le départ, le chemin, la maison ou le fond.
function suivreLaSouris(evenement) {
  if (etape === "gagne") return;

  const { clientX, clientY } = evenement;
  const role = document.elementFromPoint(clientX, clientY)?.dataset.role;

  if (etape === "attente") {
    if (role === "depart") partir();
    return;
  }

  switch (role) {
    case "maison":
      gagner();
      break;
    case "depart":
    case "chemin":
      prolongerTrace(clientX, clientY);
      break;
    default:
      echouer();
  }
}

dessin.addEventListener("pointermove", suivreLaSouris);
dessin.addEventListener("pointerdown", suivreLaSouris);
dessin.addEventListener("pointerleave", () => echouer(MESSAGES.horsJeu));

// Pas de menu du clic droit dans ce jeu : on ne fait que déplacer la souris
document.addEventListener("contextmenu", (evenement) => {
  evenement.preventDefault();
});

// ---------- 7. Les boutons ----------
boutonSuivant.addEventListener("click", niveauSuivant);
fenetreBravoBouton.addEventListener("click", niveauSuivant);

// La touche Échap ferme normalement une fenêtre <dialog>.
// Ici on l'empêche : c'est le bouton qui lance la suite.
fenetreBravo.addEventListener("cancel", (evenement) => {
  evenement.preventDefault();
});

// Un bouton par niveau : 1, 2, 3…
choixNiveaux.append(
  ...NIVEAUX.map((_, index) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = index + 1;
    bouton.setAttribute("aria-label", `Niveau ${index + 1}`);
    bouton.addEventListener("click", () => chargerNiveau(index));
    return bouton;
  }),
);

// ---------- 8. Démarrage ----------
chargerNiveau(0);
