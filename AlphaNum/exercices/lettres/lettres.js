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
    message.classList.add("valide");
    message.textContent = "✓ Bravo !";
    setTimeout(() => {
      nouvelleLettre();
      reponse.value = "";
      message.textContent = "";
      message.classList.remove("valide");
      touche.classList.remove("valide");
    }, 1000);
  } else {
    touche.classList.add("invalide");
    message.classList.add("invalide");
    message.textContent = "✗ Encore";
    reponse.value = "";
    setTimeout(() => {
      touche.classList.remove("invalide");
      message.classList.remove("invalide");
    }, 1000);
  }
});

nouvelleLettre();
