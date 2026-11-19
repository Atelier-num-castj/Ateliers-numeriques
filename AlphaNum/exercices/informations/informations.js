import { afficherMessage, espacesInsecables } from "../../../outils.js";

// =========================================================
// informations.js — exercice « Mes informations »
// La personne écrit ses vraies informations, une case à la fois.
// Quand une case est remplie, elle devient une ligne de texte
// et la case suivante apparaît.
// Rien n'est vérifié ni gardé : l'animateur relit avec la personne.
// =========================================================

// ---------- 1. Les réglages ----------
// Les étapes, dans l'ordre de la fiche.
//   cle        : le nom de l'information (sert aussi pour l'id de la case)
//   picto      : le pictogramme devant le mot
//   etiquette  : le mot écrit sur la ligne remplie et sur la ligne à venir
//   question   : le texte au-dessus de la case
//   typeCase   : le type de la case (facultatif, "text" par défaut)
//   clavier    : le clavier à montrer sur téléphone (facultatif)
//   femmeHomme : true = l'étape spéciale avec les deux dessins
const ETAPES = [
  { cle: "nom", picto: "👤", etiquette: "Nom", question: "Ton nom" },
  { cle: "prenom", picto: "🙂", etiquette: "Prénom", question: "Ton prénom" },
  { cle: "femme-homme", picto: "👩 👨", etiquette: "Femme / Homme", femmeHomme: true },
  { cle: "age", picto: "🎂", etiquette: "Âge", question: "Ton âge", clavier: "numeric" },
  { cle: "ville", picto: "🏠", etiquette: "Ville", question: "Ta ville" },
  {
    cle: "telephone",
    picto: "📞",
    etiquette: "Téléphone",
    question: "Ton numéro de téléphone",
    typeCase: "tel",
  },
];

const MESSAGES = {
  caseVide: "Écris dans la case, puis clique sur Suivant.",
  aucunMot: "Écris le mot sous le bon dessin.",
  deuxMots: "Écris dans une seule case.",
  fin: "✓ Bravo ! Tu as rempli ta fiche. Montre ton écran à l'animateur.",
};

// ---------- 2. Les éléments de la page ----------
const lignes = document.getElementById("lignes");
const message = document.getElementById("message");
const boutonRecommencer = document.getElementById("bouton-recommencer");
const modeleCase = document.getElementById("modele-case");
const modeleFemmeHomme = document.getElementById("modele-femme-homme");
const modeleRempli = document.getElementById("modele-rempli");

// ---------- 3. L'état de l'exercice ----------
// Les réponses, rangées par clé : { nom: { texte: "Benali" }, … }
// Pour femme / homme, on garde aussi le dessin choisi : { texte, picto }
let reponses = {};
let enCours = 0; // position de l'étape en train d'être remplie (-1 = fiche finie)
let aide = false; // true = les mots « Femme » et « Homme » sont montrés

// Copie le contenu d'un <template> (le <li> qu'il contient)
const copier = (modele) => modele.content.firstElementChild.cloneNode(true);

// ---------- 4. L'affichage ----------
// On reconstruit toute la fiche à chaque changement :
// c'est plus simple que de modifier les lignes une par une.
function afficherFiche() {
  const elements = ETAPES.map((etape, position) => {
    if (position === enCours) return creerCaseEnCours(etape);
    if (reponses[etape.cle]) return creerLigneRemplie(etape, position);
    return creerLigneAVenir(etape);
  });
  lignes.replaceChildren(...elements);

  // On met directement la souris dans la case à remplir
  // (dans la case déjà écrite, si on corrige femme / homme)
  const caseActive =
    lignes.querySelector(".en-cours .saisie:not(:placeholder-shown)") ??
    lignes.querySelector(".en-cours .saisie");
  caseActive?.focus();
}

// Une ligne grisée : l'information qui viendra plus tard
function creerLigneAVenir(etape) {
  const ligne = document.createElement("li");
  ligne.className = "a-venir";
  ligne.textContent = `${etape.picto} ${etape.etiquette}`;
  return ligne;
}

// Une ligne verte : l'information déjà écrite, avec le bouton « Changer »
function creerLigneRemplie(etape, position) {
  const ligne = copier(modeleRempli);
  const reponse = reponses[etape.cle];

  // Femme / homme : on montre seulement le dessin choisi et le mot écrit
  const etiquette = etape.femmeHomme
    ? `${reponse.picto} `
    : `${etape.picto} ${etape.etiquette} : `;
  ligne.querySelector(".etiquette").textContent = espacesInsecables(etiquette);
  ligne.querySelector(".valeur").textContent = reponse.texte;

  const boutonChanger = ligne.querySelector(".changer");
  boutonChanger.setAttribute("aria-label", `Changer : ${etape.etiquette}`);
  boutonChanger.addEventListener("click", () => {
    enCours = position;
    afficherMessage(message, "");
    boutonRecommencer.hidden = true;
    afficherFiche();
  });
  return ligne;
}

