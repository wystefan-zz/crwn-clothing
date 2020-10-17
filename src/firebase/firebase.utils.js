import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAtT2jTrgL_tZLZugeH8_haB9jhULK07PY",
    authDomain: "crwn-db-fa60b.firebaseapp.com",
    databaseURL: "https://crwn-db-fa60b.firebaseio.com",
    projectId: "crwn-db-fa60b",
    storageBucket: "crwn-db-fa60b.appspot.com",
    messagingSenderId: "1018000723276",
    appId: "1:1018000723276:web:76f5c08d3230228f4e13e9",
    measurementId: "G-1VB7KB50N2"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;