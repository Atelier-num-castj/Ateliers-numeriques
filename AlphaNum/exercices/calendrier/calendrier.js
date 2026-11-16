import {
  afficherMessage,
  espacesInsecables,
  melanger,
  sansAccents,
} from "../../../outils.js";

// =========================================================
// calendrier.js — exercices « Jours » et « Mois »
// Activité 1 : écrire chaque nom. Activité 2 : les remettre dans l'ordre.
// =========================================================

// ---------- 1. Les réglages ----------
const JOURS = [
  { nom: "lundi", couleur: "#e63946" },
  { nom: "mardi", couleur: "#f4a261" },
  { nom: "mercredi", couleur: "#e9c46a" },
  { nom: "jeudi", couleur: "#2a9d8f" },
  { nom: "vendredi", couleur: "#2378b4" },
  { nom: "samedi", couleur: "#7b5ea7" },
  { nom: "dimanche", couleur: "#d6336c" },
];

const MOIS = [
  { nom: "janvier", couleur: "#e63946" },
  { nom: "février", couleur: "#f4a261" },
  { nom: "mars", couleur: "#e9c46a" },
  { nom: "avril", couleur: "#2a9d8f" },
  { nom: "mai", couleur: "#2378b4" },
  { nom: "juin", couleur: "#7b5ea7" },
  { nom: "juillet", couleur: "#88ff00" },
  { nom: "août", couleur: "#ff7de9" },
  { nom: "septembre", couleur: "#ff6f1b" },
  { nom: "octobre", couleur: "#ff206a" },
  { nom: "novembre", couleur: "#ffdf2b" },
  { nom: "décembre", couleur: "#8bcfff" },
];

// L'adresse de la page dit quoi travailler : calendrier.html?niveau=mois
// Sans « ?niveau= » (ou avec une autre valeur), on prend les jours.
const parametres = new URLSearchParams(window.location.search);
const niveau = parametres.get("niveau") === "mois" ? "mois" : "jour";

// La liste à travailler, et les mots pour les messages
const LISTE = niveau === "mois" ? MOIS : JOURS;
const TOUS_LES_NOMS = niveau === "mois" ? "tous les mois" : "tous les jours";

// Les activités déjà réussies sont gardées dans le navigateur (localStorage)
const CLES = [
  `calendrier-${niveau}-activite-1`,
  `calendrier-${niveau}-activite-2`,
];

// Temps d'affichage du « Bravo » et de la secousse, en millisecondes
const PAUSE_BRAVO = 1000;
const DUREE_SECOUSSE = 400;

// ---------- 2. Les éléments de la page ----------
const onglets = document.querySelectorAll('[role="tab"]');
const panneaux = document.querySelectorAll('[role="tabpanel"]');
const carte = document.getElementById("carte");
const numero = document.getElementById("numero");
const modele = document.getElementById("modele");
const reponse = document.getElementById("reponse");
const consigneTexte = document.getElementById("consigne-text");
const messageOrdre = document.getElementById("message-ordre");
const tas = document.getElementById("tas");
const emplacements = document.getElementById("emplacements");
const boutonRecommencer = document.getElementById("recommencer");

// ---------- 3. L'état du jeu ----------
let indexTableau = 0; // position du nom à écrire dans LISTE
let dernierValide = ""; // ce qui est déjà bien tapé
let carteSelectionnee = null; // carte choisie dans l'activité « ordre »
let suiteEnAttente = null; // minuteur entre le « Bravo » et le nom suivant
let secousseEnAttente = null; // minuteur de la secousse (mauvaise lettre ou case)

// ---------- 4. Les onglets et les coches ----------
function afficherActivite(numeroActivite) {
  onglets.forEach((onglet, index) => {
    const actif = index === numeroActivite - 1;
    onglet.classList.toggle("actif", actif);
    onglet.setAttribute("aria-selected", actif);
  });
  panneaux.forEach((panneau, index) => {
    panneau.hidden = index !== numeroActivite - 1;
  });
}

onglets.forEach((onglet, index) => {
  onglet.addEventListener("click", () => afficherActivite(index + 1));
});

function afficherCoches() {
  onglets.forEach((onglet, index) => {
    const validee = localStorage.getItem(CLES[index]) === "valide";
    onglet.querySelector(".coche").hidden = !validee;
  });
}

function validerActivite(numeroActivite) {
  localStorage.setItem(CLES[numeroActivite - 1], "valide");
  afficherCoches();
}

function premiereActiviteNonValidee() {
  const index = CLES.findIndex((cle) => localStorage.getItem(cle) !== "valide");
  return index === -1 ? 1 : index + 1;
}

// ---------- 5. Activité 1 : écrire ----------

// Colore le modèle : vert = déjà tapé, orange = la lettre à taper
function majLettres() {
  const nombre = reponse.value.length;
  [...modele.children].forEach((lettre, index) => {
    lettre.classList.toggle("fait", index < nombre);
    lettre.classList.toggle("courante", index === nombre);
  });
}

function afficherTexte() {
  const element = LISTE[indexTableau];
  consigneTexte.textContent = niveau;
  carte.style.background = element.couleur;
  numero.textContent = indexTableau + 1;
  modele.replaceChildren(
    ...element.nom.split("").map((caractere) => {
      const lettre = document.createElement("span");
      lettre.textContent = caractere;
      return lettre;
    }),
  );
  dernierValide = "";
  reponse.value = "";
  majLettres();
}

