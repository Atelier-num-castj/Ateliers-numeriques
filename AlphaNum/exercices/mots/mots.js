const MOTS = [
  "bonjour",
  "bus",
  "voiture",
  "maman",
  "papa",
  "enfant",
  "femme",
  "homme",
  "veuve",
  "jour",
  "nuit",
  "demain",
  "hier",
  "chat",
  "chien",
  "lyon",
  "villeurbanne",
  "jardin",
  "canal",
  "nom",
  "prenom",
  "france",
  "adresse",
  "maison",
];

const modele = document.getElementById("modele");
const reponseMot = document.getElementById("reponse");
const compteur = document.getElementById("compteur");
let score = 0;

let motActuel = modele.textContent;
let motsRestants = [...MOTS];
let dernierValide = "";

document.addEventListener("click", () => {
  reponseMot.focus();
});

function nouveauMot() {
  if (motsRestants.length === 0) {
    motsRestants = [...MOTS];
  }

  const index = Math.floor(Math.random() * motsRestants.length);
  motActuel = motsRestants[index];
  motsRestants.splice(index, 1);
  return motActuel;
}

function majLettres() {
  const nb = reponseMot.value.length;
  [...modele.children].forEach((span, i) => {
    span.classList.toggle("fait", i < nb);
    span.classList.toggle("courante", i === nb);
  });
}

function afficherMot() {
  const mot = nouveauMot();

  modele.replaceChildren(
    ...mot.split("").map((lettre) => {
      const span = document.createElement("span");
      span.textContent = lettre;
      return span;
    }),
  );
  dernierValide = "";
  reponseMot.value = "";
  reponseMot.maxLength = mot.length;
  majLettres();
}

reponseMot.addEventListener("input", () => {
  const nom = motActuel;

  const saisie = reponseMot.value.toLowerCase();

  if (!nom.startsWith(saisie)) {
    reponseMot.value = dernierValide;
    reponseMot.classList.add("invalide");
    majLettres();
    setTimeout(() => {
      reponseMot.classList.remove("invalide");
    }, 400);
    return;
  }

  dernierValide = saisie;
  reponseMot.value = saisie;
  majLettres();

  if (saisie === nom) {
    reponseMot.value = "✓ Bravo !";
    reponseMot.disabled = true;
    reponseMot.classList.add("valide");
    score++;
    compteur.textContent = score;
    setTimeout(() => {
      reponseMot.classList.remove("valide");
      reponseMot.disabled = false;
      afficherMot();
      reponseMot.focus();
    }, 1000);
  }
});

afficherMot();
