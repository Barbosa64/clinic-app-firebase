Projeto Final Front-End Flag

# Clinic App with Firebase

## 📌 Overview

Clinic App (Firebase Front-End) is a web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Firebase**.  
It provides a modern interface for managing clinic-related operations such as authentication, patient data, and UI navigation.

This project connects to Firebase services for authentication, Firestore/Storage, and real-time data handling.

---

## ⭐ Key Features

- Firebase Authentication (Email/Password)
- Firestore database integration
- Firebase Storage rules included
- React + TypeScript front-end architecture
- Tailwind CSS for responsive UI
- Vite for fast development and optimized builds
- Modular and scalable folder structure

---

## 📁 Project Structure

```
clinic-app-firebase/
│
├── src/                     # Application source code
│   ├── components/          # Reusable UI components
│   ├── pages/               # Application pages
│   ├── context/             # Auth and global context
│   ├── firebase/            # Firebase configuration
│   └── styles/              # Tailwind and global styles
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── storage.rules             # Firebase Storage rules
└── README.md

```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js v18+
- npm or yarn
- Firebase account + project

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```
git clone https://github.com/Barbosa64/clinic-app-firebase.git
cd clinic-app-firebase
```
2. Install dependencies
```
npm install
```
3. Configure Firebase
Create a file:
src/firebase/firebase.ts
Add your Firebase configuration:

```
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
```
4. Run the development server
```
npm run dev
```

App will be available at:

```
http://localhost:5173
```
📦 Build for Production
bash
npm run build
Output will be generated in:

Código
dist/
### 🔐 Firebase Storage Rules

The project includes a storage.rules file:

storage.rules


## 🌐 Deployment
### You can deploy using:

#### Netlify

#### Vercel

#### Firebase Hosting

Example (Netlify deployment used in the project):

https://clinicaprojetoflag.netlify.app/

📚 Documentation & Help
React Docs: https://react.dev

Firebase Docs: https://firebase.google.com/docs

Vite Docs: https://vitejs.dev

Tailwind Docs: https://tailwindcss.com/docs
