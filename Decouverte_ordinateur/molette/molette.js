import {
  afficherMessage,
  espacesInsecables,
  melanger,
  texteAvecGras,
} from "../../outils.js";

// =========================================================
// molette.js — exercice « Utiliser la molette »
// ---------------------------------------------------------
// On ne surveille pas la molette elle-même, mais ce qui
// devient VISIBLE à l'écran (IntersectionObserver).
// Comme ça, l'exercice marche aussi avec un pavé tactile,
// les flèches du clavier ou le doigt sur un téléphone.
// =========================================================

// ---------- 1. Les niveaux ----------
// Un niveau = une façon de faire défiler.
// Chaque niveau a des manches, et chaque manche des étapes :
//   scene   : le décor à afficher (voir PREPARER_SCENE, section 6)
//   nom     : affiché dans la barre au-dessus du jeu
//   etapes  : ce qu'il faut faire, dans l'ordre
//     consigne : affichée dans la carte d'explication (** = gras,
//                {prenom} = le prénom à chercher)
//     guide    : l'étiquette collée en bas de l'écran (niveau 1)
//     objectif : la consigne courte, affichée juste au-dessus du jeu (niveau 2)
//   aide    : le message si on tourne la molette à côté du cadre (niveau 2)
// introduction : la phrase de l'écran « Commencer » (** = gras)
// usages : les exemples de « À quoi ça sert ? »
// astuce : la phrase après « 💡 Astuce : »
// mobile : la phrase pour les téléphones et tablettes
const NIVEAUX = [
  {
    nom: "Faire défiler la page",
    couleur: "page",
    titre: "Faire défiler la page",
    introduction: "Tu vas faire descendre et monter **toute la page**.",
    usages: [
      { picto: "📰", texte: "Lire un **article** trop long pour l'écran" },
      { picto: "🛒", texte: "Voir tous les **produits** d'un magasin en ligne" },
      { picto: "📄", texte: "Lire un **document** jusqu'en bas" },
      { picto: "⬆️", texte: "Revenir en **haut** de la page" },
    ],
    astuce:
      "molette **vers toi** : la page descend. Molette **vers l'écran** : la page monte.",
    mobile:
      "📱 Sur un téléphone ou une tablette, fais glisser ton doigt sur l'écran.",
    manches: [
      {
        scene: "tresor",
        nom: "Le trésor",
        etapes: [
          {
            nom: "descendre",
            consigne:
              "Tourne la molette **vers toi** pour descendre le chemin. Tout en bas, clique sur le **trésor**.",
            guide: { fleche: "↓", texte: "Descends jusqu'au trésor" },
            // Le guide quand le trésor apparaît à l'écran
            guideArrivee: { fleche: "👆", texte: "Clique sur le trésor" },
          },
          {
            nom: "remonter",
            consigne:
              "Tu as le trésor ! Tourne la molette **vers l'écran** pour remonter jusqu'à la **maison**.",
            guide: { fleche: "↑", texte: "Remonte jusqu'à la maison" },
          },
        ],
      },
      {
        scene: "fusee",
        nom: "La fusée",
        etapes: [
          {
            nom: "monter",
            consigne:
              "La fusée est sur la Terre. Tourne la molette **vers l'écran** pour monter jusqu'à la **Lune**.",
            guide: { fleche: "↑", texte: "Monte jusqu'à la Lune" },
          },
          {
            nom: "redescendre",
            consigne:
              "Tu es près de la Lune ! Tourne la molette **vers toi** pour redescendre sur la **Terre**.",
            guide: { fleche: "↓", texte: "Redescends sur la Terre" },
          },
        ],
      },
    ],
  },
  {
    nom: "Faire défiler une liste",
    couleur: "cadre",
    titre: "Faire défiler une liste",
    introduction: "Tu vas faire défiler **une liste** dans un téléphone.",
    usages: [
      { picto: "📇", texte: "Chercher un **contact** dans une liste" },
      { picto: "💬", texte: "Relire les anciens **messages** d'une conversation" },
      { picto: "📋", texte: "Choisir dans une **liste** : un pays, une date…" },
      { picto: "📧", texte: "Parcourir ses **e-mails**" },
    ],
    astuce:
      "la molette fait bouger ce qui est **sous la souris**. Pour faire défiler une liste, mets d'abord la souris dessus.",
    mobile:
      "📱 Sur un téléphone ou une tablette, pose ton doigt sur la liste et fais-le glisser.",
    manches: [
      {
        scene: "contacts",
        nom: "Les contacts",
        etapes: [
          {
            nom: "chercher",
            consigne:
              "Mets la souris **sur la liste**, puis tourne la molette pour trouver **{prenom}**. Clique sur son nom.",
            objectif: "🔍 Trouve **{prenom}** et clique sur son nom.",
          },
        ],
        aide: "La liste ne bouge pas ? Mets d'abord la souris **sur la liste**, puis tourne la molette.",
      },
      {
        scene: "messages",
        nom: "Les messages",
        etapes: [
          {
            nom: "remonter",
            consigne:
              "Les derniers messages sont en bas. Mets la souris **sur la conversation** et remonte pour trouver l'heure du **rendez-vous chez le médecin**. Clique sur ce message.",
            objectif:
              "🔍 Trouve l'heure du **rendez-vous chez le médecin** et clique sur ce message.",
          },
        ],
        aide: "La conversation ne bouge pas ? Mets d'abord la souris **sur la conversation**, puis tourne la molette.",
      },
    ],
  },
];

