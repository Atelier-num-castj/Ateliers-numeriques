const onglets = document.querySelectorAll('[role="tab"]');
const panneaux = document.querySelectorAll('[role="tabpanel"]');
const params = new URLSearchParams(window.location.search);
const niveau = params.get("niveau");

function afficherActivite(numero) {
  onglets.forEach((onglet, i) => {
    const actif = i === numero - 1;
    onglet.classList.toggle("actif", actif);
    onglet.setAttribute("aria-selected", actif);
  });
  panneaux.forEach((panneau, i) => {
    panneau.hidden = i !== numero - 1;
  });
}

onglets.forEach((onglet, i) => {
  onglet.addEventListener("click", () => afficherActivite(i + 1));
});

const CLES = ["activite-1", "activite-2"];

function afficherCoches() {
  onglets.forEach((onglet, i) => {
    const validee = localStorage.getItem(CLES[i]) === "valide";
    onglet.querySelector(".coche").hidden = !validee;
  });
}

function validerActivite(numero) {
  localStorage.setItem(CLES[numero - 1], "valide");
  afficherCoches();
  if (numero < panneaux.length) {
    afficherActivite(numero + 1);
  }
}

function premiereActiviteNonValidee() {
  const index = CLES.findIndex((cle) => localStorage.getItem(cle) !== "valide");
  return index === -1 ? 1 : index + 1;
}

document.getElementById("recommencer").addEventListener("click", () => {
  CLES.forEach((cle) => localStorage.removeItem(cle));
  afficherCoches();
  afficherActivite(1);
});

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
  { nom: "fevrier", couleur: "#f4a261" },
  { nom: "mars", couleur: "#e9c46a" },
  { nom: "avril", couleur: "#2a9d8f" },
  { nom: "mai", couleur: "#2378b4" },
  { nom: "juin", couleur: "#7b5ea7" },
  { nom: "juillet", couleur: "#88ff00" },
  { nom: "aout", couleur: "#ff7de9" },
  { nom: "septembre", couleur: "#ff6f1b" },
  { nom: "octobre", couleur: "#ff206a" },
  { nom: "novembre", couleur: "#ffdf2b" },
  { nom: "decembre", couleur: "#8bcfff" },
];

const carte = document.getElementById("carte");
const numero = document.getElementById("numero");
const modele = document.getElementById("modele");
const reponse = document.getElementById("reponse");
const message = document.getElementById("message");
const consigneActivité = document.getElementById("consigne-text");
const consigne = niveau;

document.addEventListener("click", () => {
  reponse.focus();
});

let indexTableau = 0;
let dernierValide = "";

function majLettres() {
  const nb = reponse.value.length;
  [...modele.children].forEach((span, i) => {
    span.classList.toggle("fait", i < nb);
    span.classList.toggle("courante", i === nb);
  });
}

function afficherTexte() {
  consigneActivité.textContent = consigne;
  const texte = niveau === "jour" ? JOURS[indexTableau] : MOIS[indexTableau];
  carte.style.background = texte.couleur;
  numero.textContent = indexTableau + 1;
  modele.replaceChildren(
    ...texte.nom.split("").map((lettre) => {
      const span = document.createElement("span");
      span.textContent = lettre;
      return span;
    }),
  );
  dernierValide = "";
  reponse.value = "";
  reponse.maxLength = texte.nom.length;
  message.textContent = "";
  majLettres();
}

reponse.addEventListener("input", () => {
  const nom =
    niveau === "jour" ? JOURS[indexTableau].nom : MOIS[indexTableau].nom;
  const saisie = reponse.value.toLowerCase();

  if (!nom.startsWith(saisie)) {
    reponse.value = dernierValide;
    message.textContent = "✗ Encore";
    message.classList.add("invalide");
    majLettres();
    setTimeout(() => {
      message.textContent = "";
      message.classList.remove("invalide");
    }, 1000);
    return;
  }

  dernierValide = saisie;
  reponse.value = saisie;
  message.textContent = "";
  majLettres();

  if (saisie === nom) {
    message.textContent = "✓ Bravo !";
    reponse.disabled = true;
    message.classList.add("valide");
    setTimeout(() => {
      message.classList.remove("valide");
      indexTableau++;
      if (
        niveau === "jour"
          ? indexTableau >= JOURS.length
          : indexTableau >= MOIS.length
      ) {
        validerActivite(1);
        indexTableau = 0;
      }
      reponse.disabled = false;
      afficherTexte();
      reponse.focus();
    }, 1000);
  }
});

// activité ordre

const emplacements = document.getElementById("emplacements");
const tas = document.getElementById("tas");

function genererEmplacements() {
  const tableau = niveau === "jour" ? JOURS : MOIS;
  console.log(tableau);
  console.log(emplacements);

  emplacements.replaceChildren(
    ...tableau.map((item, i) => {
      const bouton = document.createElement("button");
      const span = document.createElement("span");
      span.textContent = i + 1;
      span.className = "numero";
      bouton.type = "button";
      bouton.className = "emplacement";
      bouton.dataset.attendu = item.nom;
      bouton.style.background = item.couleur;
      bouton.appendChild(span);
      return bouton;
    }),
  );
}

function melanger(tableau) {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

function genererCartes() {
  const tableau = niveau === "jour" ? JOURS : MOIS;

  const tableauMelanges = melanger(tableau);

  tas.replaceChildren(
    ...tableauMelanges.map((item) => {
      const bouton = document.createElement("button");
      bouton.type = "button";
      bouton.className = "carte";
      bouton.dataset.nom = item.nom;
      bouton.textContent = item.nom;
      return bouton;
    }),
  );
}

document.getElementById("ecouter").addEventListener("click", () => {
  const son = new SpeechSynthesisUtterance(
    niveau === "jour" ? JOURS[indexTableau].nom : MOIS[indexTableau].nom,
  );
  son.lang = "fr-FR";
  speechSynthesis.cancel();
  speechSynthesis.speak(son);
});

// Au chargement de la page
afficherTexte();
afficherCoches();
genererEmplacements();
genererCartes();
afficherActivite(premiereActiviteNonValidee());
