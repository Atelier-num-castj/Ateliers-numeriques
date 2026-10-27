export const niveaux = [
  {
    titre: "Exercice 1 : la fiche contact",
    consigne:
      "Copie les informations de la conversation, puis colle-les dans la fiche.",
    contact: { nom: "Camille", numero: "06 12 34 56 78", statut: "en ligne" },
    messages: [
      { separateur: "Aujourd'hui" },
      {
        de: "contact",
        texte: "Salut ! Moi c'est Camille Dupont 😊",
        heure: "14:02",
      },
      {
        de: "moi",
        texte:
          "Salut Camille ! Merci pour ton message, c'est bien ton numéro qui s'affiche ?",
        heure: "14:03",
      },
      {
        de: "contact",
        texte:
          "Oui, tu peux me contacter ici ! Je t'envoie également mon adresse mail.",
        heure: "14:04",
      },
      { de: "contact", texte: "camille.dupont@exemple.fr", heure: "14:04" },
      { de: "moi", texte: "Parfait ! Merci", heure: "14:05" },
      {
        de: "contact",
        texte:
          "Pour le rendez-vous de cet après-midi c'est au : 12 rue des Lilas, 69003 Lyon",
        heure: "14:06",
      },
    ],
    elements: [
      { id: "nom", etiquette: "Nom", attendu: "Camille Dupont" },
      { id: "telephone", etiquette: "Téléphone", attendu: "06 12 34 56 78" },
      {
        id: "email",
        etiquette: "E-mail",
        attendu: "camille.dupont@exemple.fr",
      },
      {
        id: "adresse",
        etiquette: "Adresse",
        attendu: "12 rue des Lilas, 69003 Lyon",
      },
    ],
  },
  {
    titre: "Exercice 2 : le colis",
    consigne: "Note les informations du livreur dans la fiche de suivi.",
    contact: { numero: "+33 7 98 76 54 32", statut: "en ligne" },
    messages: [
      { separateur: "Aujourd'hui" },
      {
        de: "contact",
        texte:
          "Bonjour, ici votre livreur. Votre colis Superposte arrive aujourd'hui.",
        heure: "09:15",
      },
      { de: "contact", texte: "Voici votre numéro de suivi :", heure: "09:15" },
      { de: "contact", texte: "FR458-923-771", heure: "09:16" },
      {
        de: "moi",
        texte: "Merci ! Vous passez à quelle heure ?",
        heure: "09:20",
      },
      { de: "contact", texte: "Entre 14h et 16h", heure: "09:21" },
      {
        de: "contact",
        texte: "Est-ce qu'il y a un code pour la porte ?",
        heure: "09:22",
      },
      {
        de: "moi",
        texte: "Le code de la porte est 4582B",
        heure: "09:23",
      },
    ],
    elements: [
      {
        id: "livreur",
        etiquette: "Entreprise de livraison",
        attendu: "Superposte",
      },
      { id: "suivi", etiquette: "Numéro de suivi", attendu: "FR458-923-771" },
      {
        id: "creneau",
        etiquette: "Horaire de passage",
        attendu: "Entre 14h et 16h",
      },
      { id: "code", etiquette: "Code de la porte", attendu: "4582B" },
    ],
  },
  {
    titre: "Exercice 3 : la soirée",
    consigne: "Note les informations de l'invitation.",
    contact: { nom: "Steve", numero: "06 98 76 54 32", statut: "en ligne" },
    messages: [
      { separateur: "Hier" },
      {
        de: "contact",
        texte: "Coucou ! Tu viens à ma fête d'anniversaire ?",
        heure: "18:40",
      },
      {
        de: "moi",
        texte: "Avec plaisir ! C'est à quelle heure ?",
        heure: "18:42",
      },
      { de: "contact", texte: "Samedi 14 novembre à 20h30", heure: "18:43" },
      { de: "moi", texte: "Super, et c'est où ?", heure: "18:44" },
      {
        de: "contact",
        texte: "5 place du Canal, 69100 Villeurbanne",
        heure: "18:45",
      },
      {
        de: "contact",
        texte: "Tu viens toute seule ?",
        heure: "18:46",
      },
      { de: "moi", texte: "Non je serais avec mon frère", heure: "18:50" },
      {
        de: "contact",
        texte: "Génial avec lequel ?",
        heure: "18:51",
      },
      { de: "moi", texte: "Mon grand frère Sammy", heure: "18:50" },
      {
        de: "contact",
        texte: "J'ai hâte de vous voir !",
        heure: "18:51",
      },
      { de: "moi", texte: "Moi aussi !", heure: "18:52" },
      {
        de: "moi",
        texte: "Tu veux que je ramène quelque chose à manger ?",
        heure: "18:52",
      },
      {
        de: "contact",
        texte:
          "On a prévu de faire des Pizzas, tu peux en prendre une 4 fromages",
        heure: "18:53",
      },
    ],
    elements: [
      {
        id: "date",
        etiquette: "Date et heure",
        attendu: "Samedi 14 novembre à 20h30",
      },
      {
        id: "adresse",
        etiquette: "Adresse",
        attendu: "5 place du Canal, 69100 Villeurbanne",
      },
      {
        id: "ami",
        etiquette: "Avec qui je viens ?",
        attendu: "Mon grand frère Sammy",
      },
      { id: "repas", etiquette: "Quel est le repas ?", attendu: "Pizzas" },
      {
        id: "pizza",
        etiquette: "Quel est le parfum de la pizza que je ramène ?",
        attendu: "4 fromages",
      },
    ],
  },
];
