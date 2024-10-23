import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    onSnapshot,
    addDoc,
    getDocs,
    collection,
    getFirestore,
    query,
    orderBy,
    doc,
    deleteDoc,
    limit,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// INIT DATABASE
const firebaseConfig = {
    projectId: "todolist-e2a07",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// CONSTANTS
const listUl = document.querySelector("#list-task-to-do");

const form = document.querySelector("#add-task-form");
const input = form.querySelector("input");
const button = form.querySelector("button");

const clearTaskBtn = document.querySelector("#clear-task-btn");

// EVENTS
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value;
    input.value = "";
    addTask(title);
});

// FUNCTIONS

function renderTask() {
    const q = query(collection(db, "task"), orderBy("index", "desc"));
    onSnapshot(q, (docs) => {
        listUl.innerHTML = "";
        docs.forEach((element) => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            const span = document.createElement("span");
            span.textContent = element.data().title;

            const button = document.createElement("button");
            button.className = "btn--delete";
            button.textContent = "Delete";
            button.setAttribute("data-id", element.id);

            button.addEventListener("click", async (event) => {
                const id = event.target.getAttribute("data-id");
                await deleteDoc(doc(db, "task", id));
            });

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(button);

            listUl.appendChild(li);
        });
    }, (error) => {
        console.error("Lỗi khi lấy nhiệm vụ: ", error);
        alert("Đã xảy ra lỗi khi lấy nhiệm vụ. Vui lòng thử lại.");
    });
}

async function addTask(title) {
    try {
        const q = query(collection(db, "task"), orderBy("index", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        let maxIndex = 0;
        if (!querySnapshot.empty) {
            maxIndex = querySnapshot.docs[0].data().index;
        }

        const data = {
            title,
            finished: false,
            index: maxIndex + 1,
        };

        await addDoc(collection(db, "task"), data);
    } catch (error) {
        console.error("Lỗi khi thêm nhiệm vụ: ", error);
        alert("Đã xảy ra lỗi khi thêm nhiệm vụ. Vui lòng thử lại.");
    }
}

async function deleteAllTask() {
    try {
        const q = query(collection(db, "task"));
        const querySnapshot = await getDocs(q);

        const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Lỗi khi xóa nhiệm vụ: ", error);
        alert("Đã xảy ra lỗi khi xóa nhiệm vụ. Vui lòng thử lại.");
    }
}

// MAIN

renderTask();
clearTaskBtn.addEventListener("click", deleteAllTask);