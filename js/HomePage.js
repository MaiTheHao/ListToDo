// IMPORT
import { db, auth } from "./db.js";
import { addDoc, getDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { renderPage } from "../index.js";
import { loadLoginPage } from "./initPages.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import initializeLoginPage from "./LoginPage.js";

// INIT
function initializeHomePage() {
	// CONSTANT
	const inputTask = document.querySelector("#new-task");
	const addTaskBtn = document.querySelector("#add-task-button");
	const taskList = document.querySelector("#task-list");
	const logoutBtn = document.getElementById("lgbtn");
	const userId = document.getElementById("user-id");
	const currUID = auth.currentUser.uid;
	const currListTask = `${currUID}LISTTASK`;

	// Kiểm tra sự tồn tại của các phần tử DOM
	if (!inputTask || !addTaskBtn || !taskList) {
		console.warn("Không tìm thấy trang chủ!");
		return;
	}

	// EVENT
	userId.textContent = auth.currentUser.email;
	
	logoutBtn.addEventListener("click", async () => {
		await signOut(auth);
		await renderPage(loadLoginPage, initializeLoginPage);
	});

	addTaskBtn.addEventListener("click", async () => {
		const task = inputTask.value.trim();
		if (task) {
			await addDoc(collection(db, currListTask), {
				task: task,
				completed: false,
			});
			inputTask.value = "";
		} else alert("Phải nhập đầy đủ task");
	});

	// FUNC
	function handleTaskChange(change) {
		if (change.type === "added") {
			const docRef = change.doc;
			const currStatus = docRef.data().completed;

			// Create task list item
			const li = document.createElement("li");
			const span = document.createElement("span");
			li.setAttribute("data-id", docRef.id);
			span.className = `task-text ${currStatus ? "completed" : ""}`;
			span.textContent = docRef.data().task;
			const button = document.createElement("button");
			button.className = "delete-button";
			button.textContent = "Delete";
			li.appendChild(span);
			li.appendChild(button);
			taskList.appendChild(li);

			// Toggle task completion status
			span.addEventListener("click", async () => {
				const doc = await getDoc(docRef.ref);
				const newStatus = !doc.data().completed;

				try {
					await updateDoc(docRef.ref, {
						completed: newStatus,
					});
					span.classList.toggle("completed", newStatus);
				} catch (e) {
					console.error("Error updating document: ", e);
				}
			});

			// Delete task
			button.addEventListener("click", async () => {
				try {
					await deleteDoc(docRef.ref);
					taskList.removeChild(li);
				} catch (e) {
					console.error("Error deleting document: ", e);
				}
			});
		}
	}

	// MAIN
	onSnapshot(collection(db, currListTask), (snapshot) => {
		snapshot.docChanges().forEach(handleTaskChange);
	});
}

export default initializeHomePage;
