// --- Firebase setup ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCIUd6ckCecFB7pqG82OptO_5GCuLPGAmY",
  authDomain: "hanggirl-game.firebaseapp.com",
  projectId: "hanggirl-game",
  storageBucket: "hanggirl-game.appspot.com",
  messagingSenderId: "671586933731",
  appId: "1:671586933731:web:309592c8e03a58f9931ed6",
  measurementId: "G-2WK4BRTVDK"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Local storage handling ---
let wins = localStorage.getItem("wins");
let losses = localStorage.getItem("losses");
wins = wins !== null ? parseInt(wins) : 0;
losses = losses !== null ? parseInt(losses) : 0;

// --- Game state ---
let words = [];
let chosenWord = "";
let displayWord = [];
let attempts = 0;
const maxAttempts = 6;

// --- Load words from Firestore ---
async function loadWords() {
  try {
    console.log("📡 Fetching words from Firestore...");
    const ref = doc(db, "config", "words");
    const snap = await getDoc(ref);

    if (snap.exists()) {
      words = snap.data().list;
      console.log(`✅ Loaded ${words.length} words from Firestore.`);
    } else {
      console.warn("⚠️ No words document found, using fallback.");
      words = ["fallback", "test", "error"];
    }
  } catch (err) {
    console.error("🔥 Error fetching words:", err);
    words = ["offline", "test", "error"];
  }

  startGame(); // ✅ always start game after words loaded
}

// --- Game Logic ---
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
  if (!words.length) return console.error("⚠️ No words loaded yet!");
  chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
  displayWord = Array(chosenWord.length).fill("_");
  attempts = 0;
  drawHangman(attempts);
  document.getElementById("message").textContent = "";
  document.getElementById("reset").style.display = "none";
  updateWordDisplay();
  createLetterButtons();
  updateScoreDisplay();
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
  document.querySelectorAll("#letters button").forEach(b => (b.disabled = true));
  document.getElementById("reset").style.display = "inline-block";
}

// --- UI Updates ---
function updateScoreDisplay() {
  document.getElementById("score").textContent = `🏆 Wins: ${wins} | 💀 Losses: ${losses}`;
}

// --- Hook up the Play Again button ---
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("reset").addEventListener("click", startGame);
  loadWords();
});


