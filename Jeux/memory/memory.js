// ===== 1. TES PAIRES : ajoute, enlève ou change les lignes =====
// "image" peut être un emoji OU le nom d'un fichier (ex: "chat.png").
// Il faut au moins autant de paires que le plus grand niveau (ici 10).
const themes = {
  animaux: [
    { image: "🐱", mot: "Chat" },
    { image: "🐶", mot: "Chien" },
    { image: "🐭", mot: "Souris" },
    { image: "🐰", mot: "Lapin" },
    { image: "🦊", mot: "Renard" },
    { image: "🐻", mot: "Ours" },
    { image: "🐼", mot: "Panda" },
    { image: "🐸", mot: "Grenouille" },
    { image: "🦁", mot: "Lion" },
    { image: "🐧", mot: "Pingouin" },
  ],

  fruits: [
    { image: "🍎", mot: "Pomme" },
    { image: "🍌", mot: "Banane" },
    { image: "🍇", mot: "Raisin" },
    { image: "🍓", mot: "Fraise" },
    { image: "🍊", mot: "Orange" },
    { image: "🍉", mot: "Pastèque" },
    { image: "🍒", mot: "Cerises" },
    { image: "🍍", mot: "Ananas" },
    { image: "🍑", mot: "Pêche" },
    { image: "🥝", mot: "Kiwi" },
  ],

  nourriture: [
    { image: "🍕", mot: "Pizza" },
    { image: "🍔", mot: "Burger" },
    { image: "🍟", mot: "Frites" },
    { image: "🥐", mot: "Croissant" },
    { image: "🧀", mot: "Fromage" },
    { image: "🍫", mot: "Chocolat" },
    { image: "🍦", mot: "Glace" },
    { image: "🥖", mot: "Baguette" },
    { image: "🍩", mot: "Donut" },
    { image: "🍿", mot: "Pop-corn" },
  ],

  transports: [
    { image: "🚗", mot: "Voiture" },
    { image: "🚌", mot: "Bus" },
    { image: "🚲", mot: "Vélo" },
    { image: "✈️", mot: "Avion" },
    { image: "🚂", mot: "Train" },
    { image: "🚢", mot: "Bateau" },
    { image: "🚁", mot: "Hélicoptère" },
    { image: "🏍️", mot: "Moto" },
    { image: "🚀", mot: "Fusée" },
    { image: "🚜", mot: "Tracteur" },
  ],

  nature: [
    { image: "🌳", mot: "Arbre" },
    { image: "🌸", mot: "Fleur" },
    { image: "🌻", mot: "Tournesol" },
    { image: "🍄", mot: "Champignon" },
    { image: "🌵", mot: "Cactus" },
    { image: "🍃", mot: "Feuille" },
    { image: "⛰️", mot: "Montagne" },
    { image: "🌊", mot: "Vague" },
    { image: "🌴", mot: "Palmier" },
    { image: "🌋", mot: "Volcan" },
  ],

  meteo: [
    { image: "☀️", mot: "Soleil" },
    { image: "☁️", mot: "Nuage" },
    { image: "🌧️", mot: "Pluie" },
    { image: "⛈️", mot: "Orage" },
    { image: "❄️", mot: "Neige" },
    { image: "🌈", mot: "Arc-en-ciel" },
    { image: "🌪️", mot: "Tornade" },
    { image: "🌫️", mot: "Brouillard" },
    { image: "💨", mot: "Vent" },
    { image: "⚡", mot: "Éclair" },
  ],

  sport: [
    { image: "⚽", mot: "Football" },
    { image: "🏀", mot: "Basket" },
    { image: "🎾", mot: "Tennis" },
    { image: "🏉", mot: "Rugby" },
    { image: "🏐", mot: "Volley" },
    { image: "🏓", mot: "Ping-pong" },
    { image: "⛳", mot: "Golf" },
    { image: "🥊", mot: "Boxe" },
    { image: "⛷️", mot: "Ski" },
    { image: "🏊", mot: "Natation" },
  ],
  couleurs: [
    { image: "🔴", mot: "Rouge" },
    { image: "🔵", mot: "Bleu" },
    { image: "🟢", mot: "Vert" },
    { image: "🟡", mot: "Jaune" },
    { image: "🟠", mot: "Orange" },
    { image: "🟣", mot: "Violet" },
    { image: "🟤", mot: "Marron" },
    { image: "⚫", mot: "Noir" },
    { image: "⚪", mot: "Blanc" },
    { image: "🩷", mot: "Rose" },
  ],

  corps: [
    { image: "👁️", mot: "Œil" },
    { image: "👂", mot: "Oreille" },
    { image: "👃", mot: "Nez" },
    { image: "👄", mot: "Bouche" },
    { image: "👅", mot: "Langue" },
    { image: "🦷", mot: "Dent" },
    { image: "🖐️", mot: "Main" },
    { image: "🦶", mot: "Pied" },
    { image: "🦵", mot: "Jambe" },
    { image: "💪", mot: "Bras" },
  ],

  vetements: [
    { image: "👕", mot: "T-shirt" },
    { image: "👖", mot: "Pantalon" },
    { image: "👗", mot: "Robe" },
    { image: "🩳", mot: "Short" },
    { image: "🧦", mot: "Chaussettes" },
    { image: "👟", mot: "Chaussure" },
    { image: "🧢", mot: "Casquette" },
    { image: "🧣", mot: "Écharpe" },
    { image: "🧤", mot: "Gants" },
    { image: "👒", mot: "Chapeau" },
  ],

  maison: [
    { image: "🛏️", mot: "Lit" },
    { image: "🪑", mot: "Chaise" },
    { image: "🛋️", mot: "Canapé" },
    { image: "🚪", mot: "Porte" },
    { image: "🪟", mot: "Fenêtre" },
    { image: "🔑", mot: "Clé" },
    { image: "💡", mot: "Lampe" },
    { image: "🚿", mot: "Douche" },
    { image: "🛁", mot: "Baignoire" },
    { image: "🍽️", mot: "Assiette" },
  ],

  ecole: [
    { image: "✏️", mot: "Crayon" },
    { image: "🖊️", mot: "Stylo" },
    { image: "📖", mot: "Livre" },
    { image: "📓", mot: "Cahier" },
    { image: "🎒", mot: "Cartable" },
    { image: "📏", mot: "Règle" },
    { image: "✂️", mot: "Ciseaux" },
    { image: "💻", mot: "Ordinateur" },
    { image: "🌍", mot: "Globe" },
    { image: "🔔", mot: "Cloche" },
  ],
};

