console.log("🔥 Script is running!");
process.on("unhandledRejection", err => console.error("❌ Unhandled:", err));
process.on("uncaughtException", err => console.error("💥 Crash:", err));



// script/uploadWords.js
import admin from "firebase-admin";
import fs from "fs";

// 🟣 Make absolutely sure this file path is correct:
const keyPath = "C:/Users/trans/Documents/hanggirl-back/serviceAccountKey.json";
console.log("🔑 Loading key from:", keyPath);

// 🔧 Load service account
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

// 🚀 Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 📂 Load your JSON file
const wordsFile = "./json/words.json";
console.log("📄 Reading:", wordsFile);
const data = JSON.parse(fs.readFileSync(wordsFile, "utf8"));

// 🧠 Check file contents
console.log("🧩 Found", data.list?.length || 0, "words");

// ⚡ Upload to Firestore
(async () => {
  try {
    console.log("📡 Uploading to Firestore...");
    await db.collection("config").doc("words").set(data);
    console.log("✅ Successfully uploaded words to Firestore!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    process.exit(1);
  }
})();



