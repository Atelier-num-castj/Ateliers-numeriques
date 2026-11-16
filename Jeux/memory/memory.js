import { melanger } from "../../outils.js";

// =========================================================
// memory.js — jeu de Memory
// =========================================================

// ---------- 1. Les paires : ajoute, enlève ou change les lignes ----------
// "image" peut être un emoji OU le nom d'un fichier (ex: "chat.png").
// Il faut au moins autant de paires que le plus grand niveau (ici 10).
const THEMES = {
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

// ---------- 2. Les niveaux : le nombre de paires ----------
// Le nombre de colonnes de la grille est réglé dans memory.css,
// grâce à l'attribut data-niveau posé sur la grille.
const NIVEAUX = {
  facile: 6,
  moyen: 8,
  difficile: 10,
};

// Temps pendant lequel deux cartes différentes restent visibles,
// en millisecondes
const PAUSE_MAUVAISE_PAIRE = 1000;

// ---------- 3. Les éléments de la page ----------
const choixTheme = document.getElementById("theme");
const choixMode = document.getElementById("mode");
const choixNiveau = document.getElementById("niveau");
const info = document.getElementById("info");
const jeu = document.getElementById("jeu");
const boutonRecommencer = document.getElementById("recommencer");

// ---------- 4. L'état du jeu ----------
let themeActuel = "animaux"; // le thème de la partie en cours
let modeActuel = "images"; // "images" ou "mots"
let niveauActuel = "facile"; // "facile", "moyen" ou "difficile"
let nombrePaires = 6; // nombre de paires de la partie en cours
let premiere = null; // la première carte retournée (null = aucune)
let bloque = false; // true pendant que 2 cartes différentes sont visibles
let coups = 0; // nombre de coups joués
let trouvees = 0; // nombre de paires trouvées
let retourEnAttente = null; // minuteur avant de recacher une mauvaise paire

// ---------- 5. L'affichage d'une carte ----------
// Si le contenu contient un point (ex: "chat.png"), on affiche une vraie image.
// Sinon on affiche du texte (emoji ou mot).
function afficher(bouton, contenu) {
  if (contenu.includes(".")) {
    const image = document.createElement("img");
    image.src = contenu;
    image.width = 60;
    image.alt = "";
    bouton.replaceChildren(image);
  } else {
    bouton.textContent = contenu;
  }
}

// ---------- 6. Lancer une partie ----------
function lancer() {
  // Rien ne doit rester « en attente » de la partie précédente
  clearTimeout(retourEnAttente);

  premiere = null;
  bloque = false;
  coups = 0;
  trouvees = 0;
  nombrePaires = NIVEAUX[niveauActuel];
  info.textContent = "Coups : 0";

  // On mélange les paires et on garde seulement le nombre voulu.
  // melanger() renvoie une copie : la liste du thème reste intacte.
  const choisies = melanger(THEMES[themeActuel]).slice(0, nombrePaires);

  // On fabrique la liste des cartes : 2 cartes par paire.
  // En mode « mots », la 2e carte montre le mot au lieu de l'image.
  const paquet = [];
  choisies.forEach((paire, id) => {
    paquet.push({ id, contenu: paire.image, estMot: false });

    if (modeActuel === "images") {
      paquet.push({ id, contenu: paire.image, estMot: false });
    } else {
      paquet.push({ id, contenu: paire.mot, estMot: true });
    }
  });

  // On dessine les cartes dans la page.
  // data-niveau donne le nombre de colonnes (voir memory.css).
  jeu.dataset.niveau = niveauActuel;
  const cartes = melanger(paquet).map((carte) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "carte";
    bouton.classList.toggle("mot", carte.estMot);
    bouton.textContent = "?";
    bouton.addEventListener("click", () => cliquer(bouton, carte));
    return bouton;
  });
  jeu.replaceChildren(...cartes);
}

// ---------- 7. Quand on clique sur une carte ----------
function cliquer(bouton, carte) {
  // On ignore le clic si on attend ou si la carte est déjà retournée
  if (bloque || bouton.classList.contains("visible")) return;

  // On retourne la carte
  afficher(bouton, carte.contenu);
  bouton.classList.add("visible");

  // Si c'est la première carte, on la garde en mémoire et on s'arrête
  if (premiere === null) {
    premiere = { bouton, carte };
    return;
  }

  // Sinon c'est la deuxième carte : on compte un coup
  coups++;
  info.textContent = `Coups : ${coups}`;

  if (premiere.carte.id === carte.id) {
    // Bonne paire !
    premiere.bouton.classList.add("trouvee");
    bouton.classList.add("trouvee");
    trouvees++;
    premiere = null;
    if (trouvees === nombrePaires) {
      info.textContent = `🎉 Bravo ! Gagné en ${coups} coups`;
    }
  } else {
    // Mauvaise paire : on les recache après 1 seconde
    bloque = true;
    const ancienne = premiere.bouton;
    premiere = null;
    retourEnAttente = setTimeout(() => {
      ancienne.textContent = "?";
      ancienne.classList.remove("visible");
      bouton.textContent = "?";
      bouton.classList.remove("visible");
      bloque = false;
    }, PAUSE_MAUVAISE_PAIRE);
  }
}

// ---------- 8. Les réglages et le bouton « Recommencer » ----------
choixTheme.addEventListener("change", () => {
  themeActuel = choixTheme.value;
  lancer();
});

choixMode.addEventListener("change", () => {
  modeActuel = choixMode.value;
  lancer();
});

choixNiveau.addEventListener("change", () => {
  niveauActuel = choixNiveau.value;
  lancer();
});

boutonRecommencer.addEventListener("click", lancer);

// ---------- 9. Démarrage ----------
lancer();
