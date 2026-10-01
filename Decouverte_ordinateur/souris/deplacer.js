// --- Données --------------------------------------------------------------
const LEVELS = Object.freeze([
  // Niveau 1
  {
    width: 96,
    path: "M110 250 L690 250",
    start: [110, 250],
    end: [690, 250],
  },
  // Niveau 2
  {
    width: 78,
    path: "M110 380 C260 380 240 130 400 130 S540 370 690 370",
    start: [110, 380],
    end: [690, 370],
  },
  // Niveau 3
  {
    width: 60,
    path: "M110 100 L300 100 L300 400 L500 400 L500 150 L690 150",
    start: [110, 100],
    end: [690, 150],
  },
  // Niveau 4
  {
    width: 46,
    path: "M100 100 C400 100 400 250 200 250 C0 250 0 400 250 400 L690 400",
    start: [100, 100],
    end: [690, 400],
  },
  // Niveau 5
  {
    width: 42,
    path: "M100 420 L100 330 L240 330 L240 240 L380 240 L380 150 L520 150 L520 80 L690 80",
    start: [100, 420],
    end: [690, 80],
  },
  // Niveau 6
  {
    width: 40,
    path: "M100 90 L700 90 C760 90 760 190 700 190 L100 190 C40 190 40 290 100 290 L700 290 C760 290 760 390 700 390 L140 390",
    start: [100, 90],
    end: [140, 390],
  },
  // Niveau 7
  {
    width: 30,
    path: "M100 420 L250 100 L400 420 L550 100 L690 420",
    start: [100, 420],
    end: [690, 420],
  },
  // Niveau 8
  {
    width: 30,
    path: "M90 100 L90 400 A40 40 0 0 0 170 400 L170 100 A40 40 0 0 1 250 100 L250 400 A40 40 0 0 0 330 400 L330 100 A40 40 0 0 1 410 100 L410 400 A40 40 0 0 0 490 400 L490 100 A40 40 0 0 1 570 100 L570 400 A40 40 0 0 0 650 400 L650 100 A40 40 0 0 1 730 100 L730 380",
    start: [90, 100],
    end: [730, 380],
  },
]);

const MESSAGES = Object.freeze({
  intro:
    "Mets la souris sur le rond « DÉPART », puis suis le chemin jusqu'à la maison.",
  go: "C'est parti ! Reste sur le chemin et va jusqu'à la maison.",
  offTrack:
    "Oups ! Tu es sorti du chemin. Reviens sur le rond « DÉPART » et recommence.",
  leftGame:
    "Oups ! La souris est sortie du jeu. Reviens sur le rond « DÉPART ».",
  win: "Bravo ! 🎉 Tu es arrivé à la maison ! 🏠",
});

// --- Éléments -------------------------------------------------------------
const $ = (selector) => document.querySelector(selector);

const svg = $("#scene");
const roadPaths = [$("#trackBorder"), $("#track"), $("#dash")];
const trailLine = $("#trail");
const ghosts = $("#ghosts");
const startG = $("#startG");
const startCircle = $("#startCircle");
const startText = $("#startText");
const houseG = $("#houseG");
const houseInner = $("#houseInner");
const msg = $("#msg");
const msgText = $("#msgText");
const nextBtn = $("#nextBtn");
const levelsBox = $("#levels");
const triesEl = $("#triesEl");
const winsEl = $("#winsEl");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

// --- État -----------------------------------------------------------------
// phase : "idle" (attend le départ) | "active" (en chemin) | "won" (arrivé)
const game = { level: 0, phase: "idle", tries: 0, wins: 0, trail: [] };

// --- Utilitaires ----------------------------------------------------------
const animate = (element, keyframes, duration) => {
  if (reduceMotion.matches) return;
  element.animate(keyframes, { duration, easing: "ease-out" });
};

const toSvgPoint = (clientX, clientY) =>
  new DOMPoint(clientX, clientY).matrixTransform(svg.getScreenCTM().inverse());

const say = (text, kind = "") => {
  msgText.textContent = text;
  msg.className = kind;
  nextBtn.hidden = true;
};