// Le répertoire du niveau 2 (rangé dans l'ordre de l'alphabet par le JS)
const CONTACTS = [
  "Ahmed", "Aïcha", "Alain", "Amadou", "Anne", "Bernard", "Bintou",
  "Camille", "Chloé", "Claire", "David", "Djamila", "Élodie", "Fatou",
  "Fatima", "Florence", "Gérard", "Hugo", "Inès", "Jean", "Julie",
  "Karim", "Kevin", "Laura", "Léa", "Lucas", "Malik", "Mamadou",
  "Marie", "Mohamed", "Nadia", "Nicolas", "Olga", "Omar", "Patrick",
  "Pierre", "Rachid", "Sarah", "Sophie", "Thomas", "Vanessa",
  "Yasmine", "Youssef", "Zoé",
];

// Le trésor s'arrête là, juste sous la maison (en px depuis le haut du décor).
// Quand il y arrive, l'exercice est réussi.
const HAUT_DU_CHEMIN = 230;

// Le prénom à chercher est tiré au hasard parmi les derniers de la liste,
// pour qu'il faille bien faire défiler
const NOMBRE_DE_PRENOMS_CACHES = 10;

// La conversation du niveau 2, du plus ancien au plus récent.
//   jour   : un séparateur de date
//   envoye : true = message envoyé par moi (à droite, en vert)
//   bon    : true = le message à trouver
const MESSAGES = [
  { jour: "Samedi" },
  { texte: "Bonjour ! Tu vas bien ?", heure: "09:12" },
  { texte: "Oui, et toi ?", heure: "09:15", envoye: true },
  {
    texte: "Ton rendez-vous chez le médecin est mardi à 10 h 30.",
    heure: "09:16",
    bon: true,
  },
  { texte: "Merci, je note !", heure: "09:20", envoye: true },
  { texte: "On va au marché cet après-midi ?", heure: "11:02" },
  { texte: "D'accord. À 15 h ?", heure: "11:10", envoye: true },
  { texte: "Parfait 👍", heure: "11:11" },
  { jour: "Dimanche" },
  { texte: "Il fait beau aujourd'hui ☀️", heure: "10:30" },
  { texte: "On se promène au parc ?", heure: "10:31" },
  { texte: "Bonne idée !", heure: "10:45", envoye: true },
  { texte: "Je prends le pain.", heure: "10:46", envoye: true },
  { texte: "Super, à tout à l'heure.", heure: "10:50" },
  { jour: "Hier" },
  { texte: "Tu as le numéro de la mairie ?", heure: "14:05" },
  { texte: "Non, désolé.", heure: "14:20", envoye: true },
  { texte: "Pas grave, je cherche sur Internet.", heure: "14:22" },
  { texte: "Le bus est en retard ce soir…", heure: "18:40" },
  { texte: "Encore ! 😅", heure: "18:41", envoye: true },
  { jour: "Aujourd'hui" },
  { texte: "Coucou ! Tu viens au cours d'informatique ?", heure: "08:55" },
  { texte: "Oui, j'arrive à 14 h.", heure: "09:01", envoye: true },
  { texte: "Super, à tout à l'heure 😊", heure: "09:02" },
];

