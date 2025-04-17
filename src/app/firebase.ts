import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCt8DktnvI1yvNkaTh5i084Qf28i5BKvQI",
  authDomain: "chatapplication-with-cha-c4fd2.firebaseapp.com",
  projectId: "chatapplication-with-cha-c4fd2",
  storageBucket: "chatapplication-with-cha-c4fd2.firebasestorage.app",
  messagingSenderId: "312132893160",
  appId: "1:312132893160:web:79c6ba8ebe10ad07ef0c5d",
  measurementId: "G-0GQRJWERCM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth (これらはどの環境でも動作する)
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics (ブラウザ環境でのみ実行)
export let analytics: unknown= null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  });
}
