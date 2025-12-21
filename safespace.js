import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: "AIzaSyCjszAKobObSencoB6xfRm8vKSgTh9lE6w",
  authDomain: "safespace-e4b6b.firebaseapp.com",
  projectId: "safespace-e4b6b",
  storageBucket: "safespace-e4b6b.firebasestorage.app",
  messagingSenderId: "130138741370",
  appId: "1:130138741370:web:0ed3dee0ac4486cf5639c3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* ================= DOM ================= */
const chatDiv = document.getElementById("chat");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const closeBtn = document.getElementById("closeBtn");
const reopenBtn = document.getElementById("reopenBtn");

const requestBox = document.getElementById("requestBox");
const closedBox = document.getElementById("closedBox");
const inputBox = document.getElementById("inputBox");

const acceptBtn = document.getElementById("acceptBtn");
const declineBtn = document.getElementById("declineBtn");

let roomId = null;
let unsubscribeMessages = null;
let currentUserId = null;

/* ================= AUTH + ROOM LISTENER ================= */
onAuthStateChanged(auth, (user) => {
  if (!user) return;

  currentUserId = user.uid;

  const q = query(
    collection(db, "safespaceRooms"),
    where("userId", "==", currentUserId)
  );

  onSnapshot(q, (snap) => {
    resetUI();

    if (snap.empty) {
      chatDiv.innerHTML = "<p>No SafeSpace room assigned.</p>";
      return;
    }

    const roomDoc = snap.docs[0];
    roomId = roomDoc.id;
    const status = roomDoc.data().status;

    if (status === "pending") showPending();
    if (status === "active") showActive();
    if (status === "closed") showClosed();
  });
});

/* ================= UI STATES ================= */
function resetUI() {
  requestBox.style.display = "none";
  closedBox.style.display = "none";
  chatDiv.style.display = "none";
  inputBox.style.display = "none";
}

function showPending() {
  requestBox.style.display = "block";
}

function showActive() {
  chatDiv.style.display = "block";
  inputBox.style.display = "block";
  loadMessages();
}

function showClosed() {
  closedBox.style.display = "block";
}

/* ================= MESSAGES ================= */
function loadMessages() {
  if (unsubscribeMessages) unsubscribeMessages();

  const q = query(
    collection(db, "safespaceRooms", roomId, "messages"),
    orderBy("timestamp")
  );

  unsubscribeMessages = onSnapshot(q, (snap) => {
    chatDiv.innerHTML = "";
    snap.forEach((d) => {
      const m = d.data();
      const div = document.createElement("div");
      div.className = `msg ${m.sender}`;
      div.innerText = m.text;
      chatDiv.appendChild(div);
    });
  });
}

/* ================= ACTIONS ================= */
sendBtn.onclick = async () => {
  if (!msgInput.value.trim()) return;

  await addDoc(
    collection(db, "safespaceRooms", roomId, "messages"),
    {
      sender: "user",
      text: msgInput.value,
      timestamp: serverTimestamp()
    }
  );

  msgInput.value = "";
};

closeBtn.onclick = async () => {
  await updateDoc(doc(db, "safespaceRooms", roomId), {
    status: "closed"
  });
};

reopenBtn.onclick = async () => {
  await updateDoc(doc(db, "safespaceRooms", roomId), {
    status: "active"
  });
};

acceptBtn.onclick = async () => {
  await updateDoc(doc(db, "safespaceRooms", roomId), {
    status: "active"
  });
};

declineBtn.onclick = async () => {
  await updateDoc(doc(db, "safespaceRooms", roomId), {
    status: "closed"
  });
};
