import { auth } from "./db.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { renderPageWithAuth } from "../index.js";
import { loadHomePage } from "./initPages.js";
import initializeHomePage from "./HomePage.js";

let crrPage = true;

// DOM
function renderLoginForm() {
    const form = document.getElementById("login-form");
    const SIGNIN = `
        <h2>Đăng nhập</h2>
        <form action="/login" method="post">
            <input type="text" name="email" placeholder="Email" id="input-email" required />
            <input type="password" name="password" placeholder="Mật khẩu" id="input-pass" required />
            <button type="submit" id="submit-btn">Đăng nhập</button>
        </form>
        <div class="login-link">
            <p>Chưa có tài khoản? <a id="btn-advance">Đăng ký</a></p>
        </div>
    `;

    const SIGNUP = `
        <h2>Đăng ký</h2>
        <form action="/signup" method="post">
            <input type="text" name="email" placeholder="Email" id="signup-email" required />
            <input type="password" name="password" placeholder="Mật khẩu" id="signup-pass" required />
            <input type="password" name="confirm-password" placeholder="Xác nhận mật khẩu" id="confirm-pass" required />
            <button type="submit" id="submit-btn">Đăng ký</button>
        </form>
        <div class="login-link">
            <p>Đã có tài khoản? <a id="btn-advance">Đăng nhập</a></p>
        </div>
    `;

    form.innerHTML = crrPage ? SIGNIN : SIGNUP;
}

function SignIn() {
    const emailInput = document.querySelector("#input-email");
    const passwordInput = document.querySelector("#input-pass");
    const loginBtn = document.querySelector("#submit-btn");
    const advanceBtn = document.querySelector("#btn-advance");

    if (!emailInput || !passwordInput || !loginBtn) {
        console.warn("Không tìm thấy trang đăng nhập!");
        return;
    }

    loginBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email && password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                const res = await renderPageWithAuth(loadHomePage, initializeHomePage);
                if (!res) alert("Bạn chưa đăng nhập!");
            } catch (error) {
                console.error("Error logging in: ", error);
                alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
            }
        } else {
            alert("Phải nhập đầy đủ email và mật khẩu");
        }
    });

    advanceBtn.addEventListener("click", () => {
        crrPage = !crrPage;
        initializeLoginPage();
    });
}

function SignUp(){
    const emailInput = document.querySelector("#signup-email");
    const passwordInput = document.querySelector("#signup-pass");
    const confirmPasswordInput = document.querySelector("#confirm-pass");
    const signupBtn = document.querySelector("#submit-btn");
    const advanceBtn = document.querySelector("#btn-advance");

    if (!emailInput || !passwordInput || !confirmPasswordInput || !signupBtn) {
        console.warn("Không tìm thấy trang đăng ký!");
        return;
    }

    signupBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (email && password && confirmPassword) {
            if (password !== confirmPassword) {
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Đăng ký thành công!");
                crrPage = true;
                initializeLoginPage();
            } catch (error) {
                console.error("Error signing up: ", error);
                alert("Đăng ký thất bại. Vui lòng thử lại.");
            }
        } else {
            alert("Phải nhập đầy đủ email và mật khẩu");
        }
    });

    advanceBtn.addEventListener("click", () => {
        crrPage = !crrPage;
        initializeLoginPage();
    });
}

function initializeLoginPage() {
    renderLoginForm();
    if (crrPage) SignIn();
    else SignUp();
}

export default initializeLoginPage;
