const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TAILLES = [13, 26];

let niveau = 0,
  suivant = 0,
  pile = [];
let majuscule = true;

let aide = false;

const $ = (id) => document.getElementById(id);
const casseLettres = (l) => (majuscule ? l : l.toLowerCase());

function melanger(liste) {
  const t = [...liste];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

function demarrer() {
  const n = TAILLES[niveau];
  suivant = 0;
  pile = melanger(ALPHABET.slice(0, n).split(""));
  $("fin").hidden = true;
  $("zonePile").hidden = false;
  $("message").textContent = "";
  remplirActivite();
}

function remplirActivite() {
  const n = TAILLES[niveau];

  document
    .querySelectorAll("[data-niveau]")
    .forEach((b) =>
      b.classList.toggle("actif", Number(b.dataset.niveau) === niveau),
    );

  // Création de la ligne consigne
  $("consigne").innerHTML = "";

  const consigne = document.createElement("p");
  const lettreSuivante = document.createElement("span");
  lettreSuivante.className = "cible";
  lettreSuivante.textContent = casseLettres(ALPHABET[suivant]);

  if (aide) {
    consigne.append("Cherchez la lettre : ", lettreSuivante);
  } else if (suivant === 0) {
    consigne.append("Cherchez la lettre : ", lettreSuivante);
  } else {
    consigne.textContent = "Cherchez la lettre suivante";
  }

  $("consigne").appendChild(consigne);

  $("lettres-trouves").innerHTML = "";
  for (let i = 0; i < n; i++) {
    const lettre = document.createElement("div");
    lettre.className = "lettre-trouve";
    if (i < suivant) {
      lettre.classList.add("ok");
      lettre.textContent = casseLettres(ALPHABET[i]);
    } else if (i === suivant) {
      lettre.classList.add("prochaine");
    }
    $("lettres-trouves").appendChild(lettre);
  }

  // Ajout de la pile de tuile pour l'exercice

  $("pile").innerHTML = "";
  pile.forEach((lettre) => {
    const bouton = document.createElement("button");
    bouton.className = "tuile";
    bouton.textContent = casseLettres(lettre);
    bouton.addEventListener("click", () => choisir(lettre, bouton));
    $("pile").appendChild(bouton);
  });
}

function choisir(lettre, bouton) {
  if (lettre === ALPHABET[suivant]) {
    suivant++;
    pile = pile.filter((l) => l !== lettre);
    $("message").textContent = "Bravo";
    if (suivant === TAILLES[niveau]) {
      terminer();
    } else {
      remplirActivite();
    }
  } else {
    bouton.classList.add("faux");
    setTimeout(() => bouton.classList.remove("faux"), 400);
  }
}

function terminer() {
  remplirActivite();
  $("zonePile").hidden = true;
  $("consigne").textContent = "Toutes les lettres sont à leur place.";
  $("fin").hidden = false;
  $("bouton-suivant").hidden = niveau === TAILLES.length - 1;
  $("fin").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.querySelectorAll("[data-niveau]").forEach((b) =>
  b.addEventListener("click", () => {
    niveau = Number(b.dataset.niveau);
    demarrer();
  }),
);

$("bouton-aide").addEventListener("click", (e) => {
  aide = !aide;
  e.target.classList.toggle("actif", aide);
  remplirActivite();
});

$("bouton-casse").addEventListener("change", (e) => {
  majuscule = e.target.value === "majuscules";
  remplirActivite();
});
$("bouton-rejouer").addEventListener("click", demarrer);
$("bouton-suivant").addEventListener("click", () => {
  niveau++;
  demarrer();
});

demarrer();
