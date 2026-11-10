// =========================================================
// outils.js — petites fonctions partagées par tout le site
// ---------------------------------------------------------
// Pour les utiliser dans un exercice :
//   1. charger le script de l'exercice comme un module :
//      <script type="module" src="./exercice.js"></script>
//   2. en haut du fichier JS :
//      import { melanger } from "../../outils.js";
// =========================================================

/**
 * Mélange une liste au hasard (algorithme de Fisher-Yates).
 * Renvoie une NOUVELLE liste : la liste de départ n'est pas modifiée.
 *
 * Principe : on part de la fin, et on échange chaque case
 * avec une case tirée au hasard parmi celles qui restent.
 * Chaque ordre possible a exactement la même chance de sortir.
 */
export function melanger(liste) {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/**
 * Enlève les accents d'un texte : "février" → "fevrier".
 * Utile pour accepter une réponse tapée sans accent.
 *
 * normalize("NFD") sépare la lettre et son accent ("é" → "e" + "´"),
 * puis on supprime tous les accents (\p{Diacritic}).
 */
export function sansAccents(texte) {
  return texte.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/**
 * Lit un texte à voix haute en français avec la voix du navigateur.
 */
export function parler(texte) {
  const voix = new SpeechSynthesisUtterance(texte);
  voix.lang = "fr-FR";
  speechSynthesis.cancel(); // arrête une lecture déjà en cours
  speechSynthesis.speak(voix);
}

/**
 * Typographie française : met une espace insécable avant : ; ! ? »
 * et après «, pour qu'ils ne se retrouvent jamais seuls en début
 * ou en fin de ligne.
 * \u00a0 est le code de l'espace insécable (invisible à l'écran).
 */
export function espacesInsecables(texte) {
  return texte
    .replace(/ ([:;!?»])/g, "\u00a0$1")
    .replace(/« /g, "«\u00a0");
}

/**
 * Affiche un message dans un élément de la page.
 * type : "succes" (vert), "attention" (orange), "erreur" (rouge), ou rien.
 * Les autres classes de l'élément sont gardées : on ne change que le type.
 */
const TYPES_DE_MESSAGE = ["succes", "attention", "erreur"];

export function afficherMessage(element, texte, type = "") {
  element.textContent = texte;
  element.classList.remove(...TYPES_DE_MESSAGE);
  if (type) element.classList.add(type);
}

/**
 * Transforme "Ouvrir un **lien**" en : "Ouvrir un " + <strong>lien</strong>.
 * On découpe le texte à chaque ** : un morceau sur deux est en gras.
 * Les espaces insécables sont ajoutés au passage.
 * Renvoie une liste de morceaux à ajouter avec append() ou replaceChildren().
 */
export function texteAvecGras(texte) {
  return espacesInsecables(texte)
    .split("**")
    .map((morceau, index) => {
      if (index % 2 === 0) return morceau; // morceaux 0, 2, 4… : texte normal

      const gras = document.createElement("strong");
      gras.textContent = morceau; // morceaux 1, 3, 5… : en gras
      return gras;
    });
}
