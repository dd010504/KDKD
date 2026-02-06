const ACCESS_KEY = "NOAXAQ";
const ACCESS_STORAGE_KEY = "puzzleAccess";

const gate = document.getElementById("gate");
const gateForm = document.getElementById("gateForm");
const gatePassword = document.getElementById("gatePassword");
const gateError = document.getElementById("gateError");

const unlockGate = () => {
  if (gate) {
    gate.classList.add("gate-hidden");
  }
  document.body.classList.remove("locked");
  sessionStorage.setItem(ACCESS_STORAGE_KEY, "granted");
};

if (sessionStorage.getItem(ACCESS_STORAGE_KEY) === "granted") {
  unlockGate();
}

if (gateForm && gatePassword) {
  gatePassword.focus();
  gateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const entered = gatePassword.value.trim().toUpperCase();
    if (entered === ACCESS_KEY) {
      unlockGate();
    } else if (gateError) {
      gateError.textContent = "Incorrect passphrase. Try again.";
      gatePassword.value = "";
      gatePassword.focus();
    }
  });
}

const canvas = document.getElementById("gameCanvas");
const minimap = document.getElementById("miniMap");
const keyStatus = document.getElementById("keyStatus");
const gameMessage = document.getElementById("gameMessage");
const startGameButton = document.getElementById("startGame");
const resetGameButton = document.getElementById("resetGame");
const questionModal = document.getElementById("questionModal");
const modalCard = document.getElementById("modalCard");
const guideModal = document.getElementById("guideModal");
const toggleGuide = document.getElementById("toggleGuide");
const closeGuide = document.getElementById("closeGuide");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const modalResult = document.getElementById("modalResult");

const maze = [
  "###############",
  "#@#.......#...#",
  "#.#.#####.#.#.#",
  "#.#.....#.#.#.#",
  "#.#####.#.#.#.#",
  "#.....#.#...#.#",
  "#####.#.#####.#",
  "#.....#.....#.#",
  "#.#########.#.#",
  "#.......#...#.#",
  "#.#####.#.###.#",
  "#...#...#.....#",
  "###.#.#######.#",
  "#...#.....K...#",
  "###############",
];

const tilePalette = {
  wall: "#1e1b4b",
  floor: "#0f172a",
  key: "#f472b6",
  player: "#facc15",
  shower: "#38bdf8",
  clothes: "#facc15",
  flowers: "#fb7185",
  forgotten: "#f59e0b",
  dinner: "#34d399",
  exit: "#22d3ee",
  girl: "#f472b6",
};

const minimapPalette = {
  wall: "#312e81",
  floor: "#1f2937",
};

const stageTitle = document.getElementById("stageTitle");
const stageIntro = document.getElementById("stageIntro");
const objectiveList = document.getElementById("objectiveList");
const timerLabel = document.getElementById("timerLabel");
const inventoryLabel = document.getElementById("inventoryLabel");