// Temps entre la réussite et l'ouverture de la fenêtre « Bravo »,
// en millisecondes (le même que dans « Déplacer la souris »)
const PAUSE_AVANT_BRAVO = 600;

// Les messages de réussite, tirés au hasard pour varier
const FELICITATIONS = [
  "Bravo !",
  "Bien joué !",
  "Super !",
  "Parfait !",
  "Excellent !",
];

// ---------- 2. Les éléments de la page ----------
const page = document.getElementById("molette");
const listeNiveaux = document.getElementById("niveaux");
const explication = document.querySelector(".explication");
const consigneTitre = document.getElementById("consigne-titre");
const consigneTexte = document.getElementById("consigne-texte");
const listeUsages = document.getElementById("usages");
const texteAstuce = document.getElementById("astuce");
const texteMobile = document.getElementById("mobile");
const plateau = document.getElementById("plateau");
const texteManche = document.getElementById("manche");
const texteEtape = document.getElementById("etape");
const texteObjectif = document.getElementById("objectif");
const ecran = document.getElementById("ecran");
const ecranTitre = document.getElementById("ecran-titre");
const ecranTexte = document.getElementById("ecran-texte");
const ecranBouton = document.getElementById("ecran-bouton");
const lienSuivant = document.getElementById("activite-suivante");
const scene = document.getElementById("scene");
const guide = document.getElementById("guide");
const guideFleche = document.getElementById("guide-fleche");
const guideTexte = document.getElementById("guide-texte");
const message = document.getElementById("message");
const bravo = document.getElementById("bravo");
const bravoTexte = document.getElementById("bravo-texte");
const bravoBouton = document.getElementById("bravo-bouton");

// ---------- 3. L'état du jeu ----------
let numeroNiveau = 0; // position du niveau en cours dans NIVEAUX
const niveauxFaits = new Set(); // les numéros des niveaux terminés
let numeroManche = 0; // position de la manche en cours dans le niveau
let numeroEtape = 0; // position de l'étape en cours dans la manche
let mancheFinie = false; // true dès que l'exercice est réussi
let prenomCherche = ""; // le contact à trouver (niveau 2)
let observateur = null; // l'IntersectionObserver de la manche en cours
let suiteEnAttente = null; // minuteur entre la réussite et la fenêtre « Bravo »
let actionSuivante = null; // ce que fait le bouton de la fenêtre « Bravo »
let ecouteurs = null; // AbortController : arrête les écouteurs de la manche

// Raccourcis pour lire le niveau, la manche et l'étape en cours
const niveauEnCours = () => NIVEAUX[numeroNiveau];
const mancheEnCours = () => niveauEnCours().manches[numeroManche];
const etapeEnCours = () => mancheEnCours().etapes[numeroEtape];

// ---------- 4. L'affichage ----------

// Crée un onglet par niveau : un <li> qui contient un <button>
function afficherOnglets() {
  const onglets = NIVEAUX.map((niveau, index) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = niveau.nom;
    bouton.dataset.niveau = niveau.couleur; // → data-niveau="page" : sa couleur
    bouton.classList.toggle("actif", index === numeroNiveau);
    bouton.classList.toggle("fait", niveauxFaits.has(index));
    if (index === numeroNiveau) {
      bouton.setAttribute("aria-current", "step");
    }
    bouton.addEventListener("click", () => choisirNiveau(index));

    const onglet = document.createElement("li");
    onglet.append(bouton);
    return onglet;
  });
  listeNiveaux.replaceChildren(...onglets);
}

