import initializeHomePage from "./js/HomePage.js";
import { loadHomePage, loadLoginPage } from "./js/initPages.js";
import initializeLoginPage from "./js/LoginPage.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const auth = getAuth();
const root = document.getElementById("root");

async function renderPage(pageFunction, initPageFunction) {
	const html = await pageFunction();
	root.innerHTML = html;
	
	if (typeof initPageFunction === 'function') {
		initPageFunction();
	}
}

onAuthStateChanged(auth, (user) => {
	if (user) {
		renderPage(loadHomePage, initializeHomePage);
	} else {
		renderPage(loadLoginPage, initializeLoginPage);
	}
});

async function renderPageWithAuth(pageFunction, initPageFunction, authRequired = true) {
	return new Promise((resolve, reject) => {
		onAuthStateChanged(auth, async (user) => {
			if (authRequired && !user) {
				await renderPage(loadLoginPage, initializeLoginPage);
				resolve(false);
			} else {
				await renderPage(pageFunction, initPageFunction);
				resolve(true);
			}
		});
	});
}

export {renderPage, renderPageWithAuth};