import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

/* ================= DOM ================= */
const flaggedDiv = document.getElementById("flagged");
const roomsDiv = document.getElementById("rooms");

/* ================= FLAGGED POSTS ================= */
const flaggedQuery = query(
  collection(db, "posts"),
  where("riskLevel", "in", ["medium", "high"])
);

onSnapshot(flaggedQuery, (snap) => {
  flaggedDiv.innerHTML = "";

  snap.forEach((docSnap) => {
    const d = docSnap.data();

    const card = document.createElement("div");
    card.className = "card";

    const btn = document.createElement("button");
    btn.innerText = "Create SafeSpace";

    btn.onclick = async () => {
      await addDoc(collection(db, "safespaceRooms"), {
        userId: d.userId,
        supporterId: "supporter_1",
        status: "pending",
        createdAt: serverTimestamp()
      });

      btn.innerText = "SafeSpace Created";
      btn.disabled = true;
    };

    card.innerHTML = `
      <p><b>User:</b> ${d.userId}</p>
      <p>${d.text}</p>
      <p><b>Risk:</b> ${d.riskLevel}</p>
    `;

    card.appendChild(btn);
    flaggedDiv.appendChild(card);
  });
});

/* ================= ACTIVE ROOMS ================= */
const roomsQuery = query(
  collection(db, "safespaceRooms"),
  where("status", "==", "active")
);

onSnapshot(roomsQuery, (snap) => {
  roomsDiv.innerHTML = "";

  snap.forEach((roomDoc) => {
    const room = roomDoc.data();
    const roomId = roomDoc.id;

    const card = document.createElement("div");
    card.className = "card";

    const chatBox = document.createElement("div");
    chatBox.className = "chat";

    card.innerHTML = `
      <p><b>User:</b> ${room.userId}</p>
      <p><b>Status:</b> Active</p>
    `;

    const msgInput = document.createElement("input");
    msgInput.placeholder = "Type message…";
    msgInput.style.width = "70%";

    const sendBtn = document.createElement("button");
    sendBtn.innerText = "Send";

    sendBtn.onclick = async () => {
      if (!msgInput.value.trim()) return;

      await addDoc(
        collection(db, "safespaceRooms", roomId, "messages"),
        {
          sender: "supporter",
          text: msgInput.value,
          timestamp: serverTimestamp()
        }
      );

      msgInput.value = "";
    };

    const msgsQuery = query(
      collection(db, "safespaceRooms", roomId, "messages"),
      orderBy("timestamp")
    );

    onSnapshot(msgsQuery, (msgsSnap) => {
      chatBox.innerHTML = "";
      msgsSnap.forEach((m) => {
        const msg = m.data();
        const p = document.createElement("div");
        p.className = `msg ${msg.sender}`;
        p.innerText = msg.text;
        chatBox.appendChild(p);
      });
    });

    card.appendChild(chatBox);
    card.appendChild(msgInput);
    card.appendChild(sendBtn);

    roomsDiv.appendChild(card);
  });
});