// Met à jour la carte d'explication pour le niveau en cours
function afficherExplication() {
  const niveau = niveauEnCours();
  page.dataset.niveau = niveau.couleur; // toute la page prend la couleur du niveau
  consigneTitre.textContent = niveau.titre;

  const usages = niveau.usages.map(({ picto, texte }) => {
    const pictogramme = document.createElement("span");
    pictogramme.className = "picto";
    pictogramme.setAttribute("aria-hidden", "true");
    pictogramme.textContent = picto;

    const description = document.createElement("span");
    description.append(...texteAvecGras(texte));

    const usage = document.createElement("li");
    usage.append(pictogramme, description);
    return usage;
  });
  listeUsages.replaceChildren(...usages);

  texteAstuce.replaceChildren(...texteAvecGras(niveau.astuce));
  texteMobile.textContent = niveau.mobile;
}

// Met à jour la consigne, la barre et le guide pour l'étape en cours
function afficherEtape() {
  const manche = mancheEnCours();
  const etape = etapeEnCours();

  const consigne = etape.consigne.replace("{prenom}", prenomCherche);
  consigneTexte.replaceChildren(...texteAvecGras(consigne));

  // La consigne courte, juste au-dessus du jeu (seulement si l'étape en a une)
  texteObjectif.hidden = !etape.objectif;
  if (etape.objectif) {
    const objectif = etape.objectif.replace("{prenom}", prenomCherche);
    texteObjectif.replaceChildren(...texteAvecGras(objectif));
  }

  texteManche.textContent = `Exercice ${numeroManche + 1} sur ${niveauEnCours().manches.length} : ${manche.nom.toLowerCase()}`;
  texteEtape.textContent =
    manche.etapes.length > 1
      ? `Étape ${numeroEtape + 1} sur ${manche.etapes.length} : ${etape.nom}`
      : "";

  // Le guide n'existe que pour les étapes qui en ont un (niveau 1)
  guide.hidden = !etape.guide;
  guide.classList.remove("bravo");
  if (etape.guide) {
    guideFleche.textContent = etape.guide.fleche;
    guideTexte.textContent = etape.guide.texte;
  }
}

// Affiche l'écran par-dessus la zone de jeu.
// « action » est la fonction lancée quand on clique sur le bouton.
function afficherEcran(titre, texte, texteBouton, action) {
  lienSuivant.hidden = true; // afficherFin() le montrera

  ecranTitre.textContent = titre;
  ecranTexte.replaceChildren(...texteAvecGras(texte)); // ** = gras
  ecranBouton.textContent = texteBouton;
  ecranBouton.onclick = action;
  ecran.hidden = false;
  // Le focus permet de valider avec Entrée.
  // focusVisible: false : pas de contour orange, même au chargement de la page.
  ecranBouton.focus({ preventScroll: true, focusVisible: false });
}

// Présente le niveau en cours : onglets, explication, écran « Commencer »
function presenterNiveau() {
  const niveau = niveauEnCours();
  explication.open = true;
  afficherOnglets();
  afficherExplication();
  consigneTexte.textContent = "";
  texteManche.textContent = "";
  texteEtape.textContent = "";
  afficherEcran(
    niveau.titre,
    `${niveau.introduction} ${niveau.manches.length} Exercices.`,
    "Commencer",
    () => {
      numeroManche = 0;
      demarrerManche();
    },
  );
}

// Quand on clique sur un onglet : on arrête la manche en cours
// et on présente le niveau choisi
function choisirNiveau(index) {
  arreterManche();
  afficherMessage(message, "");
  numeroNiveau = index;
  presenterNiveau();
}

// ---------- 5. Les manches ----------

// Enlève le décor et annule tout ce qui était en cours
function arreterManche() {
  clearTimeout(suiteEnAttente);
  observateur?.disconnect(); // ?. : seulement s'il y a un observateur
  observateur = null;
  ecouteurs?.abort(); // retire les écouteurs ajoutés pendant la manche
  ecouteurs = null;
  scene.replaceChildren();
  guide.hidden = true;
  texteObjectif.hidden = true;
}

