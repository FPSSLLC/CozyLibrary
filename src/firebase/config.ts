import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjJmdfkeS9XoAoBy97Hsy6_wu2she7JT0",
  authDomain: "cozylibrary.firebaseapp.com",
  projectId: "cozylibrary",
  storageBucket: "cozylibrary.firebasestorage.app",
  messagingSenderId: "124744538070",
  appId: "1:124744538070:web:0a9f22b57fcb0e2125f677"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Book type definition
export type Book = {
  id?: string;
  title: string;
  author: string;
  isCheckedOut: boolean;
  nfcTag?: string;
  checkedOutDate?: Date;
  dueDate?: Date;
}