import { afficherMessage, espacesInsecables } from "../../../outils.js";

// =========================================================
// cibles.js — exercice « Apprendre à cliquer avec l'alphabet »
// Une cible à la fois, avec une lettre dedans, de A à Z.
// Construit sur le modèle de clic.js (Découvrir l'ordinateur).
// =========================================================

// ---------- 1. Les réglages ----------
// Les 26 lettres : [..."ABC"] découpe le texte en ["A", "B", "C"]
const LETTRES = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

// Diamètre des cibles en pixels (elles ne bougent pas)
const TAILLE_CIBLE = 120;

// Les messages de réussite, tirés au hasard pour varier
const FELICITATIONS = [
  "Bravo !",
  "Bien joué !",
  "Super !",
  "Parfait !",
  "Excellent !",
];

// ---------- 2. Les éléments de la page ----------
const zone = document.getElementById("zone");
const ecran = document.getElementById("ecran");
const ecranTitre = document.getElementById("ecran-titre");
const ecranTexte = document.getElementById("ecran-texte");
const ecranBouton = document.getElementById("ecran-bouton");
const texteCompteur = document.getElementById("compteur");
const message = document.getElementById("message");
const frise = document.getElementById("frise");

// ---------- 3. L'état du jeu ----------
let numeroLettre = 0; // position de la lettre à cliquer (0 = A)
let enJeu = false; // true pendant la partie, false sur l'écran du début ou de la fin
let cibleEnCours = null; // la cible affichée (null = aucune)
let suiteEnAttente = null; // minuteur entre une cible touchée et la suivante

// ---------- 4. L'affichage ----------

// La frise : une case par lettre.
// Vert = déjà trouvée, orange = celle à cliquer maintenant.
function afficherFrise() {
  const cases = LETTRES.map((lettre, index) => {
    const caseLettre = document.createElement("li");
    caseLettre.textContent = lettre;
    caseLettre.classList.toggle("trouvee", index < numeroLettre);
    caseLettre.classList.toggle("courante", enJeu && index === numeroLettre);
    return caseLettre;
  });
  frise.replaceChildren(...cases);
}

function afficherCompteur() {
  texteCompteur.textContent = `Lettre ${numeroLettre + 1} sur ${LETTRES.length}`;
}

// Affiche l'écran par-dessus la zone de jeu.
// « action » est la fonction lancée quand on clique sur le bouton.
function afficherEcran(titre, texte, texteBouton, action) {
  ecranTitre.textContent = titre;
  ecranTexte.textContent = espacesInsecables(texte);
  ecranBouton.textContent = texteBouton;
  ecranBouton.onclick = action;
  ecran.hidden = false;
  // Le focus permet de valider avec Entrée
  ecranBouton.focus({ preventScroll: true, focusVisible: false });
}

// ---------- 5. La partie ----------

// Lance (ou relance) la partie depuis la lettre A
function commencer() {
  clearTimeout(suiteEnAttente); // rien ne doit rester « en attente »
  zone.querySelectorAll(".cible").forEach((cible) => cible.remove());

  numeroLettre = 0;
  enJeu = true;
  ecran.hidden = true;
  afficherMessage(message, "");
  afficherFrise();
  afficherCompteur();
  creerCible();
}

function creerCible() {
  const lettre = LETTRES[numeroLettre];

  const cible = document.createElement("button");
  cible.type = "button";
  cible.className = "cible";
  cible.textContent = lettre;
  cible.style.setProperty("--taille", `${TAILLE_CIBLE}px`);

  // Une position au hasard, sans dépasser de la zone
  const x = Math.random() * (zone.clientWidth - TAILLE_CIBLE);
  const y = Math.random() * (zone.clientHeight - TAILLE_CIBLE);
  cible.style.left = `${x}px`;
  cible.style.top = `${y}px`;

  cibleEnCours = cible;
  zone.append(cible);
}

function bonClic() {
  const cible = cibleEnCours;
  cibleEnCours = null; // les clics suivants sur cette cible sont ignorés

  cible.classList.add("touchee"); // animation de disparition (CSS)
  numeroLettre++;
  afficherFrise();

  const index = Math.floor(Math.random() * FELICITATIONS.length);
  afficherMessage(message, FELICITATIONS[index], "succes");

  // On attend la fin de l'animation (0,25 s) avant la suite
  suiteEnAttente = setTimeout(() => {
    cible.remove();
    if (numeroLettre < LETTRES.length) {
      afficherCompteur();
      creerCible();
    } else {
      afficherFin();
    }
  }, 250);
}

// L'écran de fin, avec le bouton « Recommencer »
function afficherFin() {
  enJeu = false;
  afficherFrise(); // toute la frise est verte
  afficherMessage(message, "");
  afficherEcran(
    "Bravo, tu as fini l'alphabet !",
    "Tu as cliqué sur les 26 lettres, de A à Z.",
    "Recommencer",
    commencer,
  );
}

// ---------- 6. Les clics ----------
// Un seul écouteur sur la zone, pour toutes les cibles
zone.addEventListener("click", (evenement) => {
  if (cibleEnCours && evenement.target === cibleEnCours) {
    bonClic();
  }
});

// Clic droit : pas de menu du navigateur dans la zone de jeu,
// et un petit rappel si on a cliqué sur la cible
zone.addEventListener("contextmenu", (evenement) => {
  evenement.preventDefault();
  if (cibleEnCours && evenement.target === cibleEnCours) {
    afficherMessage(
      message,
      "C'était le bouton droit. Ici, utilise le bouton gauche.",
      "attention",
    );
  }
});

// ---------- 7. Démarrage ----------
texteCompteur.textContent = `${LETTRES.length} lettres`;
afficherFrise();
afficherEcran(
  "L'alphabet de A à Z",
  "Une lettre apparaît. Clique dessus avec le bouton gauche de la souris. Les lettres arrivent dans l'ordre : A, B, C…",
  "Commencer",
  commencer,
);