function demarrerManche() {
  const manche = mancheEnCours();
  ecran.hidden = true;
  numeroEtape = 0;
  mancheFinie = false;
  afficherMessage(message, "");

  // Une copie du décor de la manche, prise dans son <template>
  const modele = document.getElementById(`scene-${manche.scene}`);
  const decor = modele.content.firstElementChild.cloneNode(true);
  scene.replaceChildren(decor);

  PREPARER_SCENE[manche.scene](decor);
  afficherEtape();
}

// Passe à l'étape suivante de la manche
function etapeSuivante() {
  numeroEtape++;
  afficherEtape();
}

// La manche est réussie : on félicite, puis la fenêtre « Bravo » s'ouvre
function reussirManche(texte) {
  mancheFinie = true;
  observateur?.disconnect();

  const index = Math.floor(Math.random() * FELICITATIONS.length);
  const felicitation = `${FELICITATIONS[index]} ${texte}`;
  afficherMessage(message, felicitation, "succes");

  // Au niveau 1, le message est loin en bas : le guide l'affiche aussi
  if (!guide.hidden) {
    guide.classList.add("bravo");
    guideFleche.textContent = "✓";
    guideTexte.textContent = felicitation;
  }

  suiteEnAttente = setTimeout(() => ouvrirBravo(texte), PAUSE_AVANT_BRAVO);
}

// La fenêtre « Bravo » : ce qui a été réussi, et un bouton pour la suite.
// Le bouton lance directement la suite, comme dans « Déplacer la souris ».
function ouvrirBravo(texte) {
  const niveau = niveauEnCours();
  let phrase;
  let texteBouton;

  if (numeroManche < niveau.manches.length - 1) {
    // 1. Il reste des exercices dans ce niveau
    phrase = `${texte} Tu as réussi l'exercice !`;
    texteBouton = "Exercice suivant →";
    actionSuivante = () => {
      numeroManche++;
      demarrerManche();
    };
  } else {
    // 2. Le niveau est terminé : la coche ✓ apparaît sur l'onglet
    niveauxFaits.add(numeroNiveau);
    afficherOnglets();

    if (niveauxFaits.size === NIVEAUX.length) {
      // 3. Tous les niveaux sont réussis, dans n'importe quel ordre
      phrase = `${texte} Tu as réussi tous les niveaux !`;
      texteBouton = "Terminer →";
      actionSuivante = afficherFin;
    } else {
      // 4. Sinon, le premier niveau pas encore réussi
      const suivant = NIVEAUX.findIndex((_, i) => !niveauxFaits.has(i));
      phrase = `${texte} Tu as réussi le niveau « ${niveau.nom} » !`;
      texteBouton = "Niveau suivant →";
      actionSuivante = () => {
        numeroNiveau = suivant;
        presenterNiveau();
        // On remonte aux onglets, pour lire l'explication du nouveau niveau
        listeNiveaux.scrollIntoView({ block: "start" });
      };
    }
  }

  bravoTexte.textContent = espacesInsecables(phrase);
  bravoBouton.textContent = texteBouton;
  bravo.showModal(); // la fenêtre s'ouvre au milieu de l'écran, le fond s'assombrit
  bravoBouton.focus({ focusVisible: false }); // Entrée marche, sans contour
}

function afficherFin() {
  texteManche.textContent = "";
  texteEtape.textContent = "";
  afficherEcran(
    "Bravo, tu as réussi tous les niveaux !",
    "Tu sais faire défiler une page, une liste et une conversation avec la molette.",
    "Recommencer",
    () => {
      niveauxFaits.clear();
      numeroNiveau = 0;
      presenterNiveau();
    },
  );
  lienSuivant.hidden = false;
}

// ---------- 6. Les décors ----------

// Surveille des éléments du décor : « quandVisible » est appelée
// avec l'élément dès qu'il est visible à l'écran.
// seuil : la part de l'élément qui doit être visible (0.9 = 90 %)
function surveiller(elements, quandVisible, seuil = 0.9) {
  observateur = new IntersectionObserver(
    (changements) => {
      for (const changement of changements) {
        if (changement.isIntersecting && !mancheFinie) {
          quandVisible(changement.target);
        }
      }
    },
    { threshold: seuil },
  );
  elements.forEach((element) => observateur.observe(element));
}

