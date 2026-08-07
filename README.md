# 🛡️ SafeSpace

**SafeSpace** is an AI-powered anonymous mental wellness platform that enables users to express their thoughts freely without revealing their identity. The platform combines anonymous posting with emotion analysis to create a supportive, judgment-free environment while promoting responsible AI-assisted mental health support.

> ⚠️ **Disclaimer:** SafeSpace is **not** a replacement for professional medical or psychological care. It is designed to encourage emotional expression and provide supportive responses.

---

## 🌟 Features

### 🔒 Anonymous Authentication
- Secure anonymous login using Firebase Authentication.
- No personal information is required.
- Every user receives a unique anonymous ID.

### 😊 Mood Selection
- Users can choose their current mood before posting.
- Helps provide additional emotional context.

### 📝 Anonymous Posting
- Share thoughts anonymously.
- Posts are visible to everyone without revealing identities.

### 🤖 AI Emotion Analysis
- Powered by Google Gemini.
- Detects the emotional tone of each post.
- Generates:
  - Emotion label
  - Confidence score
  - Calm and supportive AI response

### 📡 Real-Time Community Feed
- Displays the latest anonymous posts instantly.
- Shows:
  - Selected mood
  - Detected emotion
  - AI-generated support message
  - Timestamp

### 🛡️ Safe & Supportive Environment
- Encourages positive interactions.
- Designed to reduce stigma around discussing emotions.

---

# 🏗️ System Architecture

```
                User
                  │
                  ▼
      Firebase Anonymous Auth
                  │
                  ▼
      Mood + Anonymous Post
                  │
                  ▼
          Google Gemini AI
        (Emotion Analysis)
                  │
                  ▼
      Firestore Database
                  │
                  ▼
     Real-Time Anonymous Feed
```

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend / Cloud
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting

## Artificial Intelligence
- Google Gemini API

## Development Tools
- Visual Studio Code
- Git
- GitHub

---

# 📂 Project Structure

```
SafeSpace/
│
├── index.html
├── feed.html
├── style.css
├── script.js
├── firebase.js
├── README.md
│
└── assets/
    ├── images/
    └── icons/
```

---

# 🚀 How It Works

1. User opens SafeSpace.
2. Anonymous authentication is performed using Firebase.
3. User selects a mood.
4. User writes an anonymous post.
5. The post is sent to Google Gemini.
6. Gemini analyzes the emotional tone.
7. Firestore stores:
   - Anonymous UID
   - Mood
   - Post
   - Emotion
   - Confidence
   - AI Support Message
   - Timestamp
8. The community feed updates automatically in real time.

---

# 📊 Firestore Data Structure

```json
posts
{
  "uid": "anonymous_user_id",
  "text": "I had a difficult day today.",
  "mood": "😔 Sad",
  "emotion": "Sadness",
  "confidence": 0.95,
  "supportMessage": "You're not alone. It's okay to have difficult days. Be kind to yourself.",
  "timestamp": "Firebase Timestamp"
}
```

---

# 💡 AI Workflow

```
User Post
      │
      ▼
Google Gemini API
      │
      ▼
Emotion Detection
      │
      ▼
Supportive Response Generation
      │
      ▼
Store in Firestore
      │
      ▼
Display in Community Feed
```

---

# 🔐 Privacy

- No names are collected.
- No email addresses are required.
- Users remain anonymous.
- Each user is identified only through a Firebase Anonymous UID.

---

# 📈 Future Enhancements

- 💬 Anonymous comments
- ❤️ Post reactions
- 📷 Image support
- 🚨 AI-based crisis detection
- 👥 Volunteer support system
- 🧠 Mood history dashboard
- 📊 Emotional trend analytics
- 🌙 Dark mode
- 📱 Progressive Web App (PWA)

---

# 🎯 Objectives

- Encourage emotional expression.
- Reduce stigma around mental health.
- Provide anonymous peer support.
- Use AI responsibly to understand emotions.
- Build a safe and inclusive online community.

---

# 📸 Screenshots

> Add screenshots of:
- Home Page
- Mood Selection
- Anonymous Post Screen
- AI Emotion Result
- Community Feed

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/SafeSpace.git
```

Navigate into the project

```bash
cd SafeSpace
```

Open using VS Code

```bash
code .
```

Configure Firebase

- Enable Anonymous Authentication
- Create a Firestore Database
- Add your Firebase configuration in `firebase.js`

Run the project

```bash
Open index.html using Live Server
```

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Authors

**Indukuri Kanthi**

B.Tech Computer Science and Engineering

---

## ❤️ SafeSpace

*"Because everyone deserves a place where they can be heard without fear of judgment."*
