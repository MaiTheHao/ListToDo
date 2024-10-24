import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
	apiKey: "AIzaSyBJcj_umWOYSg_WSa-Nod5S9W74hxmU5wI",
	authDomain: "todolist-e2a07.firebaseapp.com",
	projectId: "todolist-e2a07",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };