const words = [
  // Nature & Weather
  "rainbow", "thunderstorm", "tornado", "hurricane", "sunshine", "avalanche", "earthquake", "blizzard", "forest", "meadow",
  "mountain", "river", "ocean", "valley", "volcano", "desert", "island", "breeze", "tsunami", "lightning",

  // Animals
  "zebra", "tiger", "lion", "elephant", "giraffe", "kangaroo", "penguin", "dolphin", "whale", "falcon",
  "panther", "cheetah", "rhino", "koala", "panda", "otter", "wolf", "fox", "rabbit", "swan",

  // Fantasy & Mythical
  "dragon", "unicorn", "phoenix", "griffin", "mermaid", "centaur", "wizard", "sorceress", "princess", "castle",
  "kingdom", "knight", "goblin", "troll", "fairy", "vampire", "werewolf", "witch", "crystal", "sword",

  // Space & Sci-Fi
  "galaxy", "nebula", "asteroid", "comet", "planet", "satellite", "starlight", "cosmos", "spaceship", "meteor",
  "blackhole", "supernova", "astronaut", "gravity", "orbit", "quantum", "robot", "android", "teleport", "dimension",

  // Technology
  "javascript", "computer", "keyboard", "monitor", "internet", "software", "hardware", "programmer", "database", "encryption",
  "network", "website", "algorithm", "compiler", "function", "variable", "console", "debugger", "interface", "binary",

  // Emotions & Abstract
  "courage", "hope", "friendship", "loyalty", "kindness", "bravery", "honesty", "compassion", "wisdom", "patience",
  "freedom", "destiny", "truth", "faith", "justice", "love", "dream", "peace", "memory", "sacrifice",

  // Food & Objects
  "chocolate", "pumpkin", "strawberry", "cupcake", "pancake", "pizza", "sandwich", "icecream", "cookie", "donut",
  "teapot", "blanket", "lantern", "backpack", "compass", "camera", "guitar", "umbrella", "notebook", "bicycle",

  // Misc / Fun
  "holiday", "festival", "adventure", "mystery", "journey", "treasure", "island", "pirate", "explorer", "voyage",
  "rainbow", "sparkle", "dreamer", "whisper", "moonlight", "sunflower", "starship", "laughter", "midnight", "miracle"
];
let wins = parseInt(localStorage.getItem("wins")) || 0;
let losses = parseInt(localStorage.getItem("losses")) || 0;
let chosenWord = "";
let displayWord = [];
let attempts = 0;
const maxAttempts = 6;

function drawHangman(stage) {
  const parts = [
    `
     +---+
     |   |
         |
         |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
         |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
     |   |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
    /|   |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
    /|\\  |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
    /|\\  |
    /    |
         |
    =========`,
    `
     +---+
     |   |
     O   |
    /|\\  |
    / \\  |
         |
    =========`
  ];
  document.getElementById("hangman").textContent = parts[stage];
}

function startGame() {
  chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
  displayWord = Array(chosenWord.length).fill("_");
  attempts = 0;
  drawHangman(attempts);
  document.getElementById("message").textContent = "";
  document.getElementById("reset").style.display = "none";
  updateWordDisplay();
  createLetterButtons();
}

function updateWordDisplay() {
  document.getElementById("word").textContent = displayWord.join(" ");
}

function createLetterButtons() {
  const container = document.getElementById("letters");
  container.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement("button");
    button.textContent = letter;
    button.onclick = () => guess(letter, button);
    container.appendChild(button);
  }
}

function guess(letter, button) {
  button.disabled = true;
  let correct = false;

  for (let i = 0; i < chosenWord.length; i++) {
    if (chosenWord[i] === letter) {
      displayWord[i] = letter;
      correct = true;
    }
  }

  if (!correct) {
    attempts++;
    drawHangman(attempts);
  }

  updateWordDisplay();

  if (!displayWord.includes("_")) {
    document.getElementById("message").textContent = "🎉 You win!";
    wins++;
    localStorage.setItem("wins", wins);
    endGame();
  } else if (attempts >= maxAttempts) {
    document.getElementById("message").textContent = `💀 You lose! The word was ${chosenWord}.`;
    losses++;
    localStorage.setItem("losses", losses);

    endGame();
  }
  updateScoreDisplay();
}

function endGame() {
  document.querySelectorAll("#letters button").forEach(b => b.disabled = true);
  document.getElementById("reset").style.display = "inline-block";
}

function updateScoreDisplay() {
  document.getElementById("score").textContent = `🏆 Wins: ${wins} | 💀 Losses: ${losses}`;
}


startGame();
