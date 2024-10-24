function errorMessage() {
	const errorMessage = document.createElement("span");
	errorMessage.textContent = "Error loading home page";
	errorMessage.style.color = "red";
	return errorMessage;
}

async function loadHomePage() {
	try {
		const response = await fetch("../pages/home.html");
		const html = await response.text();
		return html;
	} catch (error) {
		console.error("Error loading home page:", error);
		return errorMessage();
	}
}

async function loadLoginPage() {
	try {
		const response = await fetch("../pages/login.html");
		const html = await response.text();
		return html;
	} catch (error) {
		console.error("Error loading login page:", error);
		return errorMessage();
	}
}

export { loadHomePage, loadLoginPage };