// Lit la forme du chemin dessiné en SVG.
// Renvoie une liste : pour chaque hauteur du décor (en px),
// la position du chemin en largeur (en % du décor).
function lireChemin(trace) {
  const largeurDessin = trace.ownerSVGElement.viewBox.baseVal.width;
  const positions = [];
  const longueur = trace.getTotalLength();

  // On avance le long du chemin, 2 unités par 2 unités
  for (let distance = 0; distance <= longueur; distance += 2) {
    const { x, y } = trace.getPointAtLength(distance);
    positions[Math.round(y)] = (x / largeurDessin) * 100;
  }

  // Les hauteurs sautées gardent la position de la hauteur juste au-dessus
  for (let y = 1; y < positions.length; y++) {
    positions[y] ??= positions[y - 1];
  }
  return positions;
}

// Niveau 1, manche 1 : descendre au trésor, puis le rapporter à la maison
function preparerTresor(decor) {
  const tresor = decor.querySelector(".tresor");
  const positions = lireChemin(decor.querySelector(".trace-sable"));
  const bas = positions.length - 1; // la fin du chemin, là où est le trésor

  // Arrivé en bas : le guide dit quoi faire
  surveiller([tresor], () => {
    if (numeroEtape === 0) {
      const { fleche, texte } = etapeEnCours().guideArrivee;
      guideFleche.textContent = fleche;
      guideTexte.textContent = texte;
    }
  });

  // Place le trésor sur le chemin, au milieu de l'écran
  function suivreLeChemin() {
    // La hauteur du milieu de l'écran, mesurée depuis le haut du décor
    const milieu = innerHeight / 2 - decor.getBoundingClientRect().top;
    // Sans sortir du chemin : entre la maison et la fin du chemin
    const y = Math.round(Math.min(Math.max(milieu, HAUT_DU_CHEMIN), bas));

    tresor.style.left = `${positions[y]}%`;
    tresor.style.top = `${y}px`;

    if (y === HAUT_DU_CHEMIN && !mancheFinie) {
      reussirManche("Le trésor est à la maison.");
    }
  }

  tresor.addEventListener("click", () => {
    tresor.classList.add("emporte"); // il n'est plus cliquable, il nous suit
    afficherMessage(message, "Tu as trouvé le trésor !", "succes");
    etapeSuivante();

    // À chaque défilement (et si la fenêtre change de taille),
    // le trésor se replace. signal : arreterManche() retire ces écouteurs.
    ecouteurs = new AbortController();
    const options = { passive: true, signal: ecouteurs.signal };
    addEventListener("scroll", suivreLeChemin, options);
    addEventListener("resize", suivreLeChemin, options);
    suivreLeChemin();
  });
}

// Niveau 1, manche 2 : monter jusqu'à la Lune, puis redescendre
function preparerFusee(decor) {
  const lune = decor.querySelector(".lune");
  const sol = decor.querySelector(".sol");
  const fusee = decor.querySelector(".fusee");

  // La fusée part de la Terre : on aligne le bas du décor
  // avec le bas de l'écran, la fusée est alors posée sur sa rampe
  sol.scrollIntoView({ block: "end" });

  surveiller([lune, sol], (element) => {
    if (element === lune && numeroEtape === 0) {
      fusee.classList.add("retour"); // la fusée se retourne
      etapeSuivante();
    } else if (element === sol && numeroEtape === 1) {
      fusee.classList.remove("retour");
      reussirManche("La fusée est de retour sur la Terre.");
    }
  }, 0.98); // 98 % : la Terre doit être presque entière, la fusée est posée
}