const stages = [
  {
    id: 1,
    name: "Stage 1: Get Ready",
    intro: "David wakes up, showers, gets dressed, and heads out the door.",
    timer: null,
    tiles: [
      "###############",
      "#@..S....#....#",
      "#.###.###.#.###",
      "#...#.....#...#",
      "###.#.###.###.#",
      "#...#...#.....#",
      "#.#####.#.###.#",
      "#.....#.#...#.#",
      "#.###.#.###.#.#",
      "#...#.#.....#.#",
      "###.#.#####.#.#",
      "#...#.....#...#",
      "#.#####.#.###.#",
      "#.....C.#....E#",
      "###############",
    ],
    items: [
      { id: "shower", symbol: "S", name: "Take a shower" },
      { id: "clothes", symbol: "C", name: "Put on clothes" },
    ],
    extraObjectives: ["Leave the house"],
    exitText: "Leave the house",
  },
  {
    id: 2,
    name: "Stage 2: Flower Shop",
    intro: "David stops at the flower shop to pick out the perfect bouquet.",
    timer: null,
    tiles: [
      "###############",
      "#@....#.......#",
      "#.###.#.#####.#",
      "#...#.#.....#.#",
      "###.#.###.#.#.#",
      "#...#.....#.#.#",
      "#.#####.###.#.#",
      "#.....#...#...#",
      "#.###.###.###.#",
      "#...#.....#...#",
      "###.#####.#.###",
      "#...#...#.#...#",
      "#.###.#.#.###.#",
      "#...F.#.....E.#",
      "###############",
    ],
    items: [{ id: "flowers", symbol: "F", name: "Buy flowers" }],
    extraObjectives: ["Head out"],
    exitText: "Head out",
  },
  {
    id: 3,
    name: "Stage 3: Back Home",
    intro: "Oh no! David forgot something at home. He has limited time inside!",
    timer: 35,
    tiles: [
      "###############",
      "#@....#.......#",
      "#.###.#.#####.#",
      "#...#.#...#...#",
      "###.#.###.#.#.#",
      "#...#.....#.#.#",
      "#.#####.###.#.#",
      "#.....#...#...#",
      "#.###.###.###.#",
      "#...#.....#...#",
      "###.#####.#.###",
      "#...#...#.#...#",
      "#.###.#.#.###.#",
      "#...B.#.....E.#",
      "###############",
    ],
    items: [{ id: "forgotten", symbol: "B", name: "Grab the forgotten item" }],
    extraObjectives: ["Escape before time runs out"],
    exitText: "Escape before time runs out",
  },
  {
    id: 4,
    name: "Stage 4: Rush to Anju",
    intro: "David rushes to Anju where Kamiliya is waiting.",
    timer: null,
    tiles: [
      "###############",
      "#@....#.......#",
      "#.###.#.#####.#",
      "#...#.#.....#.#",
      "###.#.###.#.#.#",
      "#...#.....#.#.#",
      "#.#####.###.#.#",
      "#.....#...#...#",
      "#.###.###.###.#",
      "#...#.....#...#",
      "###.#####.#.###",
      "#...#...#.#...#",
      "#.###.#.#.###.#",
      "#.....#.....E.#",
      "###############",
    ],
    items: [],
    extraObjectives: ["Arrive at Anju"],
    exitText: "Arrive at Anju",
  },
  {
    id: 5,
    name: "Stage 5: Dinner & Park",
    intro: "David gives her flowers, they eat together, then head to the park.",
    timer: null,
    tiles: [
      "###############",
      "#@....#.......#",
      "#.###.#.#####.#",
      "#...#.#.....#.#",
      "###.#.###.#.#.#",
      "#...#..K..#.#.#",
      "#.#####.###.#.#",
      "#.....#...#...#",
      "#.###.###.###.#",
      "#...#.....#...#",
      "###.#####.#.###",
      "#...#..N#.#...#",
      "#.###.#.#.###.#",
      "#.....#.....E.#",
      "###############",
    ],
    items: [{ id: "dinner", symbol: "N", name: "Eat together" }],
    extraObjectives: ["Give her the flowers", "Drive to the park"],
    exitText: "Drive to the park",
  },
  {
    id: 6,
    name: "Stage 6: The Question",
    intro: "David is ready. Meet Kamiliya at the park.",
    timer: null,
    tiles: [
      "###############",
      "#@....#.......#",
      "#.###.#.#####.#",
      "#...#.#.....#.#",
      "###.#.###.#.#.#",
      "#...#.....#.#.#",
      "#.#####.###.#.#",
      "#.....#...#...#",
      "#.###.###.###.#",
      "#...#.....#...#",
      "###.#####.#.###",
      "#...#.....#...#",
      "#.###.#.#.###.#",
      "#.....#...K...#",
      "###############",
    ],
    items: [],
    extraObjectives: ["Ask the question"],
    exitText: "Ask the question",
  },
];

let currentStageIndex = 0;
let currentMaze = [];
let player = { x: 1, y: 1 };
let gameActive = false;
let stageTimer = null;
let timeRemaining = null;
let inventory = {
  flowers: false,
  forgotten: false,
};
let davidState = "sleepy";
let gaveFlowers = false;

const getTile = (x, y) => currentMaze[y]?.[x] ?? "#";

const setTile = (x, y, value) => {
  if (!currentMaze[y]) {
    return;
  }
  currentMaze[y][x] = value;
};

const getDavidColor = () => {
  if (davidState === "showered") {
    return "#38bdf8";
  }
  if (davidState === "dressed") {
    return "#facc15";
  }
  return "#f8fafc";
};

const getDavidOutline = () => {
  if (davidState === "dressed") {
    return "#0b1120";
  }
  return null;
};

const updateInventoryLabel = () => {
  if (!inventoryLabel) {
    return;
  }
  const items = [];
  if (inventory.flowers) {
    items.push("Flowers");
  }
  if (inventory.forgotten) {
    items.push("Forgotten item");
  }
  inventoryLabel.textContent = `Inventory: ${items.length ? items.join(", ") : "Empty"}`;
};

