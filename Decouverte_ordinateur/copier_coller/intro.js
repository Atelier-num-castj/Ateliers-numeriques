const exercices = document.querySelectorAll(".exercice");
const bravo = document.getElementById("bravo");

document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();
  const texte = selection.toString().trim();

  if (texte === "") return;

  exercices.forEach((exercice) => {
    const phrase = exercice.querySelector(".phrase");
    const dansLaPhrase = phrase.contains(selection.anchorNode);

    if (dansLaPhrase && texte === exercice.dataset.cible) {
      exercice.classList.add("reussi");
    }
  });

  const reussis = document.querySelectorAll(".exercice.reussi").length;
  if (reussis === exercices.length) {
    bravo.hidden = false;
  }
});
