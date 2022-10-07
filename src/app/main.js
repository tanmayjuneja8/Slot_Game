/* eslint-disable arrow-parens */
/* eslint-disable keyword-spacing */
/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-new */
import { App } from './components/app/app.component.js';

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
// import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyDGpftXp9HGjsnFZjnyxCbd_LF30JFNd30",
//     authDomain: "ultrapawz-9209d.firebaseapp.com",
//     databaseURL: "https://ultrapawz-9209d-default-rtdb.firebaseio.com",
//     projectId: "ultrapawz-9209d",
//     storageBucket: "ultrapawz-9209d.appspot.com",
//     messagingSenderId: "754512837862",
//     appId: "1:754512837862:web:243aea984d5307ffb3cf27",
//     measurementId: "G-RM7SR0NWJF",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const todosCol = collection(db, 'todos');
// const snapshot = await getDocs(todosCol);

// onAuthStateChanged(auth, user => {
//     if (user != null) {
//         console.log("logged in!");
//     }
//     else{
//         console.log("No user!");
//     }
// });

new App();