reponse.addEventListener("input", () => {
  const nom = LISTE[indexTableau].nom;
  const saisie = reponse.value.toLowerCase();
  // Le début du mot attendu, de la même longueur que ce qui est tapé
  const debutAttendu = nom.slice(0, saisie.length);

  // On compare SANS les accents : taper "fe" est accepté pour "fé"
  if (sansAccents(saisie) !== sansAccents(debutAttendu)) {
    reponse.value = dernierValide;
    reponse.classList.add("invalide");
    majLettres();
    clearTimeout(secousseEnAttente);
    secousseEnAttente = setTimeout(() => {
      reponse.classList.remove("invalide");
    }, DUREE_SECOUSSE);
    return;
  }

  // On affiche la bonne orthographe : "fe" devient "fé"
  dernierValide = debutAttendu;
  reponse.value = debutAttendu;
  majLettres();

  if (debutAttendu === nom) {
    reponse.value = "✓ Bravo !";
    reponse.disabled = true;
    reponse.classList.add("valide");
    suiteEnAttente = setTimeout(nomSuivant, PAUSE_BRAVO);
  }
});

// Après le « Bravo » : le nom suivant, ou la fin de l'activité 1
function nomSuivant() {
  reponse.classList.remove("valide");
  reponse.disabled = false;
  indexTableau++;

  if (indexTableau >= LISTE.length) {
    indexTableau = 0;
    validerActivite(1);
    afficherActivite(2);
    afficherMessage(
      messageOrdre,
      espacesInsecables(
        `Bravo ! Tu as écrit ${TOUS_LES_NOMS}. Maintenant, remets-les dans l'ordre.`,
      ),
      "succes",
    );
  }

  afficherTexte();
  reponse.focus();
}

// Un clic n'importe où dans la page ramène le curseur dans la case
document.addEventListener("click", () => {
  reponse.focus();
});

// ---------- 6. Activité 2 : remettre dans l'ordre ----------
function genererEmplacements() {
  emplacements.replaceChildren(
    ...LISTE.map((element, index) => {
      const pastille = document.createElement("span");
      pastille.className = "numero";
      pastille.textContent = index + 1;

      const nom = document.createElement("span");
      nom.className = "nom";

      const emplacement = document.createElement("button");
      emplacement.type = "button";
      emplacement.className = "emplacement";
      emplacement.dataset.attendu = element.nom;
      emplacement.style.background = element.couleur;
      emplacement.append(pastille, nom);
      return emplacement;
    }),
  );
}

function genererCartes() {
  tas.replaceChildren(
    ...melanger(LISTE).map((element) => {
      const carteNom = document.createElement("button");
      carteNom.type = "button";
      carteNom.className = "carte";
      carteNom.dataset.nom = element.nom;
      carteNom.textContent = element.nom;
      return carteNom;
    }),
  );
}

// Un clic sur une carte du tas : on la choisit (ou on la repose)
tas.addEventListener("click", (evenement) => {
  const carteCliquee = evenement.target.closest(".carte");
  if (!carteCliquee) return;

  if (carteSelectionnee) {
    carteSelectionnee.classList.remove("selectionnee");
  }

  if (carteSelectionnee === carteCliquee) {
    carteSelectionnee = null;
  } else {
    carteSelectionnee = carteCliquee;
    carteCliquee.classList.add("selectionnee");
  }
});

// Un clic sur une case numérotée : on y pose la carte choisie
emplacements.addEventListener("click", (evenement) => {
  const emplacement = evenement.target.closest(".emplacement");
  if (!emplacement) return;
  if (emplacement.classList.contains("rempli")) return;
  if (!carteSelectionnee) return;

  if (carteSelectionnee.dataset.nom === emplacement.dataset.attendu) {
    emplacement.querySelector(".nom").textContent = emplacement.dataset.attendu;
    emplacement.classList.add("rempli");

    carteSelectionnee.remove();
    carteSelectionnee = null;
    afficherMessage(messageOrdre, "");

    verifierFin();
  } else {
    emplacement.classList.add("invalide");
    clearTimeout(secousseEnAttente);
    secousseEnAttente = setTimeout(() => {
      emplacement.classList.remove("invalide");
    }, DUREE_SECOUSSE);

    carteSelectionnee.classList.remove("selectionnee");
    carteSelectionnee = null;
  }
});

// Quand le tas est vide, l'activité 2 est réussie
function verifierFin() {
  if (tas.children.length > 0) return;

  validerActivite(2);
  afficherMessage(
    messageOrdre,
    espacesInsecables(`Bravo ! Tu as remis ${TOUS_LES_NOMS} dans l'ordre.`),
    "succes",
  );
}

// ---------- 7. Recommencer ----------
boutonRecommencer.addEventListener("click", () => {
  // Rien ne doit rester « en attente » de la partie précédente
  clearTimeout(suiteEnAttente);
  clearTimeout(secousseEnAttente);

  CLES.forEach((cle) => localStorage.removeItem(cle));
  afficherCoches();
  afficherActivite(1);
  afficherMessage(messageOrdre, "");

  indexTableau = 0;
  reponse.disabled = false;
  reponse.classList.remove("valide", "invalide");
  afficherTexte();

  genererCartes();
  genererEmplacements();
  carteSelectionnee = null;
});

// ---------- 8. Démarrage ----------
afficherTexte();
afficherCoches();
genererEmplacements();
genererCartes();
afficherActivite(premiereActiviteNonValidee());
