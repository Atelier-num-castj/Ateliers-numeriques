// =========================================================
// lettres.js — exercice « Lettres » : trouver la touche du clavier
// =========================================================

// ---------- 1. Les réglages ----------
const LETTRES = "abcdefghijklmnopqrstuvwxyz";

// Temps d'affichage du « Bravo » et de la secousse, en millisecondes
const PAUSE_BRAVO = 1000;
const DUREE_SECOUSSE = 400;

// ---------- 2. Les éléments de la page ----------
const touche = document.getElementById("modele");
const reponse = document.getElementById("reponse");
const compteur = document.getElementById("compteur");

// ---------- 3. L'état du jeu ----------
let score = 0;
let lettreActuelle = "";
let suiteEnAttente = null; // minuteur entre le « Bravo » et la lettre suivante
let secousseEnAttente = null; // minuteur de la secousse (mauvaise lettre)

// ---------- 4. Le jeu ----------

// Tire une lettre au hasard, différente de la précédente
function nouvelleLettre() {
  let nouvelle;
  do {
    nouvelle = LETTRES[Math.floor(Math.random() * LETTRES.length)];
  } while (nouvelle === lettreActuelle);
  lettreActuelle = nouvelle;
  touche.textContent = nouvelle;
}

reponse.addEventListener("input", () => {
  const saisie = reponse.value.toLowerCase();

  if (saisie === lettreActuelle) {
    reponse.value = "✓ Bravo !";
    // La case est bloquée pendant le « Bravo » : une touche tapée
    // à ce moment-là ne compte pas comme une erreur
    reponse.disabled = true;
    reponse.classList.add("valide");
    score++;
    compteur.textContent = score;

    suiteEnAttente = setTimeout(() => {
      reponse.classList.remove("valide");
      reponse.disabled = false;
      reponse.value = "";
      nouvelleLettre();
      reponse.focus();
    }, PAUSE_BRAVO);
  } else {
    reponse.value = "";
    reponse.classList.add("invalide");
    clearTimeout(secousseEnAttente);
    secousseEnAttente = setTimeout(() => {
      reponse.classList.remove("invalide");
    }, DUREE_SECOUSSE);
  }
});

// Un clic n'importe où dans la page ramène le curseur dans la case
document.addEventListener("click", () => {
  reponse.focus();
});

// ---------- 5. Démarrage ----------
nouvelleLettre();
