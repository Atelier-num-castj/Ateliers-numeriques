const sonsSimples = [
  "ba",
  "be",
  "bi",
  "bo",
  "bu",
  "ca",
  "co",
  "cu",
  "da",
  "de",
  "di",
  "do",
  "du",
  "fa",
  "fe",
  "fi",
  "fo",
  "fu",
  "ja",
  "je",
  "ji",
  "jo",
  "ju",
  "la",
  "le",
  "li",
  "lo",
  "lu",
  "ma",
  "me",
  "mi",
  "mo",
  "mu",
  "na",
  "ne",
  "ni",
  "no",
  "nu",
  "pa",
  "pe",
  "pi",
  "po",
  "pu",
  "ra",
  "re",
  "ri",
  "ro",
  "ru",
  "sa",
  "se",
  "si",
  "so",
  "su",
  "ta",
  "te",
  "ti",
  "to",
  "tu",
  "va",
  "ve",
  "vi",
  "vo",
  "vu",
  "an",
  "en",
  "in",
  "on",
  "un",
  "ai",
  "ou",
  "oi",
  "eu",
  "au",
];

const sonsComplexes = [
  "ban",
  "van",
  "dan",
  "gan",
  "man",
  "tan",
  "san",
  "ben",
  "ven",
  "den",
  "men",
  "sen",
  "ren",
  "bon",
  "ton",
  "son",
  "mon",
  "non",
  "don",
  "vin",
  "min",
  "fin",
  "sin",
  "pin",
  "bau",
  "sau",
  "jau",
  "peu",
  "jeu",
  "feu",
  "leu",
  "mai",
  "vai",
  "fai",
  "sou",
  "vou",
  "nou",
  "bou",
  "moi",
  "toi",
  "soi",
];

const params = new URLSearchParams(window.location.search);
const niveau = params.get("niveau");
const son = document.getElementById("modele");
const reponse = document.getElementById("reponse");
const compteur = document.getElementById("compteur");
let score = 0;

let sonActuel = "";
let sonsRestants =
  niveau === "complexes" ? [...sonsComplexes] : [...sonsSimples];
let dernierValide = "";

document.addEventListener("click", () => {
  reponse.focus();
});

function nouveauSon() {
  if (sonsRestants.length === 0) {
    sonsRestants = [...sonsSimples];
  }
  const index = Math.floor(Math.random() * sonsRestants.length);
  sonActuel = sonsRestants[index];
  sonsRestants.splice(index, 1);
  return sonActuel;
}

function majLettres() {
  const nb = reponse.value.length;
  [...son.children].forEach((span, i) => {
    span.classList.toggle("fait", i < nb);
    span.classList.toggle("courante", i === nb);
  });
}

function afficherSon() {
  const s = nouveauSon();
  son.replaceChildren(
    ...s.split("").map((lettre) => {
      const span = document.createElement("span");
      span.textContent = lettre;
      return span;
    }),
  );
  dernierValide = "";
  reponse.value = "";
  majLettres();
}

reponse.addEventListener("input", () => {
  const saisie = reponse.value.toLowerCase();

  if (!sonActuel.startsWith(saisie)) {
    reponse.value = dernierValide;
    reponse.classList.add("invalide");
    majLettres();
    setTimeout(() => {
      reponse.classList.remove("invalide");
    }, 400);
    return;
  }

  dernierValide = saisie;
  reponse.value = saisie;
  majLettres();

  if (saisie === sonActuel) {
    reponse.value = "✓ Bravo !";
    reponse.disabled = true;
    reponse.classList.add("valide");
    reponse.disabled = true;
    score++;
    compteur.textContent = score;
    setTimeout(() => {
      reponse.classList.remove("valide");
      reponse.disabled = false;
      afficherSon();
      reponse.focus();
    }, 1000);
  }
});

afficherSon();