const resetTrail = () => {
  game.trail = [];
  trailLine.setAttribute("points", "");
};

const resetStart = () => {
  startCircle.setAttribute("fill", "#ffffff");
  startText.textContent = "DÉPART";
};

// --- Actions --------------------------------------------------------------
const loadLevel = (index) => {
  const {
    width,
    path,
    start: [sx, sy],
    end: [ex, ey],
  } = LEVELS[index];

  game.level = index;
  game.phase = "idle";
  resetTrail();
  ghosts.replaceChildren();
  resetStart();

  roadPaths.forEach((p) => p.setAttribute("d", path));
  roadPaths[0].setAttribute("stroke-width", width + 12);
  roadPaths[1].setAttribute("stroke-width", width);
  startG.setAttribute("transform", `translate(${sx} ${sy})`);
  houseG.setAttribute("transform", `translate(${ex} ${ey})`);

  levelsBox
    .querySelectorAll("button")
    .forEach((button, i) =>
      button.setAttribute("aria-current", String(i === index)),
    );

  say(MESSAGES.intro);
};

const startRun = () => {
  game.phase = "active";
  game.tries += 1;
  triesEl.textContent = `Essais : ${game.tries}`;
  startCircle.setAttribute("fill", "#9be3b3");
  startText.textContent = "GO !";
  say(MESSAGES.go);
};

const failRun = (text = MESSAGES.offTrack) => {
  if (game.phase !== "active") return;
  game.phase = "idle";
  const last = game.trail.at(-1);
  if (last) {
    const [x, y] = last.split(",");
    const ghost = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    ghost.textContent = "👻";
    ghost.setAttribute("x", x);
    ghost.setAttribute("y", y);
    ghosts.append(ghost);
  }
  resetTrail();
  resetStart();
  say(text, "bad");
  animate(
    msg,
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" },
    ],
    300,
  );
};

const winRun = () => {
  game.phase = "won";
  game.wins += 1;
  winsEl.textContent = `Réussites : ${game.wins}`;
  resetStart();
  say(MESSAGES.win, "ok");

  const isLast = game.level === LEVELS.length - 1;
  nextBtn.textContent = isLast ? "Recommencer le niveau 1" : "Niveau suivant";
  nextBtn.hidden = false;

  animate(
    houseInner,
    [
      { transform: "scale(.85)" },
      { transform: "scale(1.2)" },
      { transform: "scale(1)" },
    ],
    500,
  );
  setTimeout(() => {
    loadLevel(isLast ? 0 : game.level + 1);
  }, 4000);
};

const followTrail = (clientX, clientY) => {
  const { x, y } = toSvgPoint(clientX, clientY);
  game.trail = [...game.trail, `${Math.round(x)},${Math.round(y)}`].slice(-400);
  trailLine.setAttribute("points", game.trail.join(" "));
};

// --- Événements -----------------------------------------------------------
const onPointer = ({ clientX, clientY }) => {
  if (game.phase === "won") return;

  const role = document.elementFromPoint(clientX, clientY)?.dataset.role;

  if (game.phase === "idle") {
    if (role === "start") startRun();
    return;
  }

  switch (role) {
    case "house":
      winRun();
      break;
    case "start":
    case "track":
      followTrail(clientX, clientY);
      break;
    default:
      failRun();
  }
};

svg.addEventListener("pointermove", onPointer);
svg.addEventListener("pointerdown", onPointer);
svg.addEventListener("pointerleave", () => failRun(MESSAGES.leftGame));

nextBtn.addEventListener("click", () => {
  const isLast = game.level === LEVELS.length - 1;
  loadLevel(isLast ? 0 : game.level + 1);
});

levelsBox.append(
  ...LEVELS.map((_, i) => {
    const button = Object.assign(document.createElement("button"), {
      type: "button",
      textContent: String(i + 1),
    });
    button.setAttribute("aria-label", `Niveau ${i + 1}`);
    button.addEventListener("click", () => loadLevel(i));
    return button;
  }),
);

loadLevel(0);
