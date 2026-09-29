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
const messageMot = document.getElementById("message");

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
  messageMot.textContent = "";
  majLettres();
}

reponseMot.addEventListener("input", () => {
  const nom = motActuel;

  const saisie = reponseMot.value.toLowerCase();

  if (!nom.startsWith(saisie)) {
    reponseMot.value = dernierValide;
    messageMot.textContent = "✗ Encore";
    messageMot.classList.add("invalide");
    majLettres();
    setTimeout(() => {
      messageMot.textContent = "";
      messageMot.classList.remove("invalide");
    }, 1000);
    return;
  }

  dernierValide = saisie;
  reponseMot.value = saisie;
  messageMot.textContent = "";
  majLettres();

  if (saisie === nom) {
    messageMot.textContent = "✓ Bravo !";
    reponseMot.disabled = true;
    messageMot.classList.add("valide");
    setTimeout(() => {
      messageMot.classList.remove("valide");
      reponseMot.disabled = false;
      afficherMot();
      reponseMot.focus();
    }, 1000);
  }
});

afficherMot();
