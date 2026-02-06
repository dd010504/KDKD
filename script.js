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

const tileSize = 32;
let player = { x: 1, y: 1 };
let hasKey = false;
let gameActive = false;

const getTile = (x, y) => maze[y]?.[x] ?? "#";

const resetGame = () => {
  player = { x: 1, y: 1 };
  hasKey = false;
  gameActive = true;
  if (keyStatus) {
    keyStatus.textContent = "Key hidden";
  }
  if (gameMessage) {
    gameMessage.textContent = "Find the key to continue.";
  }
  if (modalResult) {
    modalResult.textContent = "";
  }
  draw();
};

const draw = () => {
  if (!canvas) {
    return;
  }
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  canvas.width = maze[0].length * tileSize;
  canvas.height = maze.length * tileSize;
  context.clearRect(0, 0, canvas.width, canvas.height);

  maze.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === "#") {
        context.fillStyle = "#0b1120";
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else {
        context.fillStyle = "#111827";
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
      if (cell === "K" && !hasKey) {
        context.fillStyle = "#38bdf8";
        context.beginPath();
        context.arc(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          tileSize / 4,
          0,
          Math.PI * 2
        );
        context.fill();
      }
    });
  });

  context.fillStyle = "#fbbf24";
  context.beginPath();
  context.arc(
    player.x * tileSize + tileSize / 2,
    player.y * tileSize + tileSize / 2,
    tileSize / 3,
    0,
    Math.PI * 2
  );
  context.fill();

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
  const scale = minimap.width / maze[0].length;
  ctx.clearRect(0, 0, minimap.width, minimap.height);
  maze.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      ctx.fillStyle = cell === "#" ? "#0b1120" : "#1f2937";
      ctx.fillRect(x * scale, y * scale, scale, scale);
      if (cell === "K" && !hasKey) {
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(
          x * scale + scale * 0.25,
          y * scale + scale * 0.25,
          scale * 0.5,
          scale * 0.5
        );
      }
    });
  });
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(
    player.x * scale + scale * 0.25,
    player.y * scale + scale * 0.25,
    scale * 0.5,
    scale * 0.5
  );
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
  if (getTile(player.x, player.y) === "K" && !hasKey) {
    hasKey = true;
    if (keyStatus) {
      keyStatus.textContent = "Key found";
    }
    if (gameMessage) {
      gameMessage.textContent = "Key found! The question awaits...";
    }
    openQuestion();
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
    movePlayer(0, -1);
  } else if (key === "ArrowDown") {
    movePlayer(0, 1);
  } else if (key === "ArrowLeft") {
    movePlayer(-1, 0);
  } else if (key === "ArrowRight") {
    movePlayer(1, 0);
  }
});

resetGame();