// ===== 2. TES NIVEAUX : le nombre est le nombre de paires =====
// Astuce : garde un nombre de paires qui fait une grille régulière
// (avec 4 colonnes, n'importe quel nombre de paires pair ou impair marche
// si 2 x paires est divisible par 4, ex: 6, 8, 10).
const niveaux = {
  facile: 6,
  moyen: 8,
  difficile: 10,
};

// ===== 3. VARIABLES DU JEU =====

let themeActuel = "animaux"; // le thème de la partie en cours
let modeActuel = "images"; // "images" ou "mots"
let niveauActuel = "facile"; // "facile", "moyen" ou "difficile"
let nbPaires = 6; // nombre de paires de la partie en cours
let premiere = null; // la première carte retournée (null = aucune)
let bloque = false; // true pendant que 2 cartes différentes sont visibles
let coups = 0; // nombre de coups joués
let trouvees = 0; // nombre de paires trouvées

// ===== 5. MÉLANGER UNE LISTE =====
function melanger(liste) {
  liste.sort(function () {
    return Math.random() - 0.5;
  });
}

// ===== 6. AFFICHER LE CONTENU D'UNE CARTE =====
// Si le contenu contient un point (ex: "chat.png"), on affiche une vraie image.
// Sinon on affiche du texte (emoji ou mot).
function afficher(bouton, contenu) {
  if (contenu.indexOf(".") > -1) {
    bouton.innerHTML = '<img src="' + contenu + '" width="60">';
  } else {
    bouton.textContent = contenu;
  }
}