// La case à remplir (avec le cadre orange)
function creerCaseEnCours(etape) {
  if (etape.femmeHomme) return creerEtapeFemmeHomme(etape);

  const ligne = copier(modeleCase);
  const question = ligne.querySelector(".question");
  const saisie = ligne.querySelector(".saisie");

  // Le label est relié à sa case : cliquer sur le mot met la souris dedans
  saisie.id = `case-${etape.cle}`;
  question.htmlFor = saisie.id;
  question.textContent = `${etape.picto} ${etape.question}`;

  saisie.type = etape.typeCase ?? "text";
  if (etape.clavier) saisie.inputMode = etape.clavier;
  saisie.spellcheck = false; // pas de soulignement rouge sous les noms
  saisie.placeholder = " "; // sert seulement à :placeholder-shown, dans afficherFiche()
  saisie.value = reponses[etape.cle]?.texte ?? ""; // si on corrige

  ligne.querySelector("form").addEventListener("submit", (evenement) => {
    evenement.preventDefault(); // la page ne doit pas se recharger
    const texte = saisie.value.trim();
    if (texte === "") {
      refuser(saisie, MESSAGES.caseVide);
      return;
    }
    valider(etape, { texte });
  });
  return ligne;
}

// L'étape femme / homme : écrire le mot sous le bon dessin
function creerEtapeFemmeHomme(etape) {
  const ligne = copier(modeleFemmeHomme);
  const saisies = [...ligne.querySelectorAll(".saisie")];
  const modelesAide = ligne.querySelectorAll(".modele-aide");
  const boutonAide = ligne.querySelector(".aide");

  saisies.forEach((saisie) => {
    saisie.spellcheck = false;
    saisie.placeholder = " ";
    // Si on corrige : on remet le mot dans la case du dessin choisi
    if (reponses[etape.cle]?.picto === saisie.dataset.picto) {
      saisie.value = reponses[etape.cle].texte;
    }
  });

  // Le bouton Aide montre ou cache les mots, comme dans l'Alphabet
  const montrerAide = () => {
    modelesAide.forEach((modele) => (modele.hidden = !aide));
    boutonAide.classList.toggle("actif", aide);
    boutonAide.setAttribute("aria-pressed", String(aide));
  };
  montrerAide();
  boutonAide.addEventListener("click", () => {
    aide = !aide;
    montrerAide();
  });

  ligne.querySelector("form").addEventListener("submit", (evenement) => {
    evenement.preventDefault();
    const remplies = saisies.filter((saisie) => saisie.value.trim() !== "");
    if (remplies.length === 0) {
      refuser(saisies[0], MESSAGES.aucunMot);
      return;
    }
    if (remplies.length === 2) {
      refuser(saisies[0], MESSAGES.deuxMots);
      return;
    }
    const [saisie] = remplies;
    valider(etape, { texte: saisie.value.trim(), picto: saisie.dataset.picto });
  });
  return ligne;
}

// ---------- 5. Avancer dans la fiche ----------
function valider(etape, reponse) {
  reponses[etape.cle] = reponse;
  afficherMessage(message, "");

  // La suite : la première étape pas encore remplie, dans n'importe quel ordre
  // (après un « Changer », on revient là où on en était)
  enCours = ETAPES.findIndex((autre) => !reponses[autre.cle]);
  afficherFiche();

  if (enCours === -1) terminer();
}

// Case vide (ou deux mots) : la case tremble et un message explique
function refuser(saisie, texte) {
  afficherMessage(message, espacesInsecables(texte), "attention");
  const cadre = saisie.closest(".en-cours");
  cadre.classList.add("refuse");
  // On enlève la classe à la fin de la secousse, pour pouvoir la rejouer
  cadre.addEventListener(
    "animationend",
    () => cadre.classList.remove("refuse"),
    { once: true },
  );
  saisie.focus();
}

function terminer() {
  afficherMessage(message, espacesInsecables(MESSAGES.fin), "succes");
  boutonRecommencer.hidden = false;
  boutonRecommencer.focus();
}

// Tout vider, pour la personne suivante
function recommencer() {
  reponses = {};
  enCours = 0;
  aide = false;
  afficherMessage(message, "");
  boutonRecommencer.hidden = true;
  afficherFiche();
}

// ---------- 6. Démarrage ----------
boutonRecommencer.addEventListener("click", recommencer);
afficherFiche();