// Niveau 2, manche 1 : trouver un prénom dans le répertoire
function preparerContacts(decor) {
  const repertoire = decor.querySelector(".repertoire");
  const tries = [...CONTACTS].sort((a, b) => a.localeCompare(b, "fr"));
  prenomCherche = melanger(tries.slice(-NOMBRE_DE_PRENOMS_CACHES))[0];

  // Un séparateur à chaque nouvelle lettre (A, B, C…), comme sur un téléphone
  let lettreEnCours = "";
  for (const prenom of tries) {
    const initiale = prenom[0].normalize("NFD")[0]; // « É » → « E »
    if (initiale !== lettreEnCours) {
      lettreEnCours = initiale;
      const lettre = document.createElement("p");
      lettre.className = "lettre";
      lettre.textContent = initiale;
      repertoire.append(lettre);
    }

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = prenom[0];

    const contact = document.createElement("button");
    contact.type = "button";
    contact.className = "contact";
    contact.dataset.prenom = prenom;
    contact.append(avatar, prenom);
    repertoire.append(contact);
  }

  // Un seul écouteur pour tous les contacts
  repertoire.addEventListener("click", (evenement) => {
    const contact = evenement.target.closest(".contact");
    if (!contact || mancheFinie) return;

    if (contact.dataset.prenom === prenomCherche) {
      contact.classList.add("trouve");
      reussirManche(`Tu as trouvé ${prenomCherche}.`);
    } else {
      afficherMessage(
        message,
        espacesInsecables(
          `Ce n'est pas ${prenomCherche}. Continue à chercher dans la liste.`,
        ),
        "attention",
      );
    }
  });
}

// Niveau 2, manche 2 : remonter une conversation
function preparerMessages(decor) {
  const fil = decor.querySelector(".fil");

  for (const { jour, texte, heure, envoye, bon } of MESSAGES) {
    if (jour) {
      const separateur = document.createElement("p");
      separateur.className = "separateur";
      separateur.textContent = jour;
      fil.append(separateur);
      continue;
    }

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = heure;

    const bulle = document.createElement("button");
    bulle.type = "button";
    bulle.className = `bulle ${envoye ? "envoye" : "recu"}`;
    bulle.dataset.bon = bon ? "oui" : "non";
    bulle.append(espacesInsecables(texte), meta);
    fil.append(bulle);
  }

  // Comme dans un vrai téléphone : on commence en bas, sur les derniers messages
  fil.scrollTop = fil.scrollHeight;

  fil.addEventListener("click", (evenement) => {
    const bulle = evenement.target.closest(".bulle");
    if (!bulle || mancheFinie) return;

    if (bulle.dataset.bon === "oui") {
      bulle.classList.add("trouve");
      reussirManche("Le rendez-vous est mardi à 10 h 30.");
    } else {
      afficherMessage(
        message,
        espacesInsecables(
          "Ce n'est pas ce message. Continue à chercher dans la conversation.",
        ),
        "attention",
      );
    }
  });
}

// Le décor à préparer pour chaque valeur de « scene » (section 1)
const PREPARER_SCENE = {
  tresor: preparerTresor,
  fusee: preparerFusee,
  contacts: preparerContacts,
  messages: preparerMessages,
};

// ---------- 7. L'aide du niveau 2 ----------
// Si on tourne la molette alors que la souris n'est pas sur le cadre,
// c'est la page qui bouge, pas la liste : on explique pourquoi.
// passive: true : on écoute seulement, on n'empêche pas le défilement.
window.addEventListener(
  "wheel",
  (evenement) => {
    const cadre = scene.querySelector(".defilant");
    if (!cadre || mancheFinie || cadre.contains(evenement.target)) return;

    afficherMessage(message, "", "attention"); // vide le message, met la couleur
    message.append(...texteAvecGras(mancheEnCours().aide)); // puis le texte, avec le gras
  },
  { passive: true },
);

// ---------- 8. La fenêtre « Bravo » ----------
// Le bouton ferme la fenêtre, enlève le décor, puis lance la suite
bravoBouton.addEventListener("click", () => {
  bravo.close();
  arreterManche();
  afficherMessage(message, "");
  plateau.scrollIntoView({ block: "start" }); // on revient en haut du jeu
  actionSuivante();
});

// La touche Échap ferme normalement une fenêtre <dialog>.
// Ici on l'empêche : sans le bouton, on resterait bloqué sans suite.
bravo.addEventListener("cancel", (evenement) => {
  evenement.preventDefault();
});

// ---------- 9. Démarrage ----------
presenterNiveau();
