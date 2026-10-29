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