const updateObjectives = (stage) => {
  if (!objectiveList) {
    return;
  }
  objectiveList.innerHTML = "";
  stage.items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name;
    objectiveList.appendChild(li);
  });
  if (stage.extraObjectives?.length) {
    stage.extraObjectives.forEach((objective) => {
      const li = document.createElement("li");
      li.textContent = objective;
      objectiveList.appendChild(li);
    });
  } else {
    const exitItem = document.createElement("li");
    exitItem.textContent = stage.exitText;
    objectiveList.appendChild(exitItem);
  }
};

const updateStageUI = () => {
  const stage = stages[currentStageIndex];
  if (!stage) {
    return;
  }
  if (stageTitle) {
    stageTitle.textContent = stage.name;
  }
  if (stageIntro) {
    stageIntro.textContent = stage.intro;
  }
  updateObjectives(stage);
  updateInventoryLabel();
  if (timerLabel) {
    timerLabel.textContent = stage.timer
      ? `Time: ${timeRemaining ?? stage.timer}s`
      : "Time: --";
  }
};

const clearTimer = () => {
  if (stageTimer) {
    window.clearInterval(stageTimer);
    stageTimer = null;
  }
};

const startTimer = (seconds) => {
  clearTimer();
  timeRemaining = seconds;
  if (timerLabel) {
    timerLabel.textContent = `Time: ${timeRemaining}s`;
  }
  stageTimer = window.setInterval(() => {
    if (timeRemaining === null) {
      return;
    }
    timeRemaining -= 1;
    if (timerLabel) {
      timerLabel.textContent = `Time: ${timeRemaining}s`;
    }
    if (timeRemaining <= 0) {
      clearTimer();
      if (gameMessage) {
        gameMessage.textContent = "Time's up! Try again.";
      }
      loadStage(currentStageIndex);
    }
  }, 1000);
};

const loadStage = (index) => {
  const stage = stages[index];
  if (!stage) {
    return;
  }
  currentStageIndex = index;
  currentMaze = stage.tiles.map((row) => row.split(""));
  stage.items.forEach((item) => {
    item.collected = false;
  });
  if (stage.id === 5) {
    gaveFlowers = false;
  }
  let startFound = false;
  currentMaze.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "@") {
        player = { x, y };
        startFound = true;
        setTile(x, y, ".");
      }
    });
  });
  if (!startFound) {
    player = { x: 1, y: 1 };
  }
  if (stage.id === 1) {
    davidState = "sleepy";
  }
  if (stage.timer) {
    startTimer(stage.timer);
  } else {
    clearTimer();
    timeRemaining = null;
  }
  if (gameMessage) {
    gameMessage.textContent = "Explore the maze.";
  }
  if (keyStatus) {
    keyStatus.textContent = "In progress";
  }
  updateStageUI();
  draw();
};

const resetGame = () => {
  inventory = {
    flowers: false,
    forgotten: false,
  };
  davidState = "sleepy";
  gameActive = true;
  if (keyStatus) {
    keyStatus.textContent = "In progress";
  }
  if (modalResult) {
    modalResult.textContent = "";
  }
  loadStage(0);
};

const sizeCanvas = () => {
  if (!canvas) {
    return;
  }
  const wrapper = canvas.parentElement;
  if (!wrapper) {
    return;
  }
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  if (width === 0 || height === 0) {
    return;
  }
  canvas.width = width;
  canvas.height = height;
  if (minimap) {
    minimap.width = 140;
    minimap.height = 140;
  }
};

const getTileSize = () => {
  if (!canvas) {
    return 32;
  }
  if (!currentMaze.length) {
    return 32;
  }
  return Math.floor(
    Math.min(canvas.width / currentMaze[0].length, canvas.height / currentMaze.length)
  );
};

