const lettres = "abcdefghijklmnopqrstuvwxyz";

const touche = document.getElementById("modele");
const reponse = document.getElementById("reponse");
const message = document.getElementById("message");

let lettreActuelle = touche.textContent;
document.addEventListener("click", () => {
  reponse.focus();
});

function nouvelleLettre() {
  let nouvelle;
  do {
    nouvelle = lettres[Math.floor(Math.random() * lettres.length)];
  } while (nouvelle === lettreActuelle);
  lettreActuelle = nouvelle;
  touche.textContent = nouvelle;
}

reponse.addEventListener("input", () => {
  const saisie = reponse.value;

  if (saisie === lettreActuelle) {
    touche.classList.add("valide");
    reponse.classList.add("valide");
    reponse.value = "✓ Bravo !";
    setTimeout(() => {
      reponse.classList.remove("valide");
      nouvelleLettre();
      reponse.value = "";
      message.textContent = "";
      touche.classList.remove("valide");
    }, 1000);
  } else {
    touche.classList.add("invalide");
    reponse.classList.add("invalide");
    reponse.value = "";
    setTimeout(() => {
      touche.classList.remove("invalide");
      reponse.classList.remove("invalide");
    }, 400);
  }
});

nouvelleLettre();