// ===== 7. LANCER UNE PARTIE =====
document.getElementById("theme").addEventListener("change", function () {
  themeActuel = this.value;
  lancer();
});

document.getElementById("mode").addEventListener("change", function () {
  modeActuel = this.value;
  lancer();
});

document.getElementById("niveau").addEventListener("change", function () {
  niveauActuel = this.value;
  lancer();
});

function lancer() {
  premiere = null;
  bloque = false;
  coups = 0;
  trouvees = 0;
  nbPaires = niveaux[niveauActuel];
  console.log(niveaux[niveauActuel]);
  document.getElementById("info").textContent = "Coups : 0";

  // On mélange les paires et on garde seulement le nombre voulu
  let choisies = themes[themeActuel].slice();

  melanger(choisies);
  choisies = choisies.slice(0, nbPaires);

  // On fabrique la liste des cartes : 2 cartes par paire
  const cartes = [];
  for (let i = 0; i < choisies.length; i++) {
    cartes.push({ id: i, contenu: choisies[i].image, estMot: false });

    if (modeActuel == "images") {
      cartes.push({ id: i, contenu: choisies[i].image, estMot: false });
    } else {
      cartes.push({ id: i, contenu: choisies[i].mot, estMot: true });
    }
  }
  melanger(cartes);

  // On dessine les cartes dans la page
  const jeu = document.getElementById("jeu");
  if (niveauActuel === "difficile") {
    jeu.style.gridTemplateColumns = "repeat(5, 90px)";
  } else {
    jeu.style.gridTemplateColumns = "repeat(4, 90px)";
  }
  jeu.innerHTML = "";
  cartes.forEach(function (carte) {
    const bouton = document.createElement("button");
    bouton.className = "carte";
    if (carte.estMot) {
      bouton.className = "carte mot";
    }
    bouton.textContent = "?";
    bouton.onclick = function () {
      cliquer(bouton, carte);
    };
    jeu.appendChild(bouton);
  });
}

// ===== 8. QUAND ON CLIQUE SUR UNE CARTE =====
function cliquer(bouton, carte) {
  // On ignore le clic si on attend ou si la carte est déjà retournée
  if (bloque || bouton.classList.contains("visible")) {
    return;
  }

  // On retourne la carte
  afficher(bouton, carte.contenu);
  bouton.classList.add("visible");

  // Si c'est la première carte, on la garde en mémoire et on s'arrête
  if (premiere == null) {
    premiere = { bouton: bouton, carte: carte };
    return;
  }

  // Sinon c'est la deuxième carte : on compte un coup
  coups++;
  document.getElementById("info").textContent = "Coups : " + coups;

  if (premiere.carte.id == carte.id) {
    // Bonne paire !
    premiere.bouton.classList.add("trouvee");
    bouton.classList.add("trouvee");
    trouvees++;
    premiere = null;
    if (trouvees == nbPaires) {
      document.getElementById("info").textContent =
        "🎉 Bravo ! Gagné en " + coups + " coups";
    }
  } else {
    // Mauvaise paire : on les recache après 1 seconde (1000 ms)
    bloque = true;
    const ancienne = premiere.bouton;
    premiere = null;
    setTimeout(function () {
      ancienne.textContent = "?";
      ancienne.classList.remove("visible");
      bouton.textContent = "?";
      bouton.classList.remove("visible");
      bloque = false;
    }, 1000);
  }
}

document.getElementById("recommencer").addEventListener("click", function () {
  lancer();
});
// ===== 9. ON LANCE LA PREMIÈRE PARTIE AU CHARGEMENT =====
lancer();