const draw = () => {
  if (!canvas) {
    return;
  }
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  if (!currentMaze.length) {
    return;
  }
  sizeCanvas();
  context.clearRect(0, 0, canvas.width, canvas.height);
  const tileSize = getTileSize();
  const boardWidth = currentMaze[0].length * tileSize;
  const boardHeight = currentMaze.length * tileSize;
  const offsetX = Math.floor((canvas.width - boardWidth) / 2);
  const offsetY = Math.floor((canvas.height - boardHeight) / 2);

  currentMaze.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === "#") {
        context.fillStyle = tilePalette.wall;
        context.fillRect(
          offsetX + x * tileSize,
          offsetY + y * tileSize,
          tileSize,
          tileSize
        );
      } else {
        context.fillStyle = tilePalette.floor;
        context.fillRect(
          offsetX + x * tileSize,
          offsetY + y * tileSize,
          tileSize,
          tileSize
        );
      }
      if (cell === "S") {
        context.fillStyle = tilePalette.shower;
        context.fillRect(
          offsetX + x * tileSize + tileSize * 0.25,
          offsetY + y * tileSize + tileSize * 0.25,
          tileSize * 0.5,
          tileSize * 0.5
        );
      }
      if (cell === "C") {
        context.fillStyle = tilePalette.clothes;
        context.fillRect(
          offsetX + x * tileSize + tileSize * 0.2,
          offsetY + y * tileSize + tileSize * 0.2,
          tileSize * 0.6,
          tileSize * 0.6
        );
      }
      if (cell === "F") {
        context.fillStyle = tilePalette.flowers;
        context.beginPath();
        context.arc(
          offsetX + x * tileSize + tileSize / 2,
          offsetY + y * tileSize + tileSize / 2,
          tileSize / 4,
          0,
          Math.PI * 2
        );
        context.fill();
      }
      if (cell === "B") {
        context.fillStyle = tilePalette.forgotten;
        context.fillRect(
          offsetX + x * tileSize + tileSize * 0.2,
          offsetY + y * tileSize + tileSize * 0.2,
          tileSize * 0.6,
          tileSize * 0.6
        );
      }
      if (cell === "N") {
        context.fillStyle = tilePalette.dinner;
        context.beginPath();
        context.arc(
          offsetX + x * tileSize + tileSize / 2,
          offsetY + y * tileSize + tileSize / 2,
          tileSize / 4,
          0,
          Math.PI * 2
        );
        context.fill();
      }
      if (cell === "E") {
        context.fillStyle = tilePalette.exit;
        context.fillRect(
          offsetX + x * tileSize + tileSize * 0.15,
          offsetY + y * tileSize + tileSize * 0.15,
          tileSize * 0.7,
          tileSize * 0.7
        );
      }
      if (cell === "K") {
        context.fillStyle = tilePalette.girl;
        context.beginPath();
        context.arc(
          offsetX + x * tileSize + tileSize / 2,
          offsetY + y * tileSize + tileSize / 2,
          tileSize / 3,
          0,
          Math.PI * 2
        );
        context.fill();
      }
    });
  });

  context.fillStyle = getDavidColor();
  context.beginPath();
  context.arc(
    offsetX + player.x * tileSize + tileSize / 2,
    offsetY + player.y * tileSize + tileSize / 2,
    tileSize / 3,
    0,
    Math.PI * 2
  );
  context.fill();

  const outline = getDavidOutline();
  if (outline) {
    context.strokeStyle = outline;
    context.lineWidth = Math.max(2, tileSize / 10);
    context.beginPath();
    context.arc(
      offsetX + player.x * tileSize + tileSize / 2,
      offsetY + player.y * tileSize + tileSize / 2,
      tileSize / 3,
      0,
      Math.PI * 2
    );
    context.stroke();
  }

  drawMinimap();
};

const drawMinimap = () => {
  if (!minimap) {
    return;
  }
  const ctx = minimap.getContext("2d");
  if (!ctx) {
    return;
  }
  const scale = minimap.width / currentMaze[0].length;
  ctx.clearRect(0, 0, minimap.width, minimap.height);
  currentMaze.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      ctx.fillStyle = cell === "#" ? minimapPalette.wall : minimapPalette.floor;
      ctx.fillRect(x * scale, y * scale, scale, scale);
      if (cell === "F" || cell === "B" || cell === "N" || cell === "S" || cell === "C") {
        ctx.fillStyle = tilePalette.key;
        ctx.fillRect(
          x * scale + scale * 0.25,
          y * scale + scale * 0.25,
          scale * 0.5,
          scale * 0.5
        );
      }
      if (cell === "K") {
        ctx.fillStyle = tilePalette.girl;
        ctx.fillRect(
          x * scale + scale * 0.25,
          y * scale + scale * 0.25,
          scale * 0.5,
          scale * 0.5
        );
      }
    });
  });
  ctx.fillStyle = getDavidColor();
  ctx.fillRect(
    player.x * scale + scale * 0.25,
    player.y * scale + scale * 0.25,
    scale * 0.5,
    scale * 0.5
  );
};

const isStageComplete = (stage) => {
  const allCollected = stage.items.every((item) => item.collected);
  if (stage.id === 5) {
    return allCollected && gaveFlowers;
  }
  return allCollected;
};

