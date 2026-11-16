import { melanger } from "../../../outils.js";

// =========================================================
// alphabet.js — exercice « Le jeu de l'alphabet »
// Remettre les lettres dans l'ordre, à la souris ou au clavier.
// =========================================================

// ---------- 1. Les réglages ----------
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Le nombre de lettres de chaque niveau : A à M, puis A à Z
const TAILLES = [13, 26];

// Durée de la secousse d'une mauvaise tuile, en millisecondes
const DUREE_SECOUSSE = 400;

// ---------- 2. Les éléments de la page ----------
const boutonsNiveau = document.querySelectorAll("[data-niveau]");
const boutonAide = document.getElementById("bouton-aide");
const choixCasse = document.getElementById("bouton-casse");
const consigne = document.getElementById("consigne");
const message = document.getElementById("message");
const lettresTrouvees = document.getElementById("lettres-trouves");
const zonePile = document.getElementById("zonePile");
const zoneTuiles = document.getElementById("pile");
const fin = document.getElementById("fin");
const boutonRejouer = document.getElementById("bouton-rejouer");
const boutonSuivant = document.getElementById("bouton-suivant");

// ---------- 3. L'état du jeu ----------
let niveau = 0; // position du niveau dans TAILLES
let suivant = 0; // position de la prochaine lettre à trouver dans ALPHABET
let pile = []; // les lettres qui restent à cliquer, mélangées
let majuscule = true; // false = les lettres sont affichées en minuscules
let aide = false; // true = la lettre à chercher est toujours montrée
let secousseEnAttente = null; // minuteur de la secousse (mauvaise tuile)

// Écrit la lettre en majuscule ou en minuscule, selon le choix
const casseLettres = (lettre) => (majuscule ? lettre : lettre.toLowerCase());

// ---------- 4. L'affichage ----------
function remplirActivite() {
  const nombre = TAILLES[niveau];

  boutonsNiveau.forEach((bouton) =>
    bouton.classList.toggle("actif", Number(bouton.dataset.niveau) === niveau),
  );

  // La consigne : on montre la lettre à chercher pour la première,
  // ou tout le temps si l'aide est activée.
  // Quand tout est trouvé, il n'y a plus de lettre à chercher :
  // on ne prépare rien, terminer() écrira le message de fin.
  const phrase = document.createElement("p");
  if (suivant < nombre) {
    if (aide || suivant === 0) {
      const lettreSuivante = document.createElement("span");
      lettreSuivante.className = "cible";
      lettreSuivante.textContent = casseLettres(ALPHABET[suivant]);
      phrase.append("Cherche la lettre : ", lettreSuivante);
    } else {
      phrase.textContent = "Cherche la lettre suivante";
    }
  }
  consigne.replaceChildren(phrase);

  // Les cases des lettres trouvées : une case par lettre du niveau
  const cases = [];
  for (let index = 0; index < nombre; index++) {
    const caseLettre = document.createElement("div");
    caseLettre.className = "lettre-trouve";
    if (index < suivant) {
      caseLettre.classList.add("ok");
      caseLettre.textContent = casseLettres(ALPHABET[index]);
    } else if (index === suivant) {
      caseLettre.classList.add("prochaine");
    }
    cases.push(caseLettre);
  }
  lettresTrouvees.replaceChildren(...cases);

  // Les tuiles à cliquer
  const tuiles = pile.map((lettre) => {
    const tuile = document.createElement("button");
    tuile.type = "button";
    tuile.className = "tuile";
    tuile.dataset.lettre = lettre;
    tuile.textContent = casseLettres(lettre);
    tuile.addEventListener("click", () => choisir(lettre, tuile));
    return tuile;
  });
  zoneTuiles.replaceChildren(...tuiles);
}

// ---------- 5. Le jeu ----------
function demarrer() {
  suivant = 0;
  pile = melanger(ALPHABET.slice(0, TAILLES[niveau]).split(""));
  fin.hidden = true;
  zonePile.hidden = false;
  message.textContent = "";
  remplirActivite();
}

function choisir(lettre, tuile) {
  if (lettre === ALPHABET[suivant]) {
    suivant++;
    pile = pile.filter((autre) => autre !== lettre);
    message.textContent = "Bravo";
    if (suivant === TAILLES[niveau]) {
      terminer();
    } else {
      remplirActivite();
    }
  } else {
    tuile.classList.add("faux");
    clearTimeout(secousseEnAttente);
    secousseEnAttente = setTimeout(
      () => tuile.classList.remove("faux"),
      DUREE_SECOUSSE,
    );
  }
}

function terminer() {
  remplirActivite();
  zonePile.hidden = true;
  consigne.textContent = "Toutes les lettres sont à leur place.";
  fin.hidden = false;
  boutonSuivant.hidden = niveau === TAILLES.length - 1;
  fin.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- 6. Les boutons et le clavier ----------
boutonsNiveau.forEach((bouton) =>
  bouton.addEventListener("click", () => {
    niveau = Number(bouton.dataset.niveau);
    demarrer();
  }),
);

// On peut aussi jouer au clavier : taper une lettre = cliquer sur sa tuile
document.addEventListener("keydown", (evenement) => {
  if (evenement.repeat) return; // touche restée enfoncée
  if (evenement.ctrlKey || evenement.altKey || evenement.metaKey) return;
  if (document.activeElement === choixCasse) return; // on choisit dans la liste

  const lettre = evenement.key.toUpperCase();
  if (lettre.length !== 1 || !ALPHABET.includes(lettre)) return;

  const tuile = zoneTuiles.querySelector(`.tuile[data-lettre="${lettre}"]`);
  if (tuile) choisir(lettre, tuile);
});

boutonAide.addEventListener("click", () => {
  aide = !aide;
  boutonAide.classList.toggle("actif", aide);
  remplirActivite();
});

choixCasse.addEventListener("change", () => {
  majuscule = choixCasse.value === "majuscules";
  remplirActivite();
});

boutonRejouer.addEventListener("click", demarrer);

boutonSuivant.addEventListener("click", () => {
  niveau++;
  demarrer();
});

// ---------- 7. Démarrage ----------
demarrer();
