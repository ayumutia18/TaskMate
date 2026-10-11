import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDLQUt_qKJJBvvCLnRKCmauTy6KySWy--Q',
  authDomain: 'taskmate-3a358.firebaseapp.com',
  projectId: 'taskmate-3a358',
  storageBucket: 'taskmate-3a358.firebasestorage.app',
  messagingSenderId: '987214042491',
  appId: '1:987214042491:web:3a96df416f7bd7d93f19de',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
