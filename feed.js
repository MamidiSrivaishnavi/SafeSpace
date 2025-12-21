/*
FINAL DEMO VERSION — NO GEMINI
Deterministic keyword-based routing
*/

// =======================
// IMPORTS
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { triggerStitchWorkflow } from "./stitchTrigger.js";

// =======================
// FIREBASE CONFIG
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyCjszAKobObSencoB6xfRm8vKSgTh9lE6w",
  authDomain: "safespace-e4b6b.firebaseapp.com",
  projectId: "safespace-e4b6b",
  storageBucket: "safespace-e4b6b.firebasestorage.app",
  messagingSenderId: "130138741370",
  appId: "1:130138741370:web:0ed3dee0ac4486cf5639c3"
};

// =======================
// INIT FIREBASE
// =======================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// =======================
// HARD-CODED KEYWORDS
// =======================
const HIGH_RISK = [
  "suicide",
  "kill myself",
  "want to die",
  "end my life",
  "don't want to live",
  "die"
];

const MEDIUM_RISK = [
  "overwhelmed",
  "anxious",
  "stressed",
  "lonely",
  "ashamed",
  "exhausted",
  "empty",
  "burnt out",
  "panic",
  "worthless",
  "mocking",
  "body",
  "weight",
  "tired"
];

// =======================
// JULES AGENT — DECISION
// =======================
function julesDecision(riskLevel) {
  if (riskLevel === "high") {
    return {
      action: "ESCALATE",
      route: "SUPPORTER_PSYCHOLOGIST",
      autoResponse: "💛 You are not alone. Immediate support is available."
    };
  }

  if (riskLevel === "medium") {
    return {
      action: "ESCALATE",
      route: "SUPPORTER_ONLY",
      autoResponse: "💛 Thanks for sharing. A supporter can talk with you."
    };
  }

  return {
    action: "NONE",
    route: "NONE",
    autoResponse: null
  };
}

// =======================
// ANONYMOUS USER SETUP
// =======================
async function setupAnonymousUser(uid) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const anonName = "User_" + Math.random().toString(36).substring(2, 8);

    await setDoc(userRef, {
      uid,
      anonUsername: anonName,
      createdAt: serverTimestamp()
    });

    return anonName;
  }

  return snap.data().anonUsername;
}

// =======================
// AUTH
// =======================
let currentUserId = null;
signInAnonymously(auth).catch(() => {});

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUserId = user.uid;
  const anon = await setupAnonymousUser(user.uid);
  console.log("👤 Anonymous:", anon);
});

// =======================
// MOOD
// =======================
const mood = localStorage.getItem("userMood") || "Not set";
document.getElementById("currentMood").innerText = mood;

// =======================
// DOM
// =======================
const postBtn = document.getElementById("postBtn");
const postText = document.getElementById("postText");
const postsDiv = document.getElementById("posts");

// =======================
// ADD POST
// =======================
postBtn.addEventListener("click", async () => {
  const text = postText.value.trim();
  if (!text) return;

  const lower = text.toLowerCase();
  let riskLevel = "low";

  if (HIGH_RISK.some(w => lower.includes(w))) {
    riskLevel = "high";
  } else if (MEDIUM_RISK.some(w => lower.includes(w))) {
    riskLevel = "medium";
  }

  const agent = julesDecision(riskLevel);

  if (agent.action !== "NONE") {
    triggerStitchWorkflow({
      userId: currentUserId,
      riskLevel,
      action: agent.action,
      timestamp: new Date().toISOString()
    });
  }

  await addDoc(collection(db, "posts"), {
    text,
    mood,
    userId: currentUserId,
    timestamp: serverTimestamp(),
    reactions: { heart: 0, smile: 0, support: 0 },
    flagged: riskLevel === "high",
    riskLevel,
    agentAction: agent.action,
    agentRoute: agent.route,
    agentMessage: agent.autoResponse
  });

  postText.value = "";
});

// =======================
// REAL-TIME FEED
// =======================
const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
  postsDiv.innerHTML = "";

  snapshot.forEach((snap) => {
    const d = snap.data();

    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
      <p><strong>Mood:</strong> ${d.mood}</p>
      <p>${d.text}</p>
      <div class="reactions">
        <span class="react" data-type="heart">❤️ ${d.reactions.heart}</span>
        <span class="react" data-type="smile">🙂 ${d.reactions.smile}</span>
        <span class="react" data-type="support">🤍 ${d.reactions.support}</span>
      </div>
    `;

    post.querySelectorAll(".react").forEach((btn) => {
      btn.onclick = async () => {
        const type = btn.dataset.type;
        await updateDoc(doc(db, "posts", snap.id), {
          [`reactions.${type}`]: increment(1)
        });
      };
    });

    postsDiv.appendChild(post);
  });
});
