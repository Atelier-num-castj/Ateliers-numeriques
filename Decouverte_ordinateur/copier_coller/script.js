import { niveaux } from "./niveaux.js";
import { afficherMessage } from "../../outils.js";

// ============ 1. L'ÉTAT DU JEU ============
let numeroNiveau = 0;
let niveau = niveaux[numeroNiveau];

const resultats = {}; // niveau en cours : { nom: "colle", telephone: "tape" }
const meilleursScores = {}; // tous les niveaux : { 0: 100, 2: 62 }

// ============ 2. LES ÉLÉMENTS DE LA PAGE ============
const message = document.getElementById("message");
const jauge = document.getElementById("jauge");
const remplissage = document.getElementById("jauge-remplissage");
const scoreTexte = document.getElementById("score");
const zoneMessages = document.getElementById("messages");
const formulaire = document.getElementById("formulaire");
const zoneSaisie = document.getElementById("zone-saisie");
const pagination = document.getElementById("pagination");
const boutonValider = document.getElementById("bouton-valider");

// ============ 3. L'AFFICHAGE ============
function construireConversation() {
  const contact = niveau.contact;
  const nomAffiche = contact.nom || contact.numero;

  document.getElementById("nom-contact").textContent = nomAffiche;
  document.getElementById("statut-contact").textContent = contact.statut || "";
  document.getElementById("numero-contact").textContent =
    contact.nom && contact.numero ? contact.numero : "";
  document.getElementById("avatar").textContent = contact.nom
    ? contact.nom.charAt(0).toUpperCase()
    : "?";

  niveau.messages.forEach((m) => {
    if (m.separateur) {
      const separateur = document.createElement("div");
      separateur.className = "separateur";
      separateur.textContent = m.separateur;
      zoneMessages.append(separateur);
      return;
    }

    const bulle = document.createElement("div");
    bulle.className = "bulle " + (m.de === "moi" ? "envoye" : "recu");

    const texte = document.createElement("div");
    texte.textContent = m.texte;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = m.heure;

    if (m.de === "moi") {
      const coches = document.createElement("span");
      coches.className = "coches";
      coches.textContent = " ✓✓";
      meta.append(coches);
    }

    bulle.append(texte, meta);
    zoneMessages.append(bulle);
  });

  zoneMessages.scrollTop = zoneMessages.scrollHeight;
}

function construireFormulaire() {
  niveau.elements.forEach((element) => {
    const bloc = document.createElement("div");
    bloc.className = "champ";

    const etiquette = document.createElement("label");
    etiquette.htmlFor = element.id;
    etiquette.textContent = element.etiquette;

    const champ = document.createElement("input");
    champ.id = element.id;
    champ.type = "text";
    champ.addEventListener("input", (event) => verifier(element, champ, event));

    bloc.append(etiquette, champ);
    formulaire.append(bloc);
  });
}

function construirePagination() {
  pagination.replaceChildren();

  niveaux.forEach((n, index) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = index + 1;
    bouton.title = n.titre;

    if (index === numeroNiveau) {
      bouton.classList.add("actif");
      bouton.setAttribute("aria-current", "step");
    }
    if (meilleursScores[index] !== undefined) {
      bouton.classList.add("fait");
    }

    bouton.addEventListener("click", () => chargerNiveau(index));
    pagination.append(bouton);
  });
}

// ============ 4. LA LOGIQUE ============
function calculerPourcentage() {
  const part = 100 / niveau.elements.length;
  let total = 0;

  Object.values(resultats).forEach((mode) => {
    total += mode === "colle" ? part : part / 2;
  });

  return Math.round(total);
}

function niveauTermine() {
  return Object.keys(resultats).length === niveau.elements.length;
}

// Rend deux textes comparables : sans majuscules, sans espaces en trop,
// sans ponctuation à la fin (. ! ? , ; :)
function normaliser(texte) {
  return texte
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // plusieurs espaces d'affilée → une seule
    .replace(/[.!?,;:]+$/, ""); // la ponctuation tout à la fin
}

// « attendu » peut être un texte, ou une liste de réponses acceptées
function estAttendu(valeur, attendu) {
  const reponses = Array.isArray(attendu) ? attendu : [attendu];
  return reponses.some((reponse) => normaliser(reponse) === normaliser(valeur));
}

function verifier(element, champ, event) {
  const colle = event.inputType === "insertFromPaste";

  if (estAttendu(champ.value, element.attendu)) {
    if (resultats[element.id] !== "colle") {
      resultats[element.id] = colle ? "colle" : "tape";
      if (colle) {
        afficherMessage(message, "Bravo ! Copier-coller réussi.", "succes");
      } else {
        afficherMessage(message, "C'est bien, mais il aurait fallu copier-coller !", "attention");
      }
    }
  } else {
    delete resultats[element.id];
    if (colle) {
      afficherMessage(message, 
        "Ce n'est pas le bon texte pour « " + element.etiquette + " ».",
        "erreur",
      );
    }
  }

  mettreAJourJauge();
}

function mettreAJourJauge() {
  const pourcentage = calculerPourcentage();

  remplissage.style.width = pourcentage + "%";
  scoreTexte.textContent = pourcentage + " %";
  jauge.setAttribute("aria-valuenow", pourcentage);
  boutonValider.disabled = !niveauTermine();

  if (niveauTermine() && pourcentage === 100) {
    afficherMessage(message, "Parfait : 100 % en copier-coller ! Tu peux valider.", "succes");
  } else if (niveauTermine()) {
    afficherMessage(message, 
      "Terminé : " +
        pourcentage +
        " %. Valide, ou recommence pour viser 100 %.",
      "attention",
    );
  }
}

function chargerNiveau(numero) {
  numeroNiveau = numero;
  niveau = niveaux[numero];

  Object.keys(resultats).forEach((id) => delete resultats[id]);
  zoneMessages.replaceChildren();
  formulaire.replaceChildren();
  afficherMessage(message, "");

  document.getElementById("titre").textContent = niveau.titre;
  document.getElementById("consigne").textContent = niveau.consigne;
  // Le bouton mène au couper-coller s'il ne reste plus aucun autre exercice à faire
  const autresRestants = niveaux.filter(
    (_, index) => index !== numeroNiveau && meilleursScores[index] === undefined,
  );
  boutonValider.textContent =
    autresRestants.length === 0
      ? "Terminer et passer au couper-coller →"
      : "Valider et continuer →";

  construireConversation();
  construireFormulaire();
  construirePagination();
  mettreAJourJauge();
}

// ============ 5. DÉMARRAGE ============
boutonValider.addEventListener("click", () => {
  const pourcentage = calculerPourcentage();
  meilleursScores[numeroNiveau] = Math.max(
    pourcentage,
    meilleursScores[numeroNiveau] || 0,
  );

  // Le premier exercice qui n'a pas encore de score (-1 s'ils en ont tous un)
  const suivant = niveaux.findIndex(
    (_, index) => meilleursScores[index] === undefined,
  );

  if (suivant === -1) {
    // Les 3 exercices sont faits : on passe à l'exercice suivant du parcours
    window.location.href = "./couper.html";
  } else {
    chargerNiveau(suivant);
  }
});

zoneSaisie.addEventListener("paste", (event) => {
  event.preventDefault();
  afficherMessage(message, "Colle dans la fiche, pas dans la conversation.", "erreur");
});

chargerNiveau(0);