const handleTileAction = (cell) => {
  const stage = stages[currentStageIndex];
  if (!stage) {
    return;
  }
  const item = stage.items.find((stageItem) => stageItem.symbol === cell);
  if (item && !item.collected) {
    item.collected = true;
    if (item.id === "shower") {
      davidState = "showered";
      if (gameMessage) {
        gameMessage.textContent = "Showered! Now get dressed.";
      }
    }
    if (item.id === "clothes") {
      davidState = "dressed";
      if (gameMessage) {
        gameMessage.textContent = "Dressed! Head out the door.";
      }
    }
    if (item.id === "flowers") {
      inventory.flowers = true;
      if (gameMessage) {
        gameMessage.textContent = "Flowers secured!";
      }
    }
    if (item.id === "forgotten") {
      inventory.forgotten = true;
      if (gameMessage) {
        gameMessage.textContent = "Got it! Get out fast!";
      }
    }
    if (item.id === "dinner") {
      if (gameMessage) {
        gameMessage.textContent = "Dinner done. Head to the park.";
      }
    }
    updateInventoryLabel();
    setTile(player.x, player.y, ".");
  }

  if (cell === "K") {
    if (stage.id === 5) {
      if (inventory.flowers) {
        gaveFlowers = true;
        if (gameMessage) {
          gameMessage.textContent = "Flowers delivered. Enjoy dinner!";
        }
      } else if (gameMessage) {
        gameMessage.textContent = "You need flowers first!";
      }
    }
    if (stage.id === 6) {
      openQuestion();
    }
  }

  if (cell === "E" && isStageComplete(stage)) {
    if (currentStageIndex < stages.length - 1) {
      loadStage(currentStageIndex + 1);
    }
  } else if (cell === "E" && gameMessage) {
    gameMessage.textContent = "Finish the objectives before leaving.";
  }
};

const movePlayer = (dx, dy) => {
  if (!gameActive) {
    return;
  }
  const nextX = player.x + dx;
  const nextY = player.y + dy;
  if (getTile(nextX, nextY) === "#") {
    return;
  }
  player = { x: nextX, y: nextY };
  const cell = getTile(player.x, player.y);
  handleTileAction(cell);

  const stage = stages[currentStageIndex];
  if (keyStatus && stage) {
    const completed = isStageComplete(stage);
    keyStatus.textContent = completed ? "Objectives done" : "In progress";
  }
  draw();
};

const openQuestion = () => {
  if (!questionModal) {
    return;
  }
  questionModal.classList.remove("hidden");
  questionModal.setAttribute("aria-hidden", "false");
};

const closeQuestion = () => {
  if (!questionModal) {
    return;
  }
  questionModal.classList.add("hidden");
  questionModal.setAttribute("aria-hidden", "true");
};

const showGuide = () => {
  if (!guideModal) {
    return;
  }
  guideModal.classList.remove("hidden");
  guideModal.setAttribute("aria-hidden", "false");
};

const hideGuide = () => {
  if (!guideModal) {
    return;
  }
  guideModal.classList.add("hidden");
  guideModal.setAttribute("aria-hidden", "true");
};

const moveNoButton = () => {
  if (!noButton || !modalCard) {
    return;
  }
  const bounds = modalCard.getBoundingClientRect();
  const buttonBounds = noButton.getBoundingClientRect();
  const padding = 16;
  const maxX = bounds.width - buttonBounds.width - padding;
  const maxY = bounds.height - buttonBounds.height - padding;
  const randomX = Math.max(padding, Math.random() * maxX);
  const randomY = Math.max(padding, Math.random() * maxY);
  noButton.style.position = "absolute";
  noButton.style.left = `${randomX}px`;
  noButton.style.top = `${randomY}px`;
};

if (startGameButton) {
  startGameButton.addEventListener("click", () => {
    if (!gameActive) {
      resetGame();
    }
  });
}

if (resetGameButton) {
  resetGameButton.addEventListener("click", resetGame);
}

if (toggleGuide) {
  toggleGuide.addEventListener("click", showGuide);
}

if (closeGuide) {
  closeGuide.addEventListener("click", hideGuide);
}

if (yesButton) {
  yesButton.addEventListener("click", () => {
    if (modalResult) {
      modalResult.textContent = "Send this to David: \"choppleganger4life\"";
    }
    if (yesButton) {
      yesButton.disabled = true;
    }
  });
}

if (noButton) {
  ["mouseenter", "focus"].forEach((eventName) => {
    noButton.addEventListener(eventName, moveNoButton);
  });
}

document.addEventListener("keydown", (event) => {
  if (!gameActive) {
    return;
  }
  const key = event.key;
  if (key === "ArrowUp") {
    event.preventDefault();
    movePlayer(0, -1);
  } else if (key === "ArrowDown") {
    event.preventDefault();
    movePlayer(0, 1);
  } else if (key === "ArrowLeft") {
    event.preventDefault();
    movePlayer(-1, 0);
  } else if (key === "ArrowRight") {
    event.preventDefault();
    movePlayer(1, 0);
  }
});

window.addEventListener("resize", () => {
  draw();
});

resetGame();
