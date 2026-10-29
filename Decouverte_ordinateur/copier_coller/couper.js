// ---------- Les données ----------
const postIts = [
  { id: "fruits", titre: "Fruits", emoji: "🍎", couleur: "#fff8b8" },
  { id: "alimentaire", titre: "Alimentaire", emoji: "🥫", couleur: "#ffd9e0" },
  { id: "boissons", titre: "Boissons", emoji: "🥤", couleur: "#d6ecff" },
  { id: "nettoyage", titre: "Nettoyage", emoji: "🧴", couleur: "#d9f5d3" },
];

const articles = [
  { texte: "🧼 savon", postIt: "nettoyage" },
  { texte: "🍎 pomme", postIt: "fruits" },
  { texte: "🍞 pain", postIt: "alimentaire" },
  { texte: "💧 eau", postIt: "boissons" },
  { texte: "🍌 banane", postIt: "fruits" },
  { texte: "🧽 éponge", postIt: "nettoyage" },
  { texte: "🍝 pâtes", postIt: "alimentaire" },
  { texte: "🥤 soda", postIt: "boissons" },
  { texte: "🍓 fraise", postIt: "fruits" },
  { texte: "🧴 lessive", postIt: "nettoyage" },
  { texte: "🧀 fromage", postIt: "alimentaire" },
  { texte: "🧃 jus", postIt: "boissons" },
];

// ---------- Les éléments de la page ----------
const zoneArticles = document.getElementById("articles");
const zonepostIts = document.getElementById("postIts");
const message = document.getElementById("message");
const jauge = document.getElementById("jauge");
const remplissage = document.getElementById("jauge-remplissage");
const scoreTexte = document.getElementById("score");

function afficher(texte, type) {
  message.textContent = texte;
  message.className = type;
}

// ---------- La liste de gauche ----------
articles.forEach((article) => {
  const champ = document.createElement("input");
  champ.className = "article";
  champ.value = article.texte;
  champ.spellcheck = false;
  champ.dataset.postIt = article.postIt;

  champ.addEventListener("input", () => {
    champ.classList.toggle("vide", champ.value.trim() === "");
    mettreAJour();
  });

  article.champ = champ; // on garde le lien entre l'article et son champ
  zoneArticles.append(champ);
});

// ---------- Les postIts de droite ----------
postIts.forEach((postIt) => {
  const carte = document.createElement("div");
  carte.className = "postIt";
  carte.style.setProperty("--papier", postIt.couleur);

  const entete = document.createElement("div");
  entete.className = "entete-postIt";

  const titre = document.createElement("h4");
  titre.textContent = postIt.emoji + " " + postIt.titre;

  const compteur = document.createElement("span");
  compteur.className = "compteur";
  postIt.compteur = compteur; // on garde le lien entre le postIt et son compteur

  const zone = document.createElement("textarea");
  zone.id = postIt.id;
  zone.placeholder = "Colle ici…";
  zone.spellcheck = false;

  zone.addEventListener("paste", (event) =>
    verifierCollage(event, postIt, zone),
  );
  zone.addEventListener("input", mettreAJour);

  entete.append(titre, compteur);
  carte.append(entete, zone);
  zonepostIts.append(carte);
});

// ---------- La vérification ----------
function verifierCollage(event, postIt, zone) {
  const texte = event.clipboardData.getData("text").trim();
  const article = articles.find((a) => a.texte === texte);

  if (!article) {
    afficher(
      "Ce n'est pas un article de la liste. Fais un triple-clic pour prendre toute la ligne.",
      "erreur",
    );
    return;
  }

  // Y a-t-il déjà du texte sur la ligne où l'on colle ?
  const avantLeCurseur = zone.value.slice(0, zone.selectionStart);
  const derniereLigne = avantLeCurseur.split("\n").pop();

  if (derniereLigne.trim() !== "") {
    afficher(
      "Appuie sur Entrée pour aller à la ligne : un article par ligne.",
      "attention",
    );
  } else if (article.postIt !== postIt.id) {
    afficher(
      "Oups : « " +
        texte +
        " » ne va pas sur le post-it « " +
        postIt.titre +
        " ».",
      "erreur",
    );
  } else if (article.champ.value.trim() === texte) {
    afficher(
      "Bon post-it, mais tu as copié ! L'article est encore dans la liste. Il faut couper : clic droit, puis 'Couper'.",
      "attention",
    );
  } else {
    afficher("Bravo ! " + texte + " est bien rangé.", "succes");
  }
}

// ---------- Ce qui est bien rangé ----------
function articlesBienRanges() {
  return articles.filter((article) => {
    const zone = document.getElementById(article.postIt);
    const lignes = zone.value.split("\n").map((ligne) => ligne.trim());
    return lignes.includes(article.texte);
  });
}

function mettreAJourCompteurs(bienRanges) {
  postIts.forEach((postIt) => {
    const attendus = articles.filter((a) => a.postIt === postIt.id);
    const nombre = bienRanges.filter((a) => a.postIt === postIt.id).length;
    const complet = attendus.length > 0 && nombre === attendus.length;

    postIt.compteur.textContent = nombre + " / " + attendus.length;
    postIt.compteur.classList.toggle("complet", complet);
  });
}

function mettreAJourJauge(bienRanges) {
  const part = 100 / articles.length;
  let total = 0;

  bienRanges.forEach((article) => {
    const coupe = article.champ.value.trim() === "";
    total += coupe ? part : part / 2;
  });

  const pourcentage = Math.round(total);
  remplissage.style.width = pourcentage + "%";
  scoreTexte.textContent = pourcentage + " %";
  jauge.setAttribute("aria-valuenow", pourcentage);

  if (bienRanges.length === articles.length) {
    if (pourcentage === 100) {
      afficher(
        "🎉 Parfait : 100 % ! Tout est rangé, et tout a été coupé.",
        "succes",
      );
    } else {
      afficher(
        "Tout est rangé : " +
          pourcentage +
          " %. Pour 100 %, coupe au lieu de copier !",
        "attention",
      );
    }
  }
}

function mettreAJour() {
  const bienRanges = articlesBienRanges();
  mettreAJourCompteurs(bienRanges);
  mettreAJourJauge(bienRanges);
}

mettreAJour();
